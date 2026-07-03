# Bobby Sales — Frontend

A modern, minimal-luxury fashion discovery & affiliate marketing site. Built with React,
Vite, Tailwind CSS v4, React Router, Framer Motion, and Lucide icons.

Bobby Sales is **not** an e-commerce store — every "Buy Now" button sends the user to the
partner store's affiliate link. No checkout, no cart, no payments happen here.

## Stack

- **React 19 + Vite** — app shell and dev server
- **Tailwind CSS v4** — utility-first styling via `@tailwindcss/vite`
- **React Router** — client-side routing
- **Framer Motion** — scroll-in and hover animations
- **Lucide React** — icon set

## Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. In dev, requests to `/api/*` and `/uploads/*` are
proxied to the FastAPI backend at `http://127.0.0.1:8000` (see `vite.config.js`) — start the
backend first (see `../backend/README.md`) so pages load real data.

**No backend running?** The UI still works — every data hook falls back to local mock data in
`src/data/mockData.js` so you can preview and design the frontend on its own.

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

## Project structure

```
frontend/src/
  api/client.js              # fetch wrapper for the FastAPI backend
  hooks/useProducts.js         # data hooks with mock-data fallback
  context/
    WishlistContext.jsx          # in-memory wishlist (design placeholder for user accounts)
    AdminAuthContext.jsx           # admin JWT session (sessionStorage)
  data/mockData.js                  # offline fallback data
  components/                         # Navbar, Footer, ProductCard, CategoryCard,
                                        # Hero, TrendingCarousel, FilterSidebar, etc.
  pages/
    Home.jsx, Category.jsx, ProductDetails.jsx,
    Search.jsx, Deals.jsx, About.jsx, Contact.jsx
    admin/
      AdminLogin.jsx, AdminDashboard.jsx, ProductForm.jsx
```

## Design system

Defined as CSS variables in `src/index.css`:

- **Palette** — off-white paper background, near-black ink text, muted gold accent
  (`--color-gold`), soft dividing lines
- **Type** — Poppins for display/headings, Inter for body text
- **Surfaces** — rounded-2xl cards, `.glass` / `.glass-dark` utility classes for
  glassmorphism (navbar, floating buttons)
- **Motion** — Framer Motion scroll-reveals on cards and sections; respects
  `prefers-reduced-motion`

## Pages implemented

| Route | Page |
|---|---|
| `/` | Home — hero, trending categories, trending products, today's deals carousel, featured products, why-us, Pinterest-style masonry inspiration |
| `/category/:id` | Category — filters (price, brand, store, rating, color), sorting, grid |
| `/product/:id` | Product details — gallery, sizes/colors, compare prices across stores, related products |
| `/search` | Live search — suggestions dropdown, trending searches, filters |
| `/deals` | Today's / weekend / festival deals / clearance sections |
| `/about` | About Bobby Sales, affiliate disclosure |
| `/contact` | Contact form + FAQ + social links |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Protected — stats, product table, add/edit/delete via `ProductForm` |

## Design placeholders (future features)

These are stubbed in the UI so the roadmap is visible, but not functional yet:
AI Fashion Assistant, Wishlist persistence (currently in-memory only), Telegram bot,
price-drop alerts, user accounts, recently viewed, dark mode, personalized recommendations.
The wishlist heart icon and toggle *do* work in-session — they just don't persist across a
reload yet, since that needs the user-accounts feature.

## Notes

- All external product links use `rel="noopener noreferrer sponsored"` (best practice for
  affiliate links).
- Every list/grid page shows skeleton loaders while data is loading.
- Admin actions are protected by a JWT stored in `sessionStorage` (cleared on tab close) —
  wire this to a longer-lived, http-only cookie if you need persistent admin sessions.
