# ✨ Bobby Sales

Welcome to **Bobby Sales** — a modern, minimal, and luxurious fashion discovery & affiliate marketing platform. 
*Think Pinterest meets Zara, Nike, and Vogue.* 👗👟

Bobby Sales curates the absolute best fashion pieces from Amazon, Myntra, AJIO, Flipkart, Meesho, and Nykaa, sending users directly to those platforms to buy via affiliate links. 

> **Important:** This is *not* an e-commerce store! There are no carts, checkouts, or payment gateways here—just pure discovery and inspiration.

---

## 🏗️ Architecture

The project is split into two clean and modern environments:

```text
bobby-sales/
├── frontend/   # React + Vite + Tailwind CSS v4 + React Router + Framer Motion
└── backend/    # Python FastAPI + SQLite REST API
```

---

## 🚀 Quick Start Guide

Let's get you up and running in minutes!

### 1. Start the Backend API
Open your terminal and run the following:

```bash
cd backend
python3 -m venv venv 
source venv/bin/activate       # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python seed.py                 # Populates the DB with sample products & an admin user
uvicorn app.main:app --reload --port 8000
```
*The backend is now live! See `backend/README.md` for more details.*

### 2. Start the Frontend (in a new terminal tab)
```bash
cd frontend
npm install
npm run dev
```

### 3. Explore! 🎉
- **Main Site:** Open `http://localhost:5173` in your browser.
- **Admin Dashboard:** Go to `http://localhost:5173/admin/login`
  - *Default Credentials:* `admin` / `bobbysales123`

> 💡 **Pro Tip:** The frontend is designed to work standalone! If the backend isn't running, every page gracefully falls back to local mock data, allowing you to preview and edit the UI design instantly without spinning up the server.

---

## 💎 What's Included?

We've built a robust foundation with a premium feel:

- 🎨 **Public Pages:** Stunning Hero sections, Trending Categories, Today's Deals, Featured items, "Why Us", and beautiful Masonry grids. Includes fully functional Category listing (with filters & sorts), Product Details (gallery, sizes, colors, price comparisons), Live Search, and Contact/FAQ pages.
- 🎛️ **Admin Dashboard:** A secure, JWT-protected portal. Features a sleek stats dashboard, complete product management (add/edit/delete), image uploads, pricing/discount controls, and toggles for "Featured", "Trending", and "Deals"—all without touching a line of code!
- ⚙️ **Backend API:** Powerful REST endpoints handling products, complex filtering, admin auth, image uploads, and contact forms, safely stored in SQLite.
- ✨ **Premium Design:** A minimal luxury aesthetic featuring white backgrounds, crisp black typography, muted gold accents (using Poppins & Inter fonts). Enhancements include glassmorphism, rounded cards, scroll-triggered *Framer Motion* animations, and beautiful shimmer loading states.

---

## 🚧 Coming Soon (Future Ideas)

The code has built-in placeholders for exciting future extensions:
- 🤖 **AI Fashion Assistant** 
- ❤️ **Persistent Wishlists & Recently Viewed**
- 📱 **Telegram Bot Integration**
- 📉 **Price-Drop Alerts**
- 👤 **Full User Accounts & Personalization**
- 🌙 **Dark Mode**

*(Check the "Design placeholders" section in `frontend/README.md` for more details!)*

---

## 🌍 Deploying to Production

Ready to share Bobby Sales with the world?

- **Frontend:** Run `npm run build` inside the `frontend/` directory. Take the resulting `dist/` folder and deploy it to any static host (Vercel, Netlify, Cloudflare Pages, S3). Make sure to point the API requests to your live backend URL in `src/api/client.js`.
- **Backend:** Deploy the `backend/` folder to any Python host (Render, Railway, Fly.io, etc.). 
  - *Crucial:* Set a secure `BOBBY_SALES_SECRET_KEY` environment variable.
  - Update `allow_origins` in `app/main.py` to match your frontend domain.
  - If you expect heavy traffic, easily swap out SQLite for Postgres in `database.py`.

---
*Curated with style. Built with passion.*
