import { useState, useEffect, useRef } from 'react'
import { UploadCloud, X, Plus, Link2, Loader2 } from 'lucide-react'
import { homeDecorApi } from '../../api/homeDecorClient'
import { api } from '../../api/client'
import { useAdminAuth } from '../../context/AdminAuthContext'

const HD_CATEGORIES = [
  { id: 'living_room', name: '🛋️ Living Room' },
  { id: 'bedroom', name: '🛏️ Bedroom' },
  { id: 'lighting', name: '💡 Lighting & Lamps' },
  { id: 'wall_decor', name: '🖼️ Wall Decor & Art' },
  { id: 'kitchen_dining', name: '🍽️ Kitchen & Dining' },
  { id: 'rugs_carpets', name: '🧶 Rugs & Carpets' },
  { id: 'showpieces_vases', name: '🏺 Showpieces & Vases' },
]

const STORES = ['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Nykaa', 'Meesho']

const COMMON_COLORS = [
  'Black', 'White', 'Gray', 'Beige', 'Brown',
  'Gold', 'Silver', 'Red', 'Blue', 'Green',
  'Navy', 'Pink', 'Purple', 'Orange', 'Yellow'
]

const EMPTY = {
  name: '', description: '', category: 'living_room',
  subcategory: '', brand: '', price: '', mrp: '', discount: '',
  rating: '4.5', store: 'Amazon', affiliateLink: '',
  images: [], colors: [], sizes: [],
  featured: false, trending: false, deal: false,
}

const inputCls = 'w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[var(--color-gold)]'

