// Fallback data — used only if the FastAPI backend is not running.
// The real source of truth is the backend + Supabase PostgreSQL database (see /backend/seed.py).

export const CATEGORIES = []

export const DEFAULT_SUBCATEGORIES = {
  men: ['Trousers', 'Loose Fits', 'Shirts', 'T-shirts', 'Kurtas', 'Suit/Coats'],
  women: ['Dresses', 'Tops', 'Sarees', 'Kurtis', 'Skirts', 'Trousers'],
  kids: ['T-shirts', 'Shirts', 'Jeans', 'Dresses', 'Shorts'],
  accessories: ['Watch', 'Handbags', 'Goggles', 'Belts', 'Wallets'],
  bags: ['Handbags', 'Backpacks', 'Clutches', 'Sling Bags'],
  shoes: ['Casual', 'Formal', 'Sneakers', 'Sports', 'Boots'],
  footwear: ['Casual', 'Formal', 'Sneakers', 'Sports', 'Boots']
}

export const STORES = ['Amazon', 'Myntra', 'AJIO', 'Flipkart', 'Meesho', 'Nykaa']

const img = (seed, w = 600, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`

export const PRODUCTS = []

export const compareOffers = (product) => {
  // Deterministic mock price comparisons across other stores for a product.
  const others = STORES.filter((s) => s.toLowerCase() !== product.store.toLowerCase()).slice(0, 3)
  return [
    { store: product.store, price: product.price, best: true },
    ...others.map((store, i) => ({ store, price: product.price + (i + 1) * 151, best: false })),
  ]
}

export const getLocalSuggestions = (q) => {
  if (!q || !q.trim()) return []
  const norm = (s) => s.toLowerCase().replace(/-/g, ' ').replace(/'/g, '').trim()
  const term = norm(q)
  const results = new Set()
  
  // Match category names
  CATEGORIES.forEach((c) => {
    const name = c.name.toLowerCase()
    const nameNorm = norm(name)
    if (nameNorm.includes(term)) {
      results.add(name)
      const subs = DEFAULT_SUBCATEGORIES[c.id] || []
      subs.forEach((s) => {
        results.add(`${name} ${s.toLowerCase()}`)
        results.add(`${name}s ${s.toLowerCase()}`)
      })
    }
  })
  
  // Match subcategories
  Object.entries(DEFAULT_SUBCATEGORIES).forEach(([catId, subs]) => {
    const catName = CATEGORIES.find((c) => c.id === catId)?.name?.toLowerCase() || catId
    subs.forEach((sub) => {
      const subNorm = norm(sub)
      if (subNorm.includes(term)) {
        results.add(sub.toLowerCase())
        results.add(`${catName} ${sub.toLowerCase()}`)
        results.add(`${catName}s ${sub.toLowerCase()}`)
      }
    })
  })
  
  // Match products & brands
  PRODUCTS.forEach((p) => {
    const nameNorm = norm(p.name)
    const brandNorm = norm(p.brand)
    if (nameNorm.includes(term)) {
      results.add(p.name.toLowerCase())
    }
    if (brandNorm.includes(term)) {
      results.add(p.brand.toLowerCase())
      results.add(`${p.brand.toLowerCase()} ${p.category}`)
    }
  })
  
  return Array.from(results)
    .filter((item) => norm(item).includes(term) && item.length < 40)
    .sort((a, b) => {
      const aNorm = norm(a)
      const bNorm = norm(b)
      const aStarts = aNorm.startsWith(term)
      const bStarts = bNorm.startsWith(term)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return a.length - b.length || a.localeCompare(b)
    })
    .slice(0, 8)
}
