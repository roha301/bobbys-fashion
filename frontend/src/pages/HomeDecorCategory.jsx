import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import HomeDecorFilterSidebar from '../components/HomeDecorFilterSidebar'
import HomeDecorProductCard from '../components/HomeDecorProductCard'
import SkeletonCard from '../components/SkeletonCard'
import { useHomeDecorProducts, useHomeDecorBrandsAndStores, useHomeDecorCategories } from '../hooks/useHomeDecor'

const SORT_OPTIONS = [
  { value: '', label: 'Sort: Recommended' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
]

export default function HomeDecorCategory() {
  const { id } = useParams()
  const [filters, setFilters] = useState({})
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  
  const { brands, stores } = useHomeDecorBrandsAndStores()
  const { data: categories } = useHomeDecorCategories()

  // Reset local filters on category route change
  useEffect(() => {
    setFilters({})
  }, [id])

  const queryFilters = useMemo(() => {
    const base = { ...filters }
    if (id && id !== 'all') {
      base.category = id
    }
    return base
  }, [id, filters])

  const { loading, data } = useHomeDecorProducts(queryFilters)

  const activeCategory = useMemo(() => {
    if (!id || id === 'all') return null
    return categories.find(c => c.id === id)
  }, [id, categories])

  const title = activeCategory ? activeCategory.name : 'All Decor'

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
          {activeCategory?.emoji && <span className="mr-2">{activeCategory.emoji}</span>}
          {title}
        </h1>
        <button
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-4 py-2 text-xs font-medium lg:hidden"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>
      <p className="mb-8 text-sm text-[var(--color-ink-soft)]">
        {loading ? 'Loading products…' : `${data.length} products found`}
      </p>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
          <HomeDecorFilterSidebar
            filters={filters}
            setFilters={setFilters}
            brands={brands}
            stores={stores}
            onClear={() => setFilters({})}
          />
        </div>

        <div className="flex-1">
          <div className="mb-5 flex justify-end">
            <select
              value={filters.sort || ''}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
              className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-xs outline-none focus:border-[var(--color-gold)]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : data.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--color-line)] py-20 text-center text-sm text-[var(--color-ink-soft)]">
              No products match these filters yet. Try clearing a filter.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {data.map((p, i) => (
                <HomeDecorProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
