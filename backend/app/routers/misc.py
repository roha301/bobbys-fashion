import os
import uuid
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..auth import require_admin

router = APIRouter(prefix="/api", tags=["misc"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5MB

logger = logging.getLogger("bobby_sales")


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


import urllib.request
import re
from html.parser import HTMLParser


class MetaParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta_tags = {}
        self.title = ""
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.in_title = True
        elif tag == "meta":
            attrs_dict = dict(attrs)
            name = attrs_dict.get("name") or attrs_dict.get("property")
            content = attrs_dict.get("content")
            if name and content:
                self.meta_tags[name] = content

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def scrape_metadata(url: str):
    import json
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/115.0.0.0 Safari/537.36"
                )
            },
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            html = response.read().decode("utf-8", errors="ignore")

        # 1. Try to parse from LD+JSON Product Schema (standard on retail sites)
        ld_data = {}
        scripts = re.findall(r'<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.DOTALL)
        for script in scripts:
            try:
                parsed = json.loads(script.strip())
                items = parsed if isinstance(parsed, list) else [parsed]
                for item in items:
                    types = item.get("@type", "")
                    if types == "Product" or (isinstance(types, list) and "Product" in types):
                        ld_data = item
                        break
                if ld_data:
                    break
            except Exception:
                continue

        title = ld_data.get("name") or ""
        description = ld_data.get("description") or ""
        brand = ""
        brand_raw = ld_data.get("brand")
        if brand_raw:
            if isinstance(brand_raw, dict):
                brand = brand_raw.get("name") or ""
            elif isinstance(brand_raw, str):
                brand = brand_raw

        image = ""
        image_raw = ld_data.get("image")
        if image_raw:
            if isinstance(image_raw, list) and len(image_raw) > 0:
                image_raw = image_raw[0]
            if isinstance(image_raw, dict):
                image = image_raw.get("url") or ""
            elif isinstance(image_raw, str):
                image = image_raw

        price = ""
        offers = ld_data.get("offers")
        if offers:
            offer = offers[0] if isinstance(offers, list) and len(offers) > 0 else offers
            if isinstance(offer, dict):
                price = offer.get("price") or offer.get("lowPrice") or ""
                if price:
                    price = str(price)

        # 2. Fall back to Open Graph metadata
        parser = MetaParser()
        parser.feed(html)

        if not title:
            title = parser.meta_tags.get("og:title") or parser.title or ""
            if not brand:
                for separator in [" | ", " - "]:
                    if separator in title:
                        parts = title.split(separator)
                        brand = parts[0].strip()
                        break

        title = title.strip()

        if not image:
            image = parser.meta_tags.get("og:image") or ""

        if not description:
            description = parser.meta_tags.get("og:description") or parser.meta_tags.get("description") or ""
        description = description.strip()

        if not price:
            price = parser.meta_tags.get("product:price:amount") or parser.meta_tags.get("og:price:amount") or ""

        if not price:
            price_match = re.search(r"(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{2})?)", html)
            if price_match:
                price = price_match.group(1).replace(",", "")

        # Safe float conversion
        price_num = None
        if price:
            try:
                cleaned_price = re.sub(r"[^\d.]", "", str(price))
                price_num = float(cleaned_price)
            except Exception:
                pass

        # Store detection
        store = "Amazon"
        url_lower = url.lower()
        if "myntra" in url_lower:
            store = "Myntra"
        elif "ajio" in url_lower:
            store = "AJIO"
        elif "nykaa" in url_lower:
            store = "Nykaa"
        elif "flipkart" in url_lower:
            store = "Flipkart"

        # Guess Brand from URLs
        if not brand:
            domain_match = re.search(r"https?://(?:www\.)?([^/]+)/([^/]+)", url)
            if domain_match:
                domain = domain_match.group(1).lower()
                path_segment = domain_match.group(2).replace("-", " ")
                if any(kw in domain for kw in ["myntra", "ajio"]):
                    brand = path_segment.title()

        return {
            "name": title,
            "brand": brand.strip().title() if brand else "Generic",
            "image": image,
            "description": description,
            "price": price_num,
            "store": store,
            "affiliateLink": url,
        }
    except Exception as e:
        return {"error": str(e)}


@router.get("/admin/scrape")
def admin_scrape(url: str, _admin: str = Depends(require_admin)):
    result = scrape_metadata(url)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result
