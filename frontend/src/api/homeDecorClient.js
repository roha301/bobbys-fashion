// API client for Home Decor department.
// Isolated from fashion API client to prevent any overlap or side effects.

const BASE = '/api/home-decor'

async function request(path, options = {}) {
  const { headers: extraHeaders, ...rest } = options
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Home Decor API ${res.status}: ${body || res.statusText}`)
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return null
}

export const homeDecorApi = {
  // Products
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
    ).toString()
    return request(`/products${qs ? `?${qs}` : ''}`)
  },
  getProduct: (id) => request(`/products/${id}`),
  getBrands: () => request('/products/brands'),
  getStores: () => request('/products/stores'),
  
  // Home Data
  getHomeData: () => request('/home'),

  // Categories
  getCategories: () => request('/categories'),

  // Click tracking
  registerClick: (id) => request(`/products/${id}/click`, { method: 'POST' }),
}
