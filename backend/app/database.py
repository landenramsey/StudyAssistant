from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from pathlib import Path

# Database path
DB_PATH = Path(__file__).parent.parent.parent / "data" / "users.db"
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

# Create database engine
engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)  # This will be the email
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)  # Keep for backwards compatibility
    year = Column(String, nullable=False)
    major = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Migrate existing databases to add new columns if needed
def migrate_database():
    """Add new columns to existing databases."""
    import sqlite3
    if DB_PATH.exists():
        conn = sqlite3.connect(str(DB_PATH))
        cursor = conn.cursor()
        try:
            cursor.execute("PRAGMA table_info(users)")
            columns = [col[1] for col in cursor.fetchall()]
            
            # Add email column if missing
            if 'email' not in columns:
                cursor.execute("ALTER TABLE users ADD COLUMN email VARCHAR;")
                cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users(email);")
            
            # Add first_name column if missing
            if 'first_name' not in columns:
                cursor.execute("ALTER TABLE users ADD COLUMN first_name VARCHAR;")
            
            # Add last_name column if missing
            if 'last_name' not in columns:
                cursor.execute("ALTER TABLE users ADD COLUMN last_name VARCHAR;")
            
            conn.commit()
        except Exception:
            conn.rollback()
        finally:
            conn.close()

# Run migration on import
migrate_database()

def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

