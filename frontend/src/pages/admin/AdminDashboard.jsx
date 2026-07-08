import { useEffect, useState } from 'react'
import {
  LogOut, Plus, Pencil, Trash2, Package, Layers, Star, Clock,
  LayoutDashboard, Search, ChevronRight, TrendingUp, Tag, Loader2,
  BarChart2, ShieldCheck, X, Home
} from 'lucide-react'
import { api } from '../../api/client'
import { useAdminAuth } from '../../context/AdminAuthContext'
import ProductForm from './ProductForm'
import HomeDecorProductForm from './HomeDecorProductForm'

const MOST_VIEWED = [
  { name: "Oversized Wool Blend Coat", views: 2450 },
  { name: "Automatic Steel Chronograph", views: 1890 },
  { name: "Classic Leather Chelsea Boots", views: 1540 },
  { name: "Satin Slip Midi Dress", views: 1220 },
  { name: "Structured Top-Handle Bag", views: 980 }
]

const STORE_CLICKS = [
  { store: "Amazon", pct: 45, clicks: 540, color: "#FF9900" },
  { store: "Myntra", pct: 25, clicks: 300, color: "#E7396A" },
  { store: "AJIO", pct: 15, clicks: 180, color: "#3B5998" },
  { store: "Nykaa", pct: 10, clicks: 120, color: "#FC2779" },
  { store: "Flipkart", pct: 5, clicks: 60, color: "#2874F0" }
]

