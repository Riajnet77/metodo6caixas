from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import os

SECRET_KEY = os.environ.get("SECRET_KEY", "")
_auth_db = None

def configure_auth(db):
    global _auth_db
    _auth_db = db
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    company_id: Optional[str] = None
    auth_version: int = 0

class User(BaseModel):
    id: str
    email: str
    full_name: str
    company_id: str
    company_name: str
    is_active: bool = True
    created_at: datetime

class UserInDB(User):
    hashed_password: str

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    company_name: str

class UserLogin(BaseModel):
    email: str
    password: str

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if len(plain_password.encode("utf-8")) > 72:
            return False
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except (ValueError, TypeError, AttributeError):
        return False

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    if len(SECRET_KEY) < 32:
        raise HTTPException(503, "Autenticação temporariamente indisponível. Fale com o suporte.")
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    if len(SECRET_KEY) < 32:
        raise HTTPException(503, "Autenticação temporariamente indisponível. Fale com o suporte.")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        company_id: str = payload.get("company_id")
        if user_id is None or email is None or company_id is None:
            raise credentials_exception
        version = payload.get("ver", 0)
        if not isinstance(version, int) or version < 0:
            raise credentials_exception
        if _auth_db is None:
            raise HTTPException(503, "Autenticação temporariamente indisponível")
        user = await _auth_db.users.find_one({"id": user_id, "company_id": company_id})
        if not user or user.get("auth_version", 0) != version:
            raise credentials_exception
        from backend.customer_access import ensure_account_access
        await ensure_account_access(_auth_db, user)
        return TokenData(user_id=user_id, email=email, company_id=company_id, auth_version=version)
    except JWTError:
        raise credentials_exception