export default function HomeDecorProductForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial } : EMPTY)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [colorInput, setColorInput] = useState('')
  const [sizeInput, setSizeInput] = useState('')
  const auth = useAdminAuth()
  const fileRef = useRef()

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          try {
            const { url } = await api.uploadImage(file, auth.token)
            return url
          } catch {
            return URL.createObjectURL(file)
          }
        })
      )
      set({ images: [...form.images, ...urls] })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeImage = (idx) => set({ images: form.images.filter((_, i) => i !== idx) })

  const addChip = (field, val, setter) => {
    const v = val.trim()
    if (!v || form[field].includes(v)) { setter(''); return }
    set({ [field]: [...form[field], v] })
    setter('')
  }

  const removeChip = (field, val) => set({ [field]: form[field].filter((x) => x !== val) })

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const priceNum = Number(form.price)
    const mrpNum = Number(form.mrp || form.price) || priceNum
    const rawDiscount = Number(form.discount)
    const autoDiscount = mrpNum > 0 ? Math.round(100 - (priceNum / mrpNum) * 100) : 0

    let finalColors = [...(form.colors || [])]
    if (colorInput.trim() && !finalColors.includes(colorInput.trim())) finalColors.push(colorInput.trim())

    let finalSizes = [...(form.sizes || [])]
    if (sizeInput.trim() && !finalSizes.includes(sizeInput.trim())) finalSizes.push(sizeInput.trim())

    const payload = {
      ...form,
      price: priceNum,
      mrp: mrpNum,
      discount: rawDiscount > 0 ? Math.round(rawDiscount) : autoDiscount,
      rating: Number(form.rating),
      images: form.images || [],
      colors: finalColors,
      sizes: finalSizes,
      affiliateLink: form.affiliateLink || form.affiliate_link || '',
    }

    try {
      const BASE = '/api/home-decor'
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` }
      if (initial?.id) {
        const res = await fetch(`${BASE}/products/${initial.id}`, { method: 'PUT', headers, body: JSON.stringify(payload) })
        if (!res.ok) throw new Error(await res.text())
      } else {
        const res = await fetch(`${BASE}/products`, { method: 'POST', headers, body: JSON.stringify(payload) })
        if (!res.ok) throw new Error(await res.text())
      }
      onSaved()
    } catch (err) {
      const raw = err?.message || ''
      const match = raw.match(/API \d+: (.+)/s)
      const detail = match ? match[1] : raw
      let friendly = 'Could not save. Make sure the backend is running.'
      try {
        const parsed = JSON.parse(detail)
        if (parsed?.detail) {
          friendly = Array.isArray(parsed.detail)
            ? parsed.detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
            : String(parsed.detail)
        }
      } catch { /**/ }
      setError(friendly)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-white/8 bg-white/[0.03] p-7 backdrop-blur-sm">
      {/* Basic Info */}
      <FormSection title="Basic Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Product Name *">
            <input required className={inputCls} value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Wooden Tripod Floor Lamp" />
          </FormField>
          <FormField label="Brand *">
            <input required className={inputCls} value={form.brand} onChange={(e) => set({ brand: e.target.value })} placeholder="e.g. DeLight" />
          </FormField>
        </div>
        <FormField label="Description *">
          <textarea required rows={3} className={inputCls + ' resize-none'} value={form.description} onChange={(e) => set({ description: e.target.value })} placeholder="Describe the product…" />
        </FormField>
      </FormSection>

      {/* Categorization */}
      <FormSection title="Categorization">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <FormField label="Category">
            <select className={inputCls} value={form.category} onChange={(e) => set({ category: e.target.value })}>
              {HD_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1a1a1a]">{c.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Subcategory">
            <input className={inputCls} value={form.subcategory} onChange={(e) => set({ subcategory: e.target.value })} placeholder="e.g. Pendant Lamp" />
          </FormField>
          <FormField label="Store">
            <select
              value={STORES.includes(form.store) ? form.store : (form.store ? '__custom__' : STORES[0])}
              onChange={(e) => {
                const val = e.target.value
                if (val === '__custom__') {
                  set({ store: '' })
                } else {
                  set({ store: val })
                }
              }}
              className={inputCls}
            >
              {STORES.map((s) => <option key={s} value={s} className="bg-[#1a1a1a]">{s}</option>)}
              <option value="__custom__" className="bg-[#1a1a1a]">Other / Custom Store...</option>
            </select>
            {!STORES.includes(form.store) && (
              <input
                type="text"
                required
                placeholder="Enter custom store name..."
                value={form.store}
                onChange={(e) => set({ store: e.target.value })}
                className={inputCls + ' mt-2'}
              />
            )}
          </FormField>
          <FormField label="Rating (0–5)">
            <input type="number" step="0.1" min="0" max="5" className={inputCls} value={form.rating} onChange={(e) => set({ rating: e.target.value })} />
          </FormField>
        </div>
      </FormSection>

      {/* Pricing */}
      <FormSection title="Pricing">
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Price (₹) *">
            <input required type="number" min="0" className={inputCls} value={form.price} onChange={(e) => set({ price: e.target.value })} placeholder="999" />
          </FormField>
          <FormField label="MRP (₹)">
            <input type="number" min="0" className={inputCls} value={form.mrp} onChange={(e) => set({ mrp: e.target.value })} placeholder="1499" />
          </FormField>
          <FormField label="Discount (%) — auto if blank">
            <input type="number" min="0" max="90" className={inputCls} value={form.discount} onChange={(e) => set({ discount: e.target.value })} placeholder="Auto" />
          </FormField>
        </div>
      </FormSection>

      {/* Affiliate Link */}
      <FormSection title="Affiliate Link">
        <FormField label="URL *">
          <div className="relative">
            <Link2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input required type="url" className={inputCls + ' pl-9'} value={form.affiliateLink} onChange={(e) => set({ affiliateLink: e.target.value })} placeholder="https://amazon.in/dp/..." />
          </div>
        </FormField>
      </FormSection>

      {/* Images */}
      <FormSection title="Product Images">
        <div className="flex flex-wrap items-center gap-3">
          {form.images.map((img, i) => (
            <div key={i} className="group relative h-24 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <img src={img} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100">
                <X size={10} />
              </button>
            </div>
          ))}
          <label className="flex h-24 w-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 text-white/30 transition hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)]/60">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
            <span className="text-[10px]">{uploading ? 'Uploading…' : 'Add image'}</span>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>
        <p className="mt-2 text-xs text-white/25">You can also paste an image URL directly in the affiliate link — first image shown as thumbnail.</p>
      </FormSection>

      {/* Colors & Sizes */}
      <FormSection title="Colors & Dimensions">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Colors/Styles">
            <div className="mb-2 flex flex-wrap gap-1">
              {COMMON_COLORS.map((c) => {
                const active = form.colors.includes(c)
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => {
                      if (active) {
                        removeChip('colors', c)
                      } else {
                        set({ colors: [...form.colors, c] })
                      }
                    }}
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition ${
                      active
                        ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                        : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-2">
              <input className={inputCls + ' flex-1'} value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addChip('colors', colorInput, setColorInput) } }} placeholder="Or type custom color and press +" />
              <button type="button" onClick={() => addChip('colors', colorInput, setColorInput)} className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)]">
                <Plus size={15} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {form.colors.map((c) => (
                <span key={c} className="flex items-center gap-1 rounded-lg border border-blue-500/20 bg-blue-500/15 px-2.5 py-1 text-xs font-medium text-blue-300">
                  {c}
                  <button type="button" onClick={() => removeChip('colors', c)} className="opacity-60 hover:opacity-100"><X size={10} /></button>
                </span>
              ))}
            </div>
          </FormField>
          <FormField label="Sizes/Dimensions">
            <div className="flex gap-2">
              <input className={inputCls + ' flex-1'} value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addChip('sizes', sizeInput, setSizeInput) } }} placeholder="e.g. 4x6 ft, King, Single…" />
              <button type="button" onClick={() => addChip('sizes', sizeInput, setSizeInput)} className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)]">
                <Plus size={15} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {form.sizes.map((s) => (
                <span key={s} className="flex items-center gap-1 rounded-lg border border-purple-500/20 bg-purple-500/15 px-2.5 py-1 text-xs font-medium text-purple-300">
                  {s}
                  <button type="button" onClick={() => removeChip('sizes', s)} className="opacity-60 hover:opacity-100"><X size={10} /></button>
                </span>
              ))}
            </div>
          </FormField>
        </div>
      </FormSection>

      {/* Flags */}
      <FormSection title="Product Flags">
        <div className="flex flex-wrap gap-4">
          <Toggle label="⭐ Featured" checked={form.featured} onChange={(v) => set({ featured: v })} />
          <Toggle label="🔥 Trending" checked={form.trending} onChange={(v) => set({ trending: v })} />
          <Toggle label="🏷️ Today's Deal" checked={form.deal} onChange={(v) => set({ deal: v })} />
        </div>
      </FormSection>

      {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">{error}</p>}

      <div className="flex gap-3 border-t border-white/8 pt-5">
        <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-gold)]/20 transition hover:opacity-90 disabled:opacity-50">
          {saving ? <Loader2 size={15} className="animate-spin" /> : null}
          {saving ? 'Saving…' : 'Save Product'}
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-white/10 px-7 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white/70">
          Cancel
        </button>
      </div>
    </form>
  )
}

function FormSection({ title, children }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-white/30">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/50">{label}</span>
      {children}
    </label>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-[var(--color-gold)]' : 'bg-white/10'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
      {label}
    </label>
  )
}