export default function AdminDashboard() {
  const auth = useAdminAuth()
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // list | add | edit
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard | products | categories | trending | deals | analytics | home-decor

  // Home Decor states
  const [hdView, setHdView] = useState('list') // list | add | edit
  const [hdProducts, setHdProducts] = useState([])
  const [hdCategories, setHdCategories] = useState([])
  const [hdEditing, setHdEditing] = useState(null)
  const [hdDeleteId, setHdDeleteId] = useState(null)
  const [hdDeleting, setHdDeleting] = useState(false)
  const [hdSearch, setHdSearch] = useState('')
  const [hdTab, setHdTab] = useState('products') // products | categories
  const [hdCatModalOpen, setHdCatModalOpen] = useState(false)
  const [hdEditingCat, setHdEditingCat] = useState(null)
  const [hdCatFormId, setHdCatFormId] = useState('')
  const [hdCatFormName, setHdCatFormName] = useState('')
  const [hdCatFormEmoji, setHdCatFormEmoji] = useState('🏠')
  const [hdCatError, setHdCatError] = useState('')
  const [hdCatSaving, setHdCatSaving] = useState(false)

  // Category management states
  const [categoriesList, setCategoriesList] = useState([])
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [catFormId, setCatFormId] = useState('')
  const [catFormName, setCatFormName] = useState('')
  const [catFormEmoji, setCatFormEmoji] = useState('🛍️')
  const [catError, setCatError] = useState('')
  const [catSaving, setCatSaving] = useState(false)

  const loadHd = () => {
    Promise.all([
      fetch('/api/home-decor/products').then(r => r.json()).catch(() => []),
      fetch('/api/home-decor/categories').then(r => r.json()).catch(() => []),
    ]).then(([prods, cats]) => {
      setHdProducts(prods)
      setHdCategories(cats)
    })
  }

  const load = () => {
    setLoading(true)
    Promise.all([
      api.getProducts().catch(() => []),
      api.getStats(auth.token).catch(() => null),
      api.getCategories().catch(() => []),
    ]).then(([prods, st, cats]) => {
      setProducts(prods)
      setStats(st)
      setCategoriesList(cats)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load(); loadHd() }, [])

  const categories = categoriesList.map((c) => c.id)

  const openCategoryModal = (cat = null) => {
    setEditingCategory(cat)
    if (cat) {
      setCatFormId(cat.id)
      setCatFormName(cat.name)
      setCatFormEmoji(cat.emoji)
    } else {
      setCatFormId('')
      setCatFormName('')
      setCatFormEmoji('🛍️')
    }
    setCatError('')
    setCatModalOpen(true)
  }

  const saveCategory = async (e) => {
    e.preventDefault()
    if (!catFormId.trim() || !catFormName.trim()) return
    setCatSaving(true)
    setCatError('')
    const payload = {
      id: catFormId.trim().toLowerCase().replace(/\s+/g, '-'),
      name: catFormName.trim(),
      emoji: catFormEmoji.trim() || '🛍️'
    }
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload, auth.token)
      } else {
        await api.createCategory(payload, auth.token)
      }
      setCatModalOpen(false)
      load()
    } catch (err) {
      setCatError(err.message || 'Failed to save category.')
    } finally {
      setCatSaving(false)
    }
  }

  const handleDeleteCategory = async (catId) => {
    try {
      const isOk = window.confirm("Are you sure you want to delete this category?")
      if (!isOk) return
      await api.deleteCategory(catId, auth.token)
      load()
    } catch (err) {
      // Human-readable parse
      const raw = err?.message || ''
      const match = raw.match(/API \d+: (.+)/s)
      const detail = match ? match[1] : raw
      let friendly = 'Could not delete category.'
      try {
        const parsed = JSON.parse(detail)
        if (parsed?.detail) friendly = String(parsed.detail)
      } catch { /**/ }
      alert(friendly)
    }
  }

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    const matchQ = !q || p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
    const matchCat = !filterCat || p.category === filterCat
    
    let matchTab = true
    if (activeTab === 'trending') matchTab = p.trending
    if (activeTab === 'deals') matchTab = p.deal
    
    return matchQ && matchCat && matchTab
  })

  const handleDelete = async (id) => {
    setDeleting(true)
    try { await api.deleteProduct(id, auth.token) } catch { /**/ }
    setProducts((p) => p.filter((x) => x.id !== id))
    setDeleteId(null)
    setDeleting(false)
  }

  // Home Decor add/edit form
  if (activeTab === 'home-decor' && (hdView === 'add' || hdView === 'edit')) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <button onClick={() => setHdView('list')} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10">
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <h1 className="font-display text-xl font-semibold text-white">
              {hdView === 'add' ? 'Add Home Decor Product' : 'Edit Home Decor Product'}
            </h1>
          </div>
          <HomeDecorProductForm
            initial={hdView === 'edit' ? hdEditing : undefined}
            onSaved={() => { setHdView('list'); loadHd() }}
            onCancel={() => setHdView('list')}
          />
        </div>
      </div>
    )
  }

  // Fashion add/edit form
  if (view === 'add' || view === 'edit') {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setView('list')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <h1 className="font-display text-xl font-semibold text-white">
              {view === 'add' ? 'Add New Product' : 'Edit Product'}
            </h1>
          </div>
          <ProductForm
            initial={view === 'edit' ? editing : undefined}
            onSaved={() => { setView('list'); load() }}
            onCancel={() => setView('list')}
          />
        </div>
      </div>
    )
  }

  const statCards = [
    {
      icon: Package,
      label: 'Total Products',
      value: stats?.total_products ?? products.length,
      color: 'from-blue-500/20 to-blue-600/5',
      iconColor: 'text-blue-400',
    },
    {
      icon: Layers,
      label: 'Categories',
      value: stats?.total_categories ?? categories.length,
      color: 'from-purple-500/20 to-purple-600/5',
      iconColor: 'text-purple-400',
    },
    {
      icon: TrendingUp,
      label: 'Total Views',
      value: stats?.total_views ?? 0,
      color: 'from-[var(--color-gold)]/20 to-[var(--color-gold)]/5',
      iconColor: 'text-[var(--color-gold)]',
    },
    {
      icon: Tag,
      label: 'Referral Clicks',
      value: stats?.total_clicks ?? 0,
      color: 'from-emerald-500/20 to-emerald-600/5',
      iconColor: 'text-emerald-400',
    },
  ]

  const mostViewedData = stats?.most_viewed?.length
    ? stats.most_viewed
    : products.slice(0, 5).map((p) => ({ name: p.name, views: p.views || 0 }))

  const storeClicksData = stats?.store_clicks?.length
    ? stats.store_clicks
    : (() => {
        const counts = {}
        products.forEach((p) => {
          if (p.store) {
            counts[p.store] = (counts[p.store] || 0) + 1
          }
        })
        const total = products.length || 1
        const colors = {
          Amazon: "#FF9900",
          Myntra: "#E7396A",
          AJIO: "#3B5998",
          Nykaa: "#FC2779",
          Flipkart: "#2874F0"
        }
        return Object.entries(counts).map(([store, count]) => ({
          store,
          pct: Math.round((count / total) * 100),
          clicks: 0,
          color: colors[store] || "#888888"
        })).sort((a, b) => b.pct - a.pct)
      })()

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/8 bg-[#111111] transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-white/8 px-6">
          <img src="/logo.png" alt="Bobby's Fashion" className="h-8 w-auto object-contain" />
          <span className="font-display text-sm font-semibold text-white tracking-tight">Bobby's Fashion</span>
          <span className="ml-auto rounded-md bg-[var(--color-gold)]/15 px-2 py-0.5 text-[10px] font-medium text-[var(--color-gold)]">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false) }} />
          <NavItem icon={Package} label="Products" active={activeTab === 'products'} onClick={() => { setActiveTab('products'); setSidebarOpen(false) }} />
          <NavItem icon={Layers} label="Categories" active={activeTab === 'categories'} onClick={() => { setActiveTab('categories'); setSidebarOpen(false) }} />
          <NavItem icon={TrendingUp} label="Trending" active={activeTab === 'trending'} onClick={() => { setActiveTab('trending'); setSidebarOpen(false) }} />
          <NavItem icon={Tag} label="Deals" active={activeTab === 'deals'} onClick={() => { setActiveTab('deals'); setSidebarOpen(false) }} />
          <NavItem icon={BarChart2} label="Analytics" active={activeTab === 'analytics'} onClick={() => { setActiveTab('analytics'); setSidebarOpen(false) }} />
          <div className="mt-3 border-t border-white/8 pt-3">
            <p className="px-3 pb-1 text-[9px] font-bold uppercase tracking-widest text-white/20">Home Decor</p>
            <NavItem icon={Home} label="Home Decor" variant="green" active={activeTab === 'home-decor'} onClick={() => { setActiveTab('home-decor'); setSidebarOpen(false) }} />
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-white/8 p-4">
          <button
            onClick={auth.logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 transition hover:bg-white/5 hover:text-white/70"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-white/8 bg-[#0a0a0a]/80 px-5 backdrop-blur-xl lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 lg:hidden"
          >
            <LayoutDashboard size={16} />
          </button>
          <h1 className="font-display text-lg font-semibold text-white capitalize">
            {activeTab === 'home-decor' ? 'Home Decor' : activeTab}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            {activeTab === 'home-decor' ? (
              <button
                onClick={() => { setHdEditing(null); setHdView('add') }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 cursor-pointer"
              >
                <Plus size={15} /> Add Decor Product
              </button>
            ) : activeTab === 'categories' ? (
              <button
                onClick={() => openCategoryModal(null)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] px-4 py-2 text-sm font-semibold text-[#111] shadow-lg shadow-[var(--color-gold)]/20 transition hover:opacity-90 cursor-pointer"
              >
                <Plus size={15} /> Add Category
              </button>
            ) : (
              <button
                onClick={() => { setEditing(null); setView('add') }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] px-4 py-2 text-sm font-semibold text-[#111] shadow-lg shadow-[var(--color-gold)]/20 transition hover:opacity-90 cursor-pointer"
              >
                <Plus size={15} /> Add Product
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto px-5 py-8 lg:px-8">
          {/* Ambient glow */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--color-gold)] opacity-[0.04] blur-[100px]" />
          </div>

          {/* Stats grid */}
          {(activeTab === 'dashboard' || activeTab === 'analytics') && (
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {statCards.map((s) => (
                <div
                  key={s.label}
                  className={`relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${s.color} p-5`}
                >
                  <s.icon size={18} className={s.iconColor} />
                  <p className="mt-3 font-display text-2xl font-bold text-white">
                    {loading ? <span className="inline-block h-6 w-8 animate-pulse rounded bg-white/10" /> : s.value}
                  </p>
                  <p className="mt-0.5 text-xs text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab !== 'analytics' && activeTab !== 'home-decor' && (
            <>
              {/* Filters row */}
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products…"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder-white/25 outline-none focus:border-[var(--color-gold)]"
                  />
                </div>
                <select
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/60 outline-none focus:border-[var(--color-gold)]"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>
                  ))}
                </select>
                <span className="ml-auto text-xs text-white/30">{filtered.length} of {products.length} products</span>
              </div>

              {/* Products table */}
              <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="border-b border-white/8">
                      <tr className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                        <th className="px-5 py-4">Product</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4">Price</th>
                        <th className="px-5 py-4">Store</th>
                        <th className="px-5 py-4">Flags</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        [...Array(4)].map((_, i) => (
                          <tr key={i} className="border-b border-white/5">
                            {[...Array(6)].map((_, j) => (
                              <td key={j} className="px-5 py-4">
                                <div className="h-4 w-full max-w-[120px] animate-pulse rounded bg-white/5" />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-14 text-center text-sm text-white/30">
                            {search || filterCat ? 'No products match your filter.' : 'No products yet. Add your first one!'}
                          </td>
                        </tr>
                      ) : (
                        filtered.map((p) => (
                          <tr key={p.id} className="group border-b border-white/5 transition hover:bg-white/[0.03] last:border-0">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="h-11 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                                  {(p.images?.[0] || p.image) && (
                                    <img
                                      src={p.images?.[0] || p.image}
                                      alt=""
                                      className="h-full w-full object-cover"
                                      onError={(e) => { e.target.style.display = 'none' }}
                                    />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate font-medium text-white">{p.name}</p>
                                  <p className="truncate text-xs text-white/35">{p.brand}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 capitalize text-white/50">{p.category}</td>
                            <td className="px-5 py-3.5 font-medium text-white">₹{p.price?.toLocaleString('en-IN')}</td>
                            <td className="px-5 py-3.5 text-white/50">{p.store}</td>
                            <td className="px-5 py-3.5">
                              <div className="flex flex-wrap gap-1.5">
                                {p.featured && <Flag color="gold">Featured</Flag>}
                                {p.trending && <Flag color="purple">Trending</Flag>}
                                {p.deal && <Flag color="green">Deal</Flag>}
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => { setEditing(p); setView('edit') }}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)]"
                                  aria-label="Edit"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => setDeleteId(p.id)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition hover:border-red-400/50 hover:text-red-400"
                                  aria-label="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Chart 1: Most Viewed Products */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                <h3 className="font-display text-sm font-semibold text-white mb-6">Most Viewed Products</h3>
                <div className="space-y-4">
                  {mostViewedData.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center text-center">
                      <p className="text-sm font-medium text-white/40">No products uploaded yet</p>
                      <p className="text-[10px] text-white/20 mt-1">Upload products to see views analytics here</p>
                    </div>
                  ) : (
                    mostViewedData.map((p) => (
                      <div key={p.name} className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/75 font-medium truncate max-w-[200px]">{p.name}</span>
                          <span className="text-[var(--color-gold)] font-bold">{p.views.toLocaleString()} views</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] rounded-full"
                            style={{ width: `${(p.views / (mostViewedData[0]?.views || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chart 2: Store Referrals */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                <h3 className="font-display text-sm font-semibold text-white mb-6">Store Referrals</h3>
                <div className="space-y-4">
                  {storeClicksData.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center text-center">
                      <p className="text-sm font-medium text-white/40">No store data yet</p>
                      <p className="text-[10px] text-white/20 mt-1">Upload products to see store distribution here</p>
                    </div>
                  ) : (
                    storeClicksData.map((s) => (
                      <div key={s.store} className="flex items-center gap-4">
                        <span className="w-16 text-xs text-white/60 font-medium">{s.store}</span>
                        <div className="flex-grow h-3.5 bg-white/5 rounded-lg overflow-hidden relative">
                          <div
                            className="h-full rounded-lg"
                            style={{
                              width: `${s.pct}%`,
                              backgroundColor: s.color
                            }}
                          />
                          <span className="absolute inset-y-0 right-2 flex items-center text-[10px] font-bold text-white/90">
                            {s.pct}%
                          </span>
                        </div>
                        <span className="text-xs text-white/40 w-16 text-right shrink-0">{s.clicks} clicks</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chart 3: Clicks Trend Line Chart */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 lg:col-span-2">
                <h3 className="font-display text-sm font-semibold text-white mb-4">Weekly Clicks & Earnings Trend</h3>
                <div className="relative h-64 w-full mt-6">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                    <div className="border-t border-white w-full h-0" />
                    <div className="border-t border-white w-full h-0" />
                    <div className="border-t border-white w-full h-0" />
                    <div className="border-t border-white w-full h-0" />
                  </div>
                  
                  {/* SVG Chart */}
                  <svg className="w-full h-full" viewBox="0 0 700 220" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>
                    
                    {/* Area path */}
                    <path
                      d="M 25 180 Q 120 160 216 110 T 408 80 T 600 40 L 675 30 L 675 210 L 25 210 Z"
                      fill="url(#chart-grad)"
                    />
                    
                    {/* Line path */}
                    <path
                      d="M 25 180 Q 120 160 216 110 T 408 80 T 600 40 L 675 30"
                      fill="none"
                      stroke="var(--color-gold)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Dots */}
                    <circle cx="25" cy="180" r="4.5" fill="#111111" stroke="var(--color-gold)" strokeWidth="2.5" />
                    <circle cx="130" cy="165" r="4.5" fill="#111111" stroke="var(--color-gold)" strokeWidth="2.5" />
                    <circle cx="235" cy="115" r="4.5" fill="#111111" stroke="var(--color-gold)" strokeWidth="2.5" />
                    <circle cx="340" cy="95" r="4.5" fill="#111111" stroke="var(--color-gold)" strokeWidth="2.5" />
                    <circle cx="445" cy="80" r="4.5" fill="#111111" stroke="var(--color-gold)" strokeWidth="2.5" />
                    <circle cx="550" cy="45" r="4.5" fill="#111111" stroke="var(--color-gold)" strokeWidth="2.5" />
                    <circle cx="675" cy="30" r="4.5" fill="#111111" stroke="var(--color-gold)" strokeWidth="2.5" />
                  </svg>
                  
                  {/* X Axis Labels */}
                  <div className="flex justify-between text-[10px] text-white/40 mt-3 font-semibold px-2">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="mt-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {categoriesList.map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length
                  return (
                    <div
                      key={cat.id}
                      className="flex flex-col justify-between rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{cat.emoji}</span>
                          <div>
                            <h3 className="font-display text-sm font-semibold text-white">{cat.name}</h3>
                            <p className="text-[10px] font-mono text-white/40">slug: {cat.id}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-xs text-white/50">
                          {count} {count === 1 ? 'product' : 'products'} listed
                        </p>
                      </div>
                      
                      <div className="mt-6 flex justify-end gap-2 border-t border-white/5 pt-3">
                        <button
                          onClick={() => openCategoryModal(cat)}
                          className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/5 hover:text-[var(--color-gold)] cursor-pointer"
                          title="Edit Category"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="rounded-lg p-1.5 text-white/40 transition hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {activeTab === 'home-decor' && (
            <>
              {/* Sub-tab switcher */}
              <div className="mb-6 flex gap-2">
                <button
                  onClick={() => setHdTab('products')}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${hdTab === 'products' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}
                >
                  🛋️ Products
                </button>
                <button
                  onClick={() => setHdTab('categories')}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${hdTab === 'categories' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}
                >
                  🗂️ Categories
                </button>
              </div>

              {hdTab === 'products' && (
                <>
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        value={hdSearch}
                        onChange={(e) => setHdSearch(e.target.value)}
                        placeholder="Search decor products…"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder-white/25 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <span className="ml-auto text-xs text-white/30">
                      {hdProducts.filter(p => !hdSearch || p.name?.toLowerCase().includes(hdSearch.toLowerCase())).length} products
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="border-b border-white/8">
                          <tr className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                            <th className="px-5 py-4">Product</th>
                            <th className="px-5 py-4">Category</th>
                            <th className="px-5 py-4">Price</th>
                            <th className="px-5 py-4">Store</th>
                            <th className="px-5 py-4">Flags</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hdProducts
                            .filter(p => !hdSearch || p.name?.toLowerCase().includes(hdSearch.toLowerCase()))
                            .length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-5 py-14 text-center text-sm text-white/30">
                                {hdSearch ? 'No products match your search.' : 'No Home Decor products yet. Click "Add Decor Product" to get started!'}
                              </td>
                            </tr>
                          ) : (
                            hdProducts
                              .filter(p => !hdSearch || p.name?.toLowerCase().includes(hdSearch.toLowerCase()))
                              .map((p) => (
                                <tr key={p.id} className="group border-b border-white/5 transition hover:bg-white/[0.03] last:border-0">
                                  <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                      <div className="h-11 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                                        {(p.images?.[0] || p.image) && (
                                          <img src={p.images?.[0] || p.image} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="truncate font-medium text-white">{p.name}</p>
                                        <p className="truncate text-xs text-white/35">{p.brand}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-3.5 capitalize text-white/50">{p.category?.replace(/_/g, ' ')}</td>
                                  <td className="px-5 py-3.5 font-medium text-white">₹{p.price?.toLocaleString('en-IN')}</td>
                                  <td className="px-5 py-3.5 text-white/50">{p.store}</td>
                                  <td className="px-5 py-3.5">
                                    <div className="flex flex-wrap gap-1.5">
                                      {p.featured && <Flag color="gold">Featured</Flag>}
                                      {p.trending && <Flag color="purple">Trending</Flag>}
                                      {p.deal && <Flag color="green">Deal</Flag>}
                                    </div>
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => { setHdEditing(p); setHdView('edit') }}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition hover:border-emerald-400/50 hover:text-emerald-400"
                                        aria-label="Edit"
                                      >
                                        <Pencil size={13} />
                                      </button>
                                      <button
                                        onClick={() => setHdDeleteId(p.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition hover:border-red-400/50 hover:text-red-400"
                                        aria-label="Delete"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {hdTab === 'categories' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {hdCategories.map((cat) => {
                    const count = hdProducts.filter((p) => p.category === cat.id).length
                    return (
                      <div key={cat.id} className="flex flex-col justify-between rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5 transition hover:bg-emerald-500/[0.06]">
                        <div>
                          <div className="flex items-center gap-3">
                            <img src={`/categories/${cat.id}.png`} alt={cat.name} className="h-12 w-12 rounded-xl object-cover border border-white/10" onError={(e) => { e.target.style.display='none' }} />
                            <div>
                              <h3 className="font-display text-sm font-semibold text-white">{cat.emoji} {cat.name}</h3>
                              <p className="text-[10px] font-mono text-white/40">slug: {cat.id}</p>
                            </div>
                          </div>
                          <p className="mt-4 text-xs text-white/50">
                            {count} {count === 1 ? 'product' : 'products'} listed
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Delete confirmation modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#161616] p-7 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="font-display text-base font-semibold text-white">Delete Product?</h2>
              <button onClick={() => setDeleteId(null)} className="text-white/30 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <p className="mb-6 text-sm text-white/50">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/90 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 transition hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Create/Edit modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <form
            onSubmit={saveCategory}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#161616] p-7 shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-display text-base font-semibold text-white">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                type="button"
                onClick={() => setCatModalOpen(false)}
                className="text-white/30 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">
                  Category Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Watches"
                  value={catFormName}
                  onChange={(e) => {
                    setCatFormName(e.target.value)
                    if (!editingCategory) {
                      setCatFormId(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
                    }
                  }}
                  className="w-full rounded-xl border border-white/8 bg-[#202020] px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-gold)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">
                  Category Slug *
                </label>
                <input
                  required
                  disabled={!!editingCategory}
                  type="text"
                  placeholder="e.g. watches"
                  value={catFormId}
                  onChange={(e) => setCatFormId(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                  className="w-full rounded-xl border border-white/8 bg-[#202020] px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-gold)] disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">
                  Emoji Icon *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. ⌚"
                  value={catFormEmoji}
                  onChange={(e) => setCatFormEmoji(e.target.value)}
                  className="w-full rounded-xl border border-white/8 bg-[#202020] px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-gold)]"
                />
              </div>
            </div>

            {catError && <p className="text-xs text-red-400 font-medium">{catError}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCatModalOpen(false)}
                className="flex-1 rounded-xl border border-white/8 py-3 text-xs font-semibold text-white/60 hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={catSaving}
                className="flex-1 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] py-3 text-xs font-bold text-[#111] hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {catSaving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Home Decor Delete confirmation modal */}
      {hdDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#161616] p-7 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="font-display text-base font-semibold text-white">Delete Decor Product?</h2>
              <button onClick={() => setHdDeleteId(null)} className="text-white/30 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <p className="mb-6 text-sm text-white/50">This action cannot be undone. The home decor product will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  setHdDeleting(true)
                  try {
                    await fetch(`/api/home-decor/products/${hdDeleteId}`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${auth.token}` }
                    })
                    setHdProducts((p) => p.filter((x) => x.id !== hdDeleteId))
                  } catch { /**/ }
                  setHdDeleteId(null)
                  setHdDeleting(false)
                }}
                disabled={hdDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/90 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                {hdDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
              <button
                onClick={() => setHdDeleteId(null)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/60 transition hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function NavItem({ icon: Icon, label, active, onClick, variant = 'gold' }) {
  const activeClass = variant === 'green'
    ? 'bg-emerald-500/15 text-emerald-400'
    : 'bg-[var(--color-gold)]/15 text-[var(--color-gold)]'
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? activeClass
          : 'text-white/40 hover:bg-white/5 hover:text-white/70'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  )
}

function Flag({ children, color }) {
  const cls = {
    gold: 'bg-[var(--color-gold)]/15 text-[var(--color-gold)]',
    purple: 'bg-purple-500/15 text-purple-400',
    green: 'bg-emerald-500/15 text-emerald-400',
  }[color]
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${cls}`}>
      {children}
    </span>
  )
}
