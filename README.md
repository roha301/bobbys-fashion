# Bobby Sales

A modern fashion **discovery and affiliate marketing** platform — think Pinterest × Zara × Nike.
Bobby Sales curates fashion from Amazon, Myntra, AJIO, Flipkart, Meesho, and Nykaa, and sends
users onward via affiliate links to buy. **It is not an e-commerce store** — there's no cart,
no checkout, no payments on this site.

```
bobby-sales/
  frontend/   React + Vite + Tailwind CSS v4 + React Router + Framer Motion
  backend/    FastAPI + SQLite REST API
```

## Quick start

**1. Backend**

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python seed.py                       # creates categories, sample products, admin user
uvicorn app.main:app --reload --port 8000
```

**2. Frontend** (in a second terminal)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Admin dashboard is at `/admin/login`
(default: `admin` / `bobbysales123` — see `backend/README.md` to change this).

The frontend works standalone too — if the backend isn't running, every page falls back to
local mock data so you can preview the design on its own.

## What's built

- **Public pages** — Home (hero, trending categories, trending products, today's deals,
  featured, why-us, masonry inspiration), Category listing with filters/sort, Product details
  (gallery, sizes/colors, compare-prices, related products), live Search, Deals (today /
  weekend / festival / clearance), About, Contact (form + FAQ).
- **Admin dashboard** — JWT-protected login, stats cards, product table, full add/edit/delete
  via a single reusable form (category, images with upload, price/MRP/discount, affiliate
  link, featured/trending/deal toggles). No code editing required to manage products.
- **Backend API** — REST endpoints for products (with filtering/sorting/search), categories,
  admin auth, image upload, and a contact-form endpoint, all persisted to SQLite.
- **Design** — minimal luxury theme: white background, black type, muted gold accent,
  Poppins/Inter type, rounded cards, glassmorphism on the navbar and floating elements,
  scroll-triggered Framer Motion animations, skeleton/shimmer loaders.

## What's stubbed for later

AI fashion assistant, persistent wishlist (works in-session, not saved yet), Telegram bot,
price-drop alerts, full user accounts, recently viewed, dark mode, and personalized
recommendations are all called out in the code as clear extension points — see the "Design
placeholders" section of `frontend/README.md`.

## Deploying

- **Frontend**: `npm run build` in `frontend/` → deploy the `dist/` folder to any static host
  (Vercel, Netlify, Cloudflare Pages, S3+CloudFront). Point it at your deployed backend URL by
  adjusting the `/api` proxy or adding an env-based `BASE` in `src/api/client.js`.
- **Backend**: deploy `backend/` to any Python host (Render, Railway, Fly.io, a VPS). Set
  `BOBBY_SALES_SECRET_KEY` to a real secret, move `allow_origins` in `app/main.py` to your
  real frontend domain, and consider moving from SQLite to Postgres if you expect concurrent
  writes.
