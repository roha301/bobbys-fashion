import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from sqlalchemy.pool import NullPool

# Load database URL from environment variable, falling back to Supabase Postgres
# Switched to port 6543 for transaction pooling mode, which is much better for serverless apps
SUPABASE_URL = "postgresql://postgres.qcxgpylocedhgjbsqlhw:BobbyFashion%231234@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", SUPABASE_URL)

# Correct postgresql dialect name if needed (e.g., from Heroku/Render)
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
elif SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

connect_args = {}

# Use NullPool to disable connection pooling inside SQLAlchemy, since Vercel serverless
# instances are short-lived and should not hold onto persistent database connections.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args=connect_args,
    poolclass=NullPool
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
