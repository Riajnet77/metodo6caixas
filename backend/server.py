from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
from collections import defaultdict

# Import authentication functions
from backend.auth import (
    Token, TokenData, User, UserInDB, UserCreate, UserLogin,
    verify_password, get_password_hash, create_access_token, get_current_user
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(
    docs_url=None,      # Desabilita /docs em produção
    redoc_url=None,     # Desabilita /redoc em produção
    openapi_url=None,   # Desabilita /openapi.json em produção
)

# Rate limiting por IP
from collections import defaultdict
import time

rate_limit_store = defaultdict(list)

def check_rate_limit(ip: str, max_requests: int = 10, window: int = 60) -> bool:
    now = time.time()
    requests = rate_limit_store[ip]
    # Remove requests fora da janela
    rate_limit_store[ip] = [r for r in requests if now - r < window]
    if len(rate_limit_store[ip]) >= max_requests:
        return False
    rate_limit_store[ip].append(now)
    return True

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Default categories with ideal percentages
DEFAULT_CATEGORIES = [
    {"name": "Viver", "ideal_percentage": 50, "description": "Moradia, alimentação, transporte"},
    {"name": "Liberdade Financeira", "ideal_percentage": 10, "description": "Investimentos"},
    {"name": "Longo Prazo", "ideal_percentage": 10, "description": "Poupança para sonhos grandes"},
    {"name": "Educação", "ideal_percentage": 10, "description": "Cursos, livros, desenvolvimento"},
    {"name": "Doação", "ideal_percentage": 10, "description": "Dízimo, ofertas, projetos sociais"},
    {"name": "Lazer", "ideal_percentage": 10, "description": "Entretenimento, viagens"}
]

# ==================== MODELS ====================

class Category(BaseModel):
    name: str
    ideal_percentage: float
    description: str = ""

class UserSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    company_id: str
    month: int  # Mês da configuração
    year: int   # Ano da configuração
    monthly_income: float  # Renda mensal fixa
    extra_income: float = 0.0  # Renda extra do mês
    total_income: float  # Renda total (calculado automaticamente)
    categories: List[Category] = Field(default_factory=lambda: [Category(**cat) for cat in DEFAULT_CATEGORIES])
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSettingsCreate(BaseModel):
    month: int
    year: int
    monthly_income: float
    extra_income: float = 0.0
    categories: Optional[List[Category]] = None

class UserSettingsUpdate(BaseModel):
    monthly_income: Optional[float] = None
    extra_income: Optional[float] = None
    categories: Optional[List[Category]] = None

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    company_id: str
    date: datetime
    description: str
    category: str
    amount: float
    month: int
    year: int
    notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TransactionCreate(BaseModel):
    date: datetime
    description: str
    category: str
    amount: float
    notes: Optional[str] = ""

class TransactionUpdate(BaseModel):
    date: Optional[datetime] = None
    description: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    notes: Optional[str] = None

class Goal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    company_id: str
    name: str
    category: str
    target_amount: float
    deadline: Optional[datetime] = None
    current_amount: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GoalCreate(BaseModel):
    name: str
    category: str
    target_amount: float
    deadline: Optional[datetime] = None

class GoalUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    target_amount: Optional[float] = None
    deadline: Optional[datetime] = None
    current_amount: Optional[float] = None

class CategorySummary(BaseModel):
    name: str
    ideal_amount: float
    ideal_percentage: float
    actual_amount: float
    actual_percentage: float
    execution_percentage: float  # Novo: (Real / Ideal) × 100
    status: str

class DashboardData(BaseModel):
    monthly_income: float
    extra_income: float
    total_income: float
    total_expenses: float
    balance: float
    categories_summary: List[CategorySummary]
    month: int
    year: int

# ==================== HELPER FUNCTIONS ====================

def calculate_status(execution_percentage: float) -> str:
    """
    Calculate status based on execution percentage
    < 100%: ok (gastou menos - BOM)
    = 100%: warning (gastou exatamente - OK)
    > 100%: critical (gastou mais - RUIM)
    """
    if execution_percentage < 100:
        return "ok"  # Verde - gastou menos que o ideal
    elif execution_percentage == 100:
        return "perfect"  # Azul - gastou exatamente o ideal
    else:
        return "critical"  # Vermelho - gastou mais que o ideal

async def get_or_create_settings(user_id: str, company_id: str, month: int, year: int) -> UserSettings:
    """Get existing settings for specific month or create default ones"""
    settings_doc = await db.user_settings.find_one(
        {"user_id": user_id, "company_id": company_id, "month": month, "year": year}, 
        {"_id": 0}
    )
    
    if settings_doc:
        if isinstance(settings_doc.get('created_at'), str):
            settings_doc['created_at'] = datetime.fromisoformat(settings_doc['created_at'])
        if isinstance(settings_doc.get('updated_at'), str):
            settings_doc['updated_at'] = datetime.fromisoformat(settings_doc['updated_at'])
        return UserSettings(**settings_doc)
    
    # Create default settings for this month
    default_settings = UserSettings(
    user_id=user_id,
    company_id=company_id,
    month=month,
    year=year,
    monthly_income=0.0,
    extra_income=0.0,
    total_income=0.0
)
    doc = default_settings.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.user_settings.insert_one(doc)
    return default_settings

# ==================== AUTHENTICATION ROUTES ====================

@auth_router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email já cadastrado"
        )
    
    # Create company_id from company name
    company_id = str(uuid.uuid4())
    
    # Create user
    user = UserInDB(
        id=str(uuid.uuid4()),
        email=user_data.email,
        full_name=user_data.full_name,
        company_id=company_id,
        company_name=user_data.company_name,
        hashed_password=get_password_hash(user_data.password[:72]),
        is_active=True,
        created_at=datetime.now(timezone.utc)
    )
    
    # Save to database
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token(
        data={
            "sub": user.id,
            "email": user.email,
            "company_id": user.company_id
        }
    )
    
    return Token(access_token=access_token, token_type="bearer")

