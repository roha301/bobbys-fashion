# Bobby Sales — Backend

FastAPI + SQLite REST API powering the Bobby Sales fashion discovery platform.
Products, categories, admin auth, image uploads, and contact messages all live here.

## Stack

- **FastAPI** — REST API framework
- **SQLite** (via SQLAlchemy) — zero-config database, one file (`bobby_sales.db`)
- **JWT** (python-jose) — admin authentication
- **bcrypt** — password hashing

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Seed the database

Creates categories, 12 sample products, and a default admin user.

```bash
python seed.py
```

Default admin login (change immediately in production):

```
username: admin
password: bobbysales123
```

Override the seeded credentials with environment variables before seeding:

```bash
export BOBBY_SALES_ADMIN_USER=youradmin
export BOBBY_SALES_ADMIN_PASSWORD=a-much-stronger-password
python seed.py
```

## Run the server

```bash
uvicorn app.main:app --reload --port 8000
```

The API is now live at `http://127.0.0.1:8000`. Interactive docs (Swagger UI) are at
`http://127.0.0.1:8000/docs`.

The frontend's Vite dev server proxies `/api` and `/uploads` to this backend automatically —
just make sure both are running.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `BOBBY_SALES_SECRET_KEY` | `dev-secret-change-me-in-production` | JWT signing secret — **set a real secret in production** |
| `BOBBY_SALES_ADMIN_USER` | `admin` | Username created by `seed.py` |
| `BOBBY_SALES_ADMIN_PASSWORD` | `bobbysales123` | Password created by `seed.py` |

## API overview

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | — | List products. Filters: `category`, `brand`, `store`, `featured`, `trending`, `deal`, `q`, `minPrice`, `maxPrice`, `minRating`, `sort` |
| GET | `/api/products/{id}` | — | Product details |
| POST | `/api/products` | admin | Create product |
| PUT | `/api/products/{id}` | admin | Update product |
| DELETE | `/api/products/{id}` | admin | Delete product |
| GET | `/api/categories` | — | List categories |
| GET | `/api/search?q=` | — | Search products |
| POST | `/api/auth/login` | — | Admin login → JWT |
| GET | `/api/admin/stats` | admin | Dashboard stats |
| POST | `/api/upload` | admin | Upload a product image (multipart/form-data, field `file`) |
| POST | `/api/contact` | — | Submit contact form |
| GET | `/api/health` | — | Health check |

Admin routes expect `Authorization: Bearer <token>` from `/api/auth/login`.

## Project structure

```
backend/
  app/
    main.py          # FastAPI app, CORS, static file mount
    database.py       # SQLAlchemy engine/session
    models.py          # Product, Category, ContactMessage, AdminUser
    schemas.py          # Pydantic request/response models
    auth.py               # JWT + bcrypt helpers
    routers/
      products.py          # Product CRUD
      categories.py          # Category listing
      search.py                # Search endpoint
      auth_router.py             # Login
      misc.py                      # Stats, contact, upload
    uploads/                        # Uploaded product images (served at /uploads)
  seed.py                             # Database seed script
  requirements.txt
```

## Notes on going to production

- Swap `BOBBY_SALES_SECRET_KEY` for a long random value stored outside source control.
- SQLite is fine for a single-server deployment; move to Postgres (just change
  `SQLALCHEMY_DATABASE_URL` in `database.py`) if you need concurrent writers or horizontal scaling.
- Uploaded images are stored on local disk — move to S3/Cloud Storage before scaling past one server.
- Update `allow_origins` in `main.py` to your real frontend domain before deploying.
