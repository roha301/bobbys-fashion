# 🎨 Bobby Sales — Frontend Experience

Welcome to the visual heart of **Bobby Sales**! 
A beautifully crafted, minimal-luxury fashion discovery and affiliate marketing site. 

Built with love, **React**, **Vite**, **Tailwind CSS v4**, **React Router**, **Framer Motion**, and crisp **Lucide icons**. 

> **Important:** Bobby Sales is an *affiliate* platform, not an e-commerce store! Every "Buy Now" button seamlessly redirects users to partner stores (like Amazon or Myntra). There is no checkout or cart hosted here.

---

## 🛠️ The Tech Stack

- ⚛️ **React 19 + Vite** — Blazing fast app shell and dev server.
- 💅 **Tailwind CSS v4** — Sleek utility-first styling (via `@tailwindcss/vite`).
- 🛣️ **React Router** — Smooth client-side routing.
- 🎬 **Framer Motion** — Buttery scroll-reveals and hover animations.
- 🔍 **Lucide React** — Beautiful, consistent iconography.

---

## 🚀 Getting Started

Let's get this gorgeous UI running on your machine:

```bash
cd frontend
npm install
npm run dev
```
*The app is now live at `http://localhost:5173`!*

### Data Connection
During development, any requests to `/api/*` and `/uploads/*` are automatically proxied to the FastAPI backend at `http://127.0.0.1:8000`. Make sure you start the backend first so the pages load real data!

> 💡 **No backend? No problem!** 
> The UI is completely resilient. If the backend is offline, every data hook gracefully falls back to local mock data (found in `src/data/mockData.js`). You can preview, design, and build the frontend completely offline!

### Building for Production
```bash
npm run build      # Creates the production build in dist/
npm run preview    # Preview the production build locally
```

---

## 🏗️ Project Architecture

Here is how our code is beautifully organized:

```text
frontend/src/
├── api/client.js              # Fetch wrapper for the backend
├── hooks/useProducts.js       # Data hooks (with auto mock-data fallback)
├── context/
│   ├── WishlistContext.jsx    # In-memory wishlist state
│   └── AdminAuthContext.jsx   # Admin JWT session (sessionStorage)
├── data/mockData.js           # Offline fallback data
├── components/                # UI Components (Navbar, Cards, Hero, Sidebar, etc.)
└── pages/                     # Full Page Views
    ├── Home, Category, ProductDetails
    ├── Search, Deals, About, Contact
    └── admin/
        └── AdminLogin, AdminDashboard, ProductForm
```

---

## 🎨 The Design System

Our aesthetic is defined right in `src/index.css`:

- **Palette:** Off-white paper background, near-black ink text, and a stunning muted gold accent (`--color-gold`).
- **Typography:** **Poppins** for bold, stylish headings; **Inter** for highly readable body text.
- **Surfaces:** Soft `rounded-2xl` cards. We use `.glass` and `.glass-dark` utility classes for premium glassmorphism effects on navbars and floating elements.
- **Motion:** Framer Motion handles elegant scroll-reveals (and kindly respects `prefers-reduced-motion` for accessibility).

---

## 🗺️ Page Tour

| Route | What's there? |
|---|---|
| `/` | **Home** — Hero, trending categories, today's deals carousel, and a Pinterest-style masonry inspiration grid. |
| `/category/:id` | **Category** — Grid view with powerful filters (price, brand, store, rating) and sorting. |
| `/product/:id` | **Product Details** — Gorgeous gallery, size/color options, cross-store price comparisons. |
| `/search` | **Live Search** — Instant dropdown suggestions and trending searches. |
| `/deals` | **Deals** — Curated sections for weekend, festival, and clearance sales. |
| `/about` | **About** — Brand story and affiliate disclosure. |
| `/contact` | **Contact** — FAQ, social links, and contact form. |
| `/admin/*` | **Admin Area** — Protected dashboard to view stats and manage products. |

---

## 🔮 Future Roadmap (Placeholders)

You'll notice some UI elements that look ready but are waiting for backend support. These include:
- 🤖 AI Fashion Assistant
- ❤️ Wishlist persistence (currently works per-session!)
- 📱 Telegram bot integration
- 📉 Price-drop alerts
- 👤 User accounts & personalized recommendations
- 🌙 Dark mode

---

## 📝 Best Practices Used

- **Affiliate Safety:** All external product links strictly use `rel="noopener noreferrer sponsored"`.
- **UX:** Every list and grid displays elegant skeleton loaders while fetching data.
- **Security:** Admin actions are secured by a JWT stored in `sessionStorage` (which clears when the tab closes). 

---
*Stay stylish! ✨*
