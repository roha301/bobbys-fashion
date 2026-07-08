import os
import uuid
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import func


from .. import models, schemas
from ..database import get_db
from ..auth import require_admin

router = APIRouter(prefix="/api", tags=["misc"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5MB

logger = logging.getLogger("bobby_sales")


@router.get("/home", response_model=schemas.HomeDataOut)
def get_home_data(db: Session = Depends(get_db)):
    categories = db.query(models.Category).all()
    trending = db.query(models.Product).filter(models.Product.trending == True).all()
    deals = db.query(models.Product).filter(models.Product.deal == True).all()
    featured = db.query(models.Product).filter(models.Product.featured == True).all()
    return {
        "categories": categories,
        "trending": trending,
        "deals": deals,
        "featured": featured
    }



def send_contact_email(name: str, email: str, message: str):
    recipient = "ghugerohan13@gmail.com"
    subject = f"New Contact Message from {name}"
    body = (
        f"You received a new message from the contact form on Bobby's Fashion:\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Message:\n{message}"
    )

    smtp_server = os.environ.get("SMTP_SERVER")
    smtp_port = os.environ.get("SMTP_PORT")
    smtp_user = os.environ.get("SMTP_USER")
    smtp_password = os.environ.get("SMTP_PASSWORD")

    if not smtp_server or not smtp_user:
        # Development mode fallback: log the email content clearly to console
        logger.info(
            f"\n"
            f"==================================================\n"
            f"[DEVELOPMENT EMAIL LOG] To: {recipient}\n"
            f"Subject: {subject}\n\n"
            f"{body}\n"
            f"==================================================\n"
            f"To enable real emails, configure SMTP_SERVER and SMTP_USER env vars."
        )
        return

    try:
        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["To"] = recipient
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP(smtp_server, int(smtp_port or 587))
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        logger.info(f"Email sent successfully to {recipient}")
    except Exception as e:
        logger.error(f"Failed to send contact message email: {e}")


@router.get("/admin/stats", response_model=schemas.StatsOut)
def admin_stats(db: Session = Depends(get_db), _admin: str = Depends(require_admin)):
    total_products = db.query(models.Product).count()
    total_categories = db.query(models.Category).count()
    featured_products = db.query(models.Product).filter(models.Product.featured == True).count()  # noqa: E712

    # Calculate total views & clicks
    total_views = db.query(func.sum(models.Product.views)).scalar() or 0
    total_clicks = db.query(func.sum(models.Product.clicks)).scalar() or 0

    # Top 5 most viewed products
    most_viewed_raw = (
        db.query(models.Product)
        .filter(models.Product.views > 0)
        .order_by(models.Product.views.desc())
        .limit(5)
        .all()
    )
    # If no products have views, fall back to showing top products by rating or simple top 5
    if not most_viewed_raw:
        most_viewed_raw = db.query(models.Product).order_by(models.Product.id.desc()).limit(5).all()

    most_viewed = [
        schemas.AnalyticsProductStats(name=p.name, views=p.views or 0)
        for p in most_viewed_raw
    ]

    # Store Referral distribution
    STORE_COLORS = {
        "Amazon": "#FF9900",
        "Myntra": "#E7396A",
        "AJIO": "#3B5998",
        "Nykaa": "#FC2779",
        "Flipkart": "#2874F0",
        "Other": "#8B5CF6",
    }

    store_clicks_raw = (
        db.query(models.Product.store, func.sum(models.Product.clicks).label("clicks"))
        .group_by(models.Product.store)
        .all()
    )

    total_clicks_sum = sum(item[1] or 0 for item in store_clicks_raw)
    store_clicks = []

    if total_clicks_sum == 0:
        # Fall back to product count per store if clicks are all 0
        store_counts_raw = (
            db.query(models.Product.store, func.count(models.Product.id).label("count"))
            .group_by(models.Product.store)
            .all()
        )
        total_products_count = sum(item[1] or 0 for item in store_counts_raw) or 1
        for store_name, p_count in store_counts_raw:
            pct = round((p_count / total_products_count) * 100, 1)
            color = STORE_COLORS.get(store_name, "#8B5CF6")
            store_clicks.append(
                schemas.AnalyticsStoreStats(store=store_name, pct=pct, clicks=0, color=color)
            )
    else:
        for store_name, clicks_count in store_clicks_raw:
            clicks_count = clicks_count or 0
            pct = round((clicks_count / total_clicks_sum) * 100, 1)
            color = STORE_COLORS.get(store_name, "#8B5CF6")
            store_clicks.append(
                schemas.AnalyticsStoreStats(store=store_name, pct=pct, clicks=clicks_count, color=color)
            )

    return schemas.StatsOut(
        total_products=total_products,
        total_categories=total_categories,
        featured_products=featured_products,
        total_views=total_views,
        total_clicks=total_clicks,
        most_viewed=most_viewed,
        store_clicks=store_clicks,
    )


@router.post("/contact", status_code=201)
def contact(payload: schemas.ContactIn, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    msg = models.ContactMessage(name=payload.name, email=payload.email, message=payload.message)
    db.add(msg)
    db.commit()

    background_tasks.add_task(send_contact_email, payload.name, payload.email, payload.message)

    return {"ok": True}


@router.post("/upload")
async def upload_image(file: UploadFile = File(...), _admin: str = Depends(require_admin)):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    contents = await file.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    filename = f"{uuid.uuid4().hex}{ext}"

    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")

    if supabase_url and supabase_key:
        try:
            from supabase import create_client, Client
            supabase: Client = create_client(supabase_url, supabase_key)
            content_type = file.content_type or "application/octet-stream"
            supabase.storage.from_("products").upload(
                path=filename,
                file=contents,
                file_options={"content-type": content_type}
            )
            public_url = supabase.storage.from_("products").get_public_url(filename)
            return {"url": public_url}
        except Exception as e:
            print(f"Supabase storage error: {e}")
            # Fall back to local upload if Supabase fails (e.g. bucket doesn't exist)

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        f.write(contents)

    return {"url": f"/uploads/{filename}"}


