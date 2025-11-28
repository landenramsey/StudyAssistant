"""
Migration script to add email column to existing users table.
Run this if you have an existing database without the email column.
"""
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "users.db"

def migrate():
    """Add email column to users table if it doesn't exist."""
    if not DB_PATH.exists():
        print("Database doesn't exist yet. It will be created automatically.")
        return
    
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    
    try:
        # Check if email column exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'email' in columns:
            print("✅ Email column already exists.")
            return
        
        # Add email column
        print("Adding email column to users table...")
        cursor.execute("ALTER TABLE users ADD COLUMN email VARCHAR;")
        
        # Create unique index
        cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users(email);")
        
        conn.commit()
        print("✅ Migration completed successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Error during migration: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()

