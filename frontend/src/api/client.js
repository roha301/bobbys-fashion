// Central API client for Bobby Sales.
// Talks to the FastAPI backend at /api (proxied to http://127.0.0.1:8000 in dev).
// If the backend is unreachable, callers fall back to local mock data so the
// UI stays browsable during design work / offline preview.

const BASE = '/api'

async function request(path, options = {}) {
  const { headers: extraHeaders, ...rest } = options
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${body || res.statusText}`)
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return null
}

export const api = {
  // Products
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
    ).toString()
    return request(`/products${qs ? `?${qs}` : ''}`)
  },
  getProduct: (id) => request(`/products/${id}`),
  registerClick: (id) => request(`/products/${id}/click`, { method: 'POST' }),
  createProduct: (data, token) =>
    request('/products', { method: 'POST', body: JSON.stringify(data), headers: authHeader(token) }),
  updateProduct: (id, data, token) =>
    request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: authHeader(token) }),
  deleteProduct: (id, token) =>
    request(`/products/${id}`, { method: 'DELETE', headers: authHeader(token) }),

  // Categories
  getCategories: () => request('/categories'),
  getSubcategories: (categoryId) => request(`/categories/${categoryId}/subcategories`),
  createCategory: (data, token) =>
    request('/categories', { method: 'POST', body: JSON.stringify(data), headers: authHeader(token) }),
  updateCategory: (id, data, token) =>
    request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: authHeader(token) }),
  deleteCategory: (id, token) =>
    request(`/categories/${id}`, { method: 'DELETE', headers: authHeader(token) }),

  // Search
  search: (q) => request(`/search?q=${encodeURIComponent(q)}`),
  getHomeData: () => request('/home'),


  // Stats (admin)
  getStats: (token) => request('/admin/stats', { headers: authHeader(token) }),
  scrapeUrl: (url, token) =>
    request(`/admin/scrape?url=${encodeURIComponent(url)}`, { headers: authHeader(token) }),

  // Auth
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  registerFirst: (username, password) =>
    request('/auth/register-first', { method: 'POST', body: JSON.stringify({ username, password }) }),
  getAuthStatus: () => request('/auth/status'),
  
  // User Auth
  userRegister: (name, email, password) =>
    request('/auth/user/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  userLogin: (email, password) =>
    request('/auth/user/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  userGoogleAuth: (credential) =>
    request('/auth/user/google', { method: 'POST', body: JSON.stringify({ credential }) }),

  // Contact
  sendContact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),

  // Image upload
  uploadImage: async (file, token) => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${BASE}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    })
    if (!res.ok) throw new Error('Upload failed')
    return res.json()
  },
}

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}