@auth_router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user"""
    # Find user
    user_doc = await db.users.find_one({"email": form_data.username})
    if not user_doc:
        raise HTTPException(
            status_code=401,
            detail="Email ou senha incorretos"
        )
    
    # Convert dates
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = UserInDB(**user_doc)
    
    # Verify password
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Email ou senha incorretos"
        )
    
    # Create access token
    access_token = create_access_token(
        data={
            "sub": user.id,
            "email": user.email,
            "company_id": user.company_id
        }
    )
    
    return Token(access_token=access_token, token_type="bearer")

@auth_router.get("/me", response_model=User)
async def get_me(current_user: TokenData = Depends(get_current_user)):
    """Get current user info"""
    user_doc = await db.users.find_one({"id": current_user.user_id}, {"_id": 0, "hashed_password": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    return User(**user_doc)

# ==================== PROTECTED ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "O Hábito da Economia e Gestão Financeira API"}

# Settings Routes
@api_router.get("/settings", response_model=UserSettings)
async def get_settings(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: TokenData = Depends(get_current_user)
):
    now = datetime.now()
    target_month = month if month is not None else now.month
    target_year = year if year is not None else now.year
    return await get_or_create_settings(current_user.user_id, current_user.company_id, target_month, target_year)

@api_router.put("/settings", response_model=UserSettings)
async def update_settings(
    input: UserSettingsUpdate,
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: TokenData = Depends(get_current_user)
):
    now = datetime.now()
    target_month = month if month is not None else now.month
    target_year = year if year is not None else now.year
    
    settings = await get_or_create_settings(current_user.user_id, current_user.company_id, target_month, target_year)
    
    if input.monthly_income is not None:
        settings.monthly_income = input.monthly_income
    if input.extra_income is not None:
        settings.extra_income = input.extra_income
    if input.categories is not None:
        settings.categories = input.categories
    
    # Recalcular total_income
    settings.total_income = settings.monthly_income + settings.extra_income
    settings.updated_at = datetime.now(timezone.utc)
    
    doc = settings.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.user_settings.update_one(
        {"user_id": current_user.user_id, "company_id": current_user.company_id, "month": target_month, "year": target_year},
        {"$set": doc},
        upsert=True
    )
    
    return settings

# Transaction Routes
@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(
    month: Optional[int] = None,
    year: Optional[int] = None,
    category: Optional[str] = None,
    current_user: TokenData = Depends(get_current_user)
):
    query = {"user_id": current_user.user_id, "company_id": current_user.company_id}
    
    if month is not None:
        query["month"] = month
    if year is not None:
        query["year"] = year
    if category is not None:
        query["category"] = category
    
    transactions = await db.transactions.find(query, {"_id": 0}).sort("date", -1).to_list(1000)
    
    for trans in transactions:
        if isinstance(trans.get('date'), str):
            trans['date'] = datetime.fromisoformat(trans['date'])
        if isinstance(trans.get('created_at'), str):
            trans['created_at'] = datetime.fromisoformat(trans['created_at'])
    
    return transactions

@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(
    input: TransactionCreate,
    current_user: TokenData = Depends(get_current_user)
):
    transaction = Transaction(
        user_id=current_user.user_id,
        company_id=current_user.company_id,
        date=input.date,
        description=input.description,
        category=input.category,
        amount=input.amount,
        notes=input.notes,
        month=input.date.month,
        year=input.date.year
    )
    
    doc = transaction.model_dump()
    doc['date'] = doc['date'].isoformat()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.transactions.insert_one(doc)
    return transaction

@api_router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(
    transaction_id: str,
    input: TransactionUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    existing_doc = await db.transactions.find_one({
        "id": transaction_id,
        "user_id": current_user.user_id,
        "company_id": current_user.company_id
    }, {"_id": 0})
    
    if not existing_doc:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    
    if isinstance(existing_doc.get('date'), str):
        existing_doc['date'] = datetime.fromisoformat(existing_doc['date'])
    if isinstance(existing_doc.get('created_at'), str):
        existing_doc['created_at'] = datetime.fromisoformat(existing_doc['created_at'])
    
    transaction = Transaction(**existing_doc)
    
    if input.date is not None:
        transaction.date = input.date
        transaction.month = input.date.month
        transaction.year = input.date.year
    if input.description is not None:
        transaction.description = input.description
    if input.category is not None:
        transaction.category = input.category
    if input.amount is not None:
        transaction.amount = input.amount
    if input.notes is not None:
        transaction.notes = input.notes
    
    doc = transaction.model_dump()
    doc['date'] = doc['date'].isoformat()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.transactions.update_one(
        {"id": transaction_id, "company_id": current_user.company_id},
        {"$set": doc}
    )
    
    return transaction

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    result = await db.transactions.delete_one({
        "id": transaction_id,
        "user_id": current_user.user_id,
        "company_id": current_user.company_id
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    return {"message": "Transação excluída com sucesso"}

# Goal Routes
@api_router.get("/goals", response_model=List[Goal])
async def get_goals(current_user: TokenData = Depends(get_current_user)):
    goals = await db.goals.find({
        "user_id": current_user.user_id,
        "company_id": current_user.company_id
    }, {"_id": 0}).to_list(100)
    
    for goal in goals:
        if isinstance(goal.get('deadline'), str) and goal.get('deadline'):
            goal['deadline'] = datetime.fromisoformat(goal['deadline'])
        if isinstance(goal.get('created_at'), str):
            goal['created_at'] = datetime.fromisoformat(goal['created_at'])
    
    return goals

@api_router.post("/goals", response_model=Goal)
async def create_goal(
    input: GoalCreate,
    current_user: TokenData = Depends(get_current_user)
):
    goal = Goal(
        user_id=current_user.user_id,
        company_id=current_user.company_id,
        name=input.name,
        category=input.category,
        target_amount=input.target_amount,
        deadline=input.deadline
    )
    
    doc = goal.model_dump()
    if doc.get('deadline'):
        doc['deadline'] = doc['deadline'].isoformat()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.goals.insert_one(doc)
    return goal

@api_router.put("/goals/{goal_id}", response_model=Goal)
async def update_goal(
    goal_id: str,
    input: GoalUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    existing_doc = await db.goals.find_one({
        "id": goal_id,
        "user_id": current_user.user_id,
        "company_id": current_user.company_id
    }, {"_id": 0})
    
    if not existing_doc:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    
    if isinstance(existing_doc.get('deadline'), str) and existing_doc.get('deadline'):
        existing_doc['deadline'] = datetime.fromisoformat(existing_doc['deadline'])
    if isinstance(existing_doc.get('created_at'), str):
        existing_doc['created_at'] = datetime.fromisoformat(existing_doc['created_at'])
    
    goal = Goal(**existing_doc)
    
    if input.name is not None:
        goal.name = input.name
    if input.category is not None:
        goal.category = input.category
    if input.target_amount is not None:
        goal.target_amount = input.target_amount
    if input.deadline is not None:
        goal.deadline = input.deadline
    if input.current_amount is not None:
        goal.current_amount = input.current_amount
    
    doc = goal.model_dump()
    if doc.get('deadline'):
        doc['deadline'] = doc['deadline'].isoformat()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.goals.update_one(
        {"id": goal_id, "company_id": current_user.company_id},
        {"$set": doc}
    )
    
    return goal

@api_router.delete("/goals/{goal_id}")
async def delete_goal(
    goal_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    result = await db.goals.delete_one({
        "id": goal_id,
        "user_id": current_user.user_id,
        "company_id": current_user.company_id
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    return {"message": "Meta excluída com sucesso"}

# Dashboard Route
@api_router.get("/dashboard", response_model=DashboardData)
async def get_dashboard(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: TokenData = Depends(get_current_user)
):
    now = datetime.now()
    target_month = month if month is not None else now.month
    target_year = year if year is not None else now.year
    
    settings = await get_or_create_settings(current_user.user_id, current_user.company_id, target_month, target_year)
    
    transactions = await db.transactions.find({
        "user_id": current_user.user_id,
        "company_id": current_user.company_id,
        "month": target_month,
        "year": target_year
    }, {"_id": 0}).to_list(1000)
    
    category_totals = defaultdict(float)
    total_expenses = 0.0
    
    for trans in transactions:
        category_totals[trans['category']] += trans['amount']
        total_expenses += trans['amount']
    
    categories_summary = []
    for cat in settings.categories:
        actual_amount = category_totals.get(cat.name, 0.0)
        ideal_amount = settings.total_income * (cat.ideal_percentage / 100)
        actual_percentage = (actual_amount / settings.total_income * 100) if settings.total_income > 0 else 0
        
        # Novo cálculo: Executado % = (Real / Ideal) × 100
        if ideal_amount > 0:
            execution_percentage = (actual_amount / ideal_amount) * 100
        else:
            execution_percentage = 0.0
        
        status = calculate_status(execution_percentage)
        
        categories_summary.append(CategorySummary(
            name=cat.name,
            ideal_amount=ideal_amount,
            ideal_percentage=cat.ideal_percentage,
            actual_amount=actual_amount,
            actual_percentage=actual_percentage,
            execution_percentage=execution_percentage,
            status=status
        ))
    
    balance = settings.total_income - total_expenses
    
    return DashboardData(
        monthly_income=settings.monthly_income,
        extra_income=settings.extra_income,
        total_income=settings.total_income,
        total_expenses=total_expenses,
        balance=balance,
        categories_summary=categories_summary,
        month=target_month,
        year=target_year
    )

# Example data route (public - no authentication required)
@api_router.get("/examples/{profile_type}")
async def get_example_data(profile_type: str):
    """Get example data for 'iniciante' or 'veterano' profiles"""
    
    if profile_type == "iniciante":
        return {
            "profile": "Iniciante",
            "monthly_income": 5000.0,
            "transactions": [
                {"description": "Aluguel", "category": "Viver", "amount": 1500},
                {"description": "Mercado", "category": "Viver", "amount": 800},
                {"description": "Transporte", "category": "Viver", "amount": 400},
                {"description": "Conta de luz", "category": "Viver", "amount": 200},
                {"description": "Internet", "category": "Viver", "amount": 100},
                {"description": "Restaurantes", "category": "Viver", "amount": 500},
                {"description": "Netflix", "category": "Lazer", "amount": 50},
                {"description": "Cinema", "category": "Lazer", "amount": 150},
                {"description": "Roupas", "category": "Lazer", "amount": 300},
                {"description": "Compras impulsivas", "category": "Lazer", "amount": 400}
            ],
            "description": "Sem controle, gastando demais em supérfluos"
        }
    elif profile_type == "veterano":
        return {
            "profile": "Veterano",
            "monthly_income": 5000.0,
            "transactions": [
                {"description": "Aluguel", "category": "Viver", "amount": 1500},
                {"description": "Mercado", "category": "Viver", "amount": 600},
                {"description": "Transporte", "category": "Viver", "amount": 300},
                {"description": "Contas", "category": "Viver", "amount": 200},
                {"description": "Investimentos", "category": "Liberdade Financeira", "amount": 500},
                {"description": "Poupança", "category": "Longo Prazo", "amount": 500},
                {"description": "Curso online", "category": "Educação", "amount": 300},
                {"description": "Livros", "category": "Educação", "amount": 100},
                {"description": "Dízimo", "category": "Doação", "amount": 500},
                {"description": "Cinema", "category": "Lazer", "amount": 100},
                {"description": "Streaming", "category": "Lazer", "amount": 50}
            ],
            "description": "Controle total, equilibrando todas as áreas"
        }
    else:
        raise HTTPException(status_code=404, detail="Profile type not found. Use 'iniciante' or 'veterano'")

# Include routers
app.include_router(auth_router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Rate limiting nas rotas de auth
        if request.url.path in ["/api/auth/login", "/api/auth/register"]:
            ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
            ip = ip.split(",")[0].strip()
            if not check_rate_limit(ip, max_requests=5, window=60):
                origin = request.headers.get("origin", "*")
                return Response(
                    content='{"detail": "Muitas tentativas. Aguarde 1 minuto e tente novamente."}',
                    status_code=429,
                    media_type="application/json",
                    headers={
                        "Access-Control-Allow-Origin": origin,
                        "Access-Control-Allow-Credentials": "true",
                        "Access-Control-Allow-Methods": "*",
                        "Access-Control-Allow-Headers": "*",
        }
    )

        response = await call_next(request)

        # Headers de segurança
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        response.headers["Cache-Control"] = "no-store"

        return response

app.add_middleware(SecurityHeadersMiddleware)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
