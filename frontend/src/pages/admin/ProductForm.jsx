import { useState, useEffect, useRef } from 'react'
import { UploadCloud, X, Plus, Link2, Loader2 } from 'lucide-react'
import { CATEGORIES, STORES, DEFAULT_SUBCATEGORIES } from '../../data/mockData'
import { api } from '../../api/client'
import { useAdminAuth } from '../../context/AdminAuthContext'

const EMPTY = {
  name: '', description: '', category: CATEGORIES[0]?.id || 'women',
  subcategory: '', brand: '', price: '', mrp: '', discount: '',
  rating: '4.5', store: 'Amazon', affiliateLink: '',
  images: [], colors: [], sizes: [],
  featured: false, trending: false, deal: false,
}

const SIZE_OPTIONS = [
  'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL',
  '6', '7', '8', '9', '10', '11', 'One Size'
]

export default function ProductForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial } : EMPTY)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [colorInput, setColorInput] = useState('')
  const [sizeInput, setSizeInput] = useState('')
  const [customSize, setCustomSize] = useState('')
  const [showCustomSize, setShowCustomSize] = useState(false)
  const [scrapeUrl, setScrapeUrl] = useState('')
  const [scraping, setScraping] = useState(false)
  const [scrapeError, setScrapeError] = useState('')
  const auth = useAdminAuth()
  const fileRef = useRef()

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) return
    setScraping(true)
    setScrapeError('')
    try {
      const data = await api.scrapeUrl(scrapeUrl.trim(), auth.token)
      if (data.error) {
        setScrapeError(data.error)
      } else {
        set({
          name: data.name || form.name,
          brand: data.brand || form.brand,
          description: data.description || form.description,
          price: data.price ? String(data.price) : form.price,
          store: data.store || form.store,
          affiliateLink: data.affiliateLink || form.affiliateLink,
          images: data.image ? [data.image] : form.images
        })
        setScrapeUrl('')
      }
    } catch (err) {
      setScrapeError(err.message || 'Failed to scrape. Please fill manually.')
    } finally {
      setScraping(false)
    }
  }

  const [categories, setCategories] = useState([])
  const [dbSubcategories, setDbSubcategories] = useState([])

  useEffect(() => {
    api.getCategories()
      .then((data) => {
        setCategories(data)
        if (data.length && !form.category) {
          set({ category: data[0].id })
        }
      })
      .catch(() => {
        setCategories(CATEGORIES)
      })
  }, [])

  useEffect(() => {
    if (form.category) {
      api.getSubcategories(form.category)
        .then(setDbSubcategories)
        .catch(() => setDbSubcategories([]))
    } else {
      setDbSubcategories([])
    }
  }, [form.category])

  // ── Image upload ──
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

  // ── Chip inputs ──
  const addChip = (field, val, setter) => {
    const v = val.trim()
    if (!v || form[field].includes(v)) { setter(''); return }
    set({ [field]: [...form[field], v] })
    setter('')
  }

  const removeChip = (field, val) => set({ [field]: form[field].filter((x) => x !== val) })

  // ── Submit ──
  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const priceNum = Number(form.price)
    const mrpNum = Number(form.mrp || form.price) || priceNum
    const rawDiscount = Number(form.discount)
    const autoDiscount = mrpNum > 0 ? Math.round(100 - (priceNum / mrpNum) * 100) : 0

    let finalColors = form.colors || []
    if (colorInput.trim() && !finalColors.includes(colorInput.trim())) {
      finalColors = [...finalColors, colorInput.trim()]
    }

    let finalSizes = form.sizes || []
    if (sizeInput.trim() && !finalSizes.includes(sizeInput.trim())) {
      finalSizes = [...finalSizes, sizeInput.trim()]
    }

    const payload = {
      ...form,
      price: priceNum,
      mrp: mrpNum,
      discount: rawDiscount > 0 ? Math.round(rawDiscount) : autoDiscount,
      rating: Number(form.rating),
      images: form.images || [],
      colors: finalColors,
      sizes: finalSizes,
    }
    try {
      if (initial?.id) await api.updateProduct(initial.id, payload, auth.token)
      else await api.createProduct(payload, auth.token)
      onSaved()
    } catch (err) {
      const raw = err?.message || ''
      // Try to extract a human-readable detail from the API error
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
      {/* Feature 1: Scraper Auto-Fill */}
      {!initial?.id && (
        <div className="rounded-xl border border-dashed border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-gold)]">
                Auto-Fill from Store URL (Amazon, Myntra, AJIO, Flipkart, Nykaa)
              </label>
              <input
                type="url"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                placeholder="Paste store product link here (e.g., https://www.amazon.in/dp/...) and click scrape"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white outline-none focus:border-[var(--color-gold)]"
              />
            </div>
            <button
              type="button"
              disabled={scraping || !scrapeUrl.trim()}
              onClick={handleScrape}
              className="inline-flex h-[42px] items-center justify-center gap-1.5 rounded-xl bg-[var(--color-gold)] px-5 text-xs font-semibold text-[#111] transition hover:bg-[var(--color-gold-dark)] disabled:opacity-50 cursor-pointer"
            >
              {scraping ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Scraping...
                </>
              ) : (
                'Scrape & Pre-Fill'
              )}
            </button>
          </div>
          {scrapeError && <p className="mt-2 text-[10px] text-red-400 font-medium">{scrapeError}</p>}
        </div>
      )}

      {/* Section: Basic Info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Product Name *">
            <Input required value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Floral Maxi Dress" />
          </Field>
          <Field label="Brand *">
            <Input required value={form.brand} onChange={(e) => set({ brand: e.target.value })} placeholder="e.g. Zara" />
          </Field>
        </div>
        <Field label="Description *">
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Describe the product…"
            className={inputCls + ' resize-none'}
          />
        </Field>
      </Section>

      {/* Section: Categorization */}
      <Section title="Categorization">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Category">
            <select value={form.category} onChange={(e) => set({ category: e.target.value })} className={inputCls}>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1a1a1a]">
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Subcategory">
            <input
              type="text"
              list="form-subcategory-suggestions"
              value={form.subcategory}
              onChange={(e) => set({ subcategory: e.target.value })}
              placeholder="e.g. Coats"
              className={inputCls}
            />
            <datalist id="form-subcategory-suggestions">
              {Array.from(new Set([
                ...(DEFAULT_SUBCATEGORIES[form.category?.toLowerCase()] || []),
                ...dbSubcategories
              ])).map((sub) => (
                <option key={sub} value={sub} />
              ))}
            </datalist>
          </Field>
          <Field label="Store">
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
          </Field>
          <Field label="Rating (0–5)">
            <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => set({ rating: e.target.value })} />
          </Field>
        </div>
      </Section>

      {/* Section: Pricing */}
      <Section title="Pricing">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Price (₹) *">
            <Input required type="number" min="0" value={form.price} onChange={(e) => set({ price: e.target.value })} placeholder="999" />
          </Field>
          <Field label="MRP (₹)">
            <Input type="number" min="0" value={form.mrp} onChange={(e) => set({ mrp: e.target.value })} placeholder="1499" />
          </Field>
          <Field label="Discount (%) — auto if blank">
            <Input type="number" min="0" max="90" value={form.discount} onChange={(e) => set({ discount: e.target.value })} placeholder="Auto" />
          </Field>
        </div>
      </Section>

      {/* Section: Affiliate Link */}
      <Section title="Affiliate Link">
        <Field label="URL *">
          <div className="relative">
            <Link2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <Input
              required
              type="url"
              value={form.affiliateLink}
              onChange={(e) => set({ affiliateLink: e.target.value })}
              placeholder="https://amazon.in/dp/..."
              className="pl-9"
            />
          </div>
        </Field>
        {form.affiliateLink && (
          <a
            href={form.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[var(--color-gold)] hover:underline"
          >
            <Link2 size={11} /> Preview link
          </a>
        )}
      </Section>

      {/* Section: Images */}
      <Section title="Product Images">
        <div className="flex flex-wrap items-center gap-3">
          {form.images.map((img, i) => (
            <div key={i} className="group relative h-24 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <img src={img} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.style.opacity = '0.3' }} />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
              >
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
        <p className="mt-2 text-xs text-white/25">Accepts JPG, PNG, WebP — max 5 MB each. First image shown as thumbnail.</p>
      </Section>

      {/* Section: Colors & Sizes */}
      <Section title="Colors & Sizes">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Colors */}
          <Field label="Colors">
            <ChipInput
              value={colorInput}
              onChange={setColorInput}
              onAdd={() => addChip('colors', colorInput, setColorInput)}
              placeholder="e.g. Red, Navy…"
            />
            <ChipList chips={form.colors} onRemove={(v) => removeChip('colors', v)} color="blue" />
          </Field>

          {/* Sizes */}
          <Field label="Sizes">
            <div className="flex gap-2">
              {showCustomSize ? (
                <input
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder="e.g. 42, XXL, Custom size..."
                  className={inputCls + ' flex-1'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addChip('sizes', customSize, setCustomSize)
                    }
                  }}
                />
              ) : (
                <select
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  className={inputCls + ' flex-1 bg-[#1a1a1a]'}
                >
                  <option value="" className="text-white/20">Select size...</option>
                  {SIZE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#1a1a1a]">
                      {opt}
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={() => {
                  if (showCustomSize) {
                    addChip('sizes', customSize, setCustomSize)
                  } else {
                    addChip('sizes', sizeInput, setSizeInput)
                  }
                }}
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)]"
              >
                <Plus size={15} />
              </button>
            </div>
            <div className="mt-1.5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCustomSize(!showCustomSize)}
                className="text-[10px] font-semibold text-[var(--color-gold)] hover:underline cursor-pointer"
              >
                {showCustomSize ? '← Choose standard size' : '✎ Enter custom size'}
              </button>
            </div>
            <ChipList chips={form.sizes} onRemove={(v) => removeChip('sizes', v)} color="purple" />
          </Field>
        </div>
      </Section>

      {/* Section: Flags */}
      <Section title="Product Flags">
        <div className="flex flex-wrap gap-4">
          <Toggle label="⭐ Featured" checked={form.featured} onChange={(v) => set({ featured: v })} />
          <Toggle label="🔥 Trending" checked={form.trending} onChange={(v) => set({ trending: v })} />
          <Toggle label="🏷️ Today's Deal" checked={form.deal} onChange={(v) => set({ deal: v })} />
        </div>
      </Section>

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-3 border-t border-white/8 pt-5">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-gold)]/20 transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : null}
          {saving ? 'Saving…' : 'Save Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 px-7 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white/70"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ── Sub-components ──

function Section({ title, children }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-white/30">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/50">{label}</span>
      {children}
    </label>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`${inputCls} ${className}`}
      {...props}
    />
  )
}

function ChipInput({ value, onChange, onAdd, placeholder }) {
  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd() } }}
        placeholder={placeholder}
        className={inputCls + ' flex-1'}
      />
      <button
        type="button"
        onClick={onAdd}
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)]"
      >
        <Plus size={15} />
      </button>
    </div>
  )
}

function ChipList({ chips, onRemove, color }) {
  if (!chips.length) return null
  const cls = {
    blue: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
  }[color]
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <span key={c} className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium ${cls}`}>
          {c}
          <button type="button" onClick={() => onRemove(c)} className="opacity-60 hover:opacity-100">
            <X size={10} />
          </button>
        </span>
      ))}
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-white/60">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-[var(--color-gold)]' : 'bg-white/10'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
      {label}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[var(--color-gold)]'
