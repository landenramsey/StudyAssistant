from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from app.database import get_db, User
from datetime import datetime

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserSignUp(BaseModel):
    username: str  # This will be the UNCW email
    password: str
    first_name: str
    last_name: str
    year: str
    major: str

class UserSignIn(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str  # This is the email
    first_name: str = None
    last_name: str = None
    email: str = None  # Keep for backwards compatibility
    year: str
    major: str
    created_at: str
    last_login: str

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    # Bcrypt has a 72-byte limit, so truncate if necessary
    if len(plain_password.encode('utf-8')) > 72:
        plain_password = plain_password[:72]
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password."""
    # Bcrypt has a 72-byte limit, so truncate if necessary
    if len(password.encode('utf-8')) > 72:
        password = password[:72]
    return pwd_context.hash(password)

@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserSignUp, db: Session = Depends(get_db)):
    """Create a new user account."""
    # Validate email format (username is the email)
    if not user_data.username.endswith('@uncw.edu'):
        raise HTTPException(status_code=400, detail="Please use your UNCW email address (@uncw.edu)")
    
    # Check if username (email) already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="This email is already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,  # Username is the email
        password_hash=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.username,  # Also store in email field for backwards compatibility
        year=user_data.year,
        major=user_data.major
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return UserResponse(
        id=new_user.id,
        username=new_user.username,
        first_name=new_user.first_name,
        last_name=new_user.last_name,
        email=new_user.email,
        year=new_user.year,
        major=new_user.major,
        created_at=new_user.created_at.isoformat() if new_user.created_at else "",
        last_login=new_user.last_login.isoformat() if new_user.last_login else ""
    )

@router.post("/signin", response_model=UserResponse)
async def signin(user_data: UserSignIn, db: Session = Depends(get_db)):
    """Sign in an existing user."""
    user = db.query(User).filter(User.username == user_data.username).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    return UserResponse(
        id=user.id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        year=user.year,
        major=user.major,
        created_at=user.created_at.isoformat() if user.created_at else "",
        last_login=user.last_login.isoformat() if user.last_login else ""
    )

@router.get("/user/{username}", response_model=UserResponse)
async def get_user(username: str, db: Session = Depends(get_db)):
    """Get user information by username."""
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        year=user.year,
        major=user.major,
        created_at=user.created_at.isoformat() if user.created_at else "",
        last_login=user.last_login.isoformat() if user.last_login else ""
    )

