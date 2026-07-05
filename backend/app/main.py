import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import Base, engine
from .routers import products, categories, search, auth_router, misc
from sqlalchemy import text

Base.metadata.create_all(bind=engine)

# Auto-add columns if they do not exist
with engine.begin() as conn:
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN views INTEGER DEFAULT 0"))
    except Exception:
        pass
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN clicks INTEGER DEFAULT 0"))
    except Exception:
        pass

app = FastAPI(
    title="Bobby Sales API",
    description="Backend for Bobby Sales — a fashion discovery & affiliate marketing platform.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
try:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
except OSError:
    print("Running in read-only filesystem (Vercel). Local uploads mount disabled.")

app.include_router(products.router)
app.include_router(categories.router)
app.include_router(search.router)
app.include_router(auth_router.router)
app.include_router(misc.router)


from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bobby_sales")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    logger.error(f"Validation error for {request.method} {request.url.path}: {exc.errors()}")
    logger.error(f"Request body: {await request.body()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


@app.get("/api/health")
def health():
    return {"status": "ok"}
