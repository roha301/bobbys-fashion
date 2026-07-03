// Fallback data — used only if the FastAPI backend is not running.
// The real source of truth is the backend + SQLite database (see /backend/seed.py).

export const CATEGORIES = [
  { id: 'women', name: 'Women', emoji: '👗' },
  { id: 'men', name: 'Men', emoji: '👔' },
  { id: 'shoes', name: 'Shoes', emoji: '👟' },
  { id: 'bags', name: 'Bags', emoji: '👜' },
  { id: 'watches', name: 'Watches', emoji: '⌚' },
  { id: 'beauty', name: 'Beauty', emoji: '💄' },
  { id: 'jackets', name: 'Jackets', emoji: '🧥' },
  { id: 'jeans', name: 'Jeans', emoji: '👖' },
]

export const STORES = ['Amazon', 'Myntra', 'AJIO', 'Flipkart', 'Meesho', 'Nykaa']

const img = (seed, w = 600, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`

export const PRODUCTS = [
  { id: 1, name: 'Oversized Wool Blend Coat', brand: 'Zaraya', category: 'jackets', price: 4299, mrp: 6999, discount: 39, rating: 4.6, store: 'Myntra', featured: true, trending: true, deal: false, images: [img('coat1'), img('coat1b'), img('coat1c')], colors: ['Camel', 'Black'], sizes: ['S', 'M', 'L', 'XL'], description: 'A tailored oversized coat in a soft wool blend, cut for a relaxed silhouette that layers over everything from knits to slip dresses.' },
  { id: 2, name: 'Satin Slip Midi Dress', brand: 'Luvere', category: 'women', price: 1899, mrp: 3499, discount: 46, rating: 4.4, store: 'Ajio', featured: true, trending: true, deal: true, images: [img('dress1'), img('dress1b')], colors: ['Champagne', 'Black', 'Emerald'], sizes: ['XS', 'S', 'M', 'L'], description: 'Bias-cut satin slip dress with adjustable straps — the kind of quiet-luxury piece that moves from dinner to dancing.' },
  { id: 3, name: 'Classic Leather Chelsea Boots', brand: 'Northgate', category: 'shoes', price: 3599, mrp: 4999, discount: 28, rating: 4.7, store: 'Amazon', featured: true, trending: false, deal: false, images: [img('boot1'), img('boot1b')], colors: ['Tan', 'Black'], sizes: ['6', '7', '8', '9', '10'], description: 'Full-grain leather Chelsea boots with an elastic gusset and a stacked block heel built to last for years.' },
  { id: 4, name: 'Structured Top-Handle Bag', brand: 'Maison Cle', category: 'bags', price: 5299, mrp: 8999, discount: 41, rating: 4.5, store: 'Nykaa Fashion', featured: false, trending: true, deal: true, images: [img('bag1'), img('bag1b')], colors: ['Ivory', 'Tan', 'Black'], sizes: ['One Size'], description: 'A structured top-handle bag in saffiano-finish leather with a detachable gold-tone chain strap.' },
  { id: 5, name: 'Automatic Steel Chronograph', brand: 'Verlure', category: 'watches', price: 7999, mrp: 12999, discount: 38, rating: 4.8, store: 'Amazon', featured: true, trending: true, deal: false, images: [img('watch1'), img('watch1b')], colors: ['Silver', 'Gold'], sizes: ['One Size'], description: 'A stainless steel chronograph with sapphire crystal and a self-winding automatic movement.' },
  { id: 6, name: 'Matte Velvet Lipstick Set', brand: 'Bloume', category: 'beauty', price: 899, mrp: 1499, discount: 40, rating: 4.3, store: 'Nykaa', featured: false, trending: true, deal: true, images: [img('lip1'), img('lip1b')], colors: ['Nude Set', 'Red Set'], sizes: ['One Size'], description: 'A trio of long-wear matte lipsticks in wearable, editorial shades.' },
  { id: 7, name: 'Straight Fit Selvedge Jeans', brand: 'Denimhaus', category: 'jeans', price: 2599, mrp: 3999, discount: 35, rating: 4.5, store: 'Flipkart', featured: false, trending: false, deal: false, images: [img('jean1'), img('jean1b')], colors: ['Indigo', 'Black'], sizes: ['28', '30', '32', '34', '36'], description: 'Rigid selvedge denim in a straight fit that softens and molds to you over time.' },
  { id: 8, name: 'Tailored Linen Blazer', brand: 'Fornara', category: 'men', price: 3199, mrp: 4999, discount: 36, rating: 4.6, store: 'Myntra', featured: true, trending: false, deal: false, images: [img('blazer1'), img('blazer1b')], colors: ['Beige', 'Navy'], sizes: ['38', '40', '42', '44'], description: 'A breathable linen blazer with a soft shoulder and single-button close, cut for warm-weather tailoring.' },
  { id: 9, name: 'Ribbed Knit Bodysuit', brand: 'Luvere', category: 'women', price: 999, mrp: 1799, discount: 44, rating: 4.2, store: 'Meesho', featured: false, trending: true, deal: true, images: [img('body1'), img('body1b')], colors: ['Black', 'Ecru'], sizes: ['XS', 'S', 'M', 'L'], description: 'A second-skin ribbed bodysuit designed to layer under blazers or wear alone with denim.' },
  { id: 10, name: 'Minimalist Canvas Sneakers', brand: 'Northgate', category: 'shoes', price: 1799, mrp: 2599, discount: 31, rating: 4.4, store: 'Ajio', featured: false, trending: true, deal: false, images: [img('sneak1'), img('sneak1b')], colors: ['White', 'Off-White'], sizes: ['6', '7', '8', '9', '10', '11'], description: 'A low-profile canvas sneaker with a cupsole and a clean toe — built to go with everything.' },
  { id: 11, name: 'Quilted Crossbody Bag', brand: 'Maison Cle', category: 'bags', price: 2299, mrp: 3799, discount: 39, rating: 4.5, store: 'Myntra', featured: false, trending: false, deal: true, images: [img('bag2'), img('bag2b')], colors: ['Black', 'Blush'], sizes: ['One Size'], description: 'A quilted crossbody with a signature gold-tone clasp and an adjustable chain strap.' },
  { id: 12, name: 'Merino Wool Crewneck', brand: 'Fornara', category: 'men', price: 2199, mrp: 3299, discount: 33, rating: 4.6, store: 'Amazon', featured: false, trending: false, deal: false, images: [img('crew1'), img('crew1b')], colors: ['Charcoal', 'Camel', 'Navy'], sizes: ['S', 'M', 'L', 'XL'], description: 'A fine-gauge merino crewneck, light enough to layer, warm enough to wear alone.' },
]

export const compareOffers = (product) => {
  // Deterministic mock price comparisons across other stores for a product.
  const others = STORES.filter((s) => s.toLowerCase() !== product.store.toLowerCase()).slice(0, 3)
  return [
    { store: product.store, price: product.price, best: true },
    ...others.map((store, i) => ({ store, price: product.price + (i + 1) * 151, best: false })),
  ]
}
