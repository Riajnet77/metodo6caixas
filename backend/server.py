from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
from collections import defaultdict

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

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
    user_id: str = "default_user"  # For MVP, single user
    monthly_income: float
    categories: List[Category] = Field(default_factory=lambda: [Category(**cat) for cat in DEFAULT_CATEGORIES])
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSettingsCreate(BaseModel):
    monthly_income: float
    categories: Optional[List[Category]] = None

class UserSettingsUpdate(BaseModel):
    monthly_income: Optional[float] = None
    categories: Optional[List[Category]] = None

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = "default_user"
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
    user_id: str = "default_user"
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
    deviation: float
    status: str  # "ok", "warning", "critical"

class DashboardData(BaseModel):
    monthly_income: float
    total_expenses: float
    balance: float
    categories_summary: List[CategorySummary]
    month: int
    year: int

# ==================== HELPER FUNCTIONS ====================

def calculate_status(actual_percentage: float, ideal_percentage: float) -> str:
    """Calculate status based on deviation from ideal"""
    if actual_percentage <= ideal_percentage * 0.9:
        return "ok"  # Under budget
    elif actual_percentage <= ideal_percentage:
        return "warning"  # Close to limit
    else:
        return "critical"  # Over budget

async def get_or_create_settings() -> UserSettings:
    """Get existing settings or create default ones"""
    settings_doc = await db.user_settings.find_one({"user_id": "default_user"}, {"_id": 0})
    
    if settings_doc:
        # Convert ISO strings back to datetime
        if isinstance(settings_doc.get('created_at'), str):
            settings_doc['created_at'] = datetime.fromisoformat(settings_doc['created_at'])
        if isinstance(settings_doc.get('updated_at'), str):
            settings_doc['updated_at'] = datetime.fromisoformat(settings_doc['updated_at'])
        return UserSettings(**settings_doc)
    
    # Create default settings
    default_settings = UserSettings(monthly_income=5000.0)
    doc = default_settings.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.user_settings.insert_one(doc)
    return default_settings

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "O Hábito da Economia e Gestão Financeira API"}

# Settings Routes
@api_router.get("/settings", response_model=UserSettings)
async def get_settings():
    return await get_or_create_settings()

@api_router.post("/settings", response_model=UserSettings)
async def create_settings(input: UserSettingsCreate):
    # Check if settings already exist
    existing = await db.user_settings.find_one({"user_id": "default_user"})
    if existing:
        raise HTTPException(status_code=400, detail="Settings already exist. Use PUT to update.")
    
    categories = input.categories if input.categories else [Category(**cat) for cat in DEFAULT_CATEGORIES]
    settings = UserSettings(monthly_income=input.monthly_income, categories=categories)
    
    doc = settings.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.user_settings.insert_one(doc)
    return settings

@api_router.put("/settings", response_model=UserSettings)
async def update_settings(input: UserSettingsUpdate):
    existing_doc = await db.user_settings.find_one({"user_id": "default_user"}, {"_id": 0})
    if not existing_doc:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    # Convert ISO strings back to datetime
    if isinstance(existing_doc.get('created_at'), str):
        existing_doc['created_at'] = datetime.fromisoformat(existing_doc['created_at'])
    if isinstance(existing_doc.get('updated_at'), str):
        existing_doc['updated_at'] = datetime.fromisoformat(existing_doc['updated_at'])
    
    settings = UserSettings(**existing_doc)
    
    if input.monthly_income is not None:
        settings.monthly_income = input.monthly_income
    if input.categories is not None:
        settings.categories = input.categories
    
    settings.updated_at = datetime.now(timezone.utc)
    
    doc = settings.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.user_settings.update_one(
        {"user_id": "default_user"},
        {"$set": doc}
    )
    
    return settings

# Transaction Routes
@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(month: Optional[int] = None, year: Optional[int] = None, category: Optional[str] = None):
    query = {"user_id": "default_user"}
    
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
async def create_transaction(input: TransactionCreate):
    transaction = Transaction(
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
async def update_transaction(transaction_id: str, input: TransactionUpdate):
    existing_doc = await db.transactions.find_one({"id": transaction_id, "user_id": "default_user"}, {"_id": 0})
    if not existing_doc:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
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
        {"id": transaction_id},
        {"$set": doc}
    )
    
    return transaction

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str):
    result = await db.transactions.delete_one({"id": transaction_id, "user_id": "default_user"})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}

# Goal Routes
@api_router.get("/goals", response_model=List[Goal])
async def get_goals():
    goals = await db.goals.find({"user_id": "default_user"}, {"_id": 0}).to_list(100)
    
    for goal in goals:
        if isinstance(goal.get('deadline'), str):
            goal['deadline'] = datetime.fromisoformat(goal['deadline'])
        if isinstance(goal.get('created_at'), str):
            goal['created_at'] = datetime.fromisoformat(goal['created_at'])
    
    return goals

@api_router.post("/goals", response_model=Goal)
async def create_goal(input: GoalCreate):
    goal = Goal(
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
async def update_goal(goal_id: str, input: GoalUpdate):
    existing_doc = await db.goals.find_one({"id": goal_id, "user_id": "default_user"}, {"_id": 0})
    if not existing_doc:
        raise HTTPException(status_code=404, detail="Goal not found")
    
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
        {"id": goal_id},
        {"$set": doc}
    )
    
    return goal

@api_router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str):
    result = await db.goals.delete_one({"id": goal_id, "user_id": "default_user"})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"message": "Goal deleted successfully"}

# Dashboard Route
@api_router.get("/dashboard", response_model=DashboardData)
async def get_dashboard(month: Optional[int] = None, year: Optional[int] = None):
    # Use current month/year if not provided
    now = datetime.now()
    target_month = month if month is not None else now.month
    target_year = year if year is not None else now.year
    
    # Get settings
    settings = await get_or_create_settings()
    
    # Get transactions for the specified month
    transactions = await db.transactions.find({
        "user_id": "default_user",
        "month": target_month,
        "year": target_year
    }, {"_id": 0}).to_list(1000)
    
    # Calculate totals by category
    category_totals = defaultdict(float)
    total_expenses = 0.0
    
    for trans in transactions:
        category_totals[trans['category']] += trans['amount']
        total_expenses += trans['amount']
    
    # Build category summaries
    categories_summary = []
    for cat in settings.categories:
        actual_amount = category_totals.get(cat.name, 0.0)
        ideal_amount = settings.monthly_income * (cat.ideal_percentage / 100)
        actual_percentage = (actual_amount / settings.monthly_income * 100) if settings.monthly_income > 0 else 0
        deviation = actual_percentage - cat.ideal_percentage
        status = calculate_status(actual_percentage, cat.ideal_percentage)
        
        categories_summary.append(CategorySummary(
            name=cat.name,
            ideal_amount=ideal_amount,
            ideal_percentage=cat.ideal_percentage,
            actual_amount=actual_amount,
            actual_percentage=actual_percentage,
            deviation=deviation,
            status=status
        ))
    
    balance = settings.monthly_income - total_expenses
    
    return DashboardData(
        monthly_income=settings.monthly_income,
        total_expenses=total_expenses,
        balance=balance,
        categories_summary=categories_summary,
        month=target_month,
        year=target_year
    )

# Example data route
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

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()