import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import FilterSidebar from '../components/FilterSidebar'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import { useProducts, useBrandsAndStores } from '../hooks/useProducts'
import { PRODUCTS } from '../data/mockData'

const TRENDING_SEARCHES = ['Satin dresses', 'Chelsea boots', 'Wool coats', 'Gold watches', 'Linen blazers', 'Crossbody bags']

export default function Search() {
  const [params, setParams] = useSearchParams()
  const [term, setTerm] = useState(params.get('q') || '')
  const [filters, setFilters] = useState({})
  const { brands, stores } = useBrandsAndStores()

  useEffect(() => {
    setTerm(params.get('q') || '')
  }, [params])

  const q = params.get('q') || ''
  const queryFilters = useMemo(() => ({ q, ...filters }), [q, filters])
  const { loading, data } = useProducts(queryFilters)

  const suggestions = useMemo(() => {
    if (!term.trim()) return []
    const t = term.toLowerCase()
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t)).slice(0, 5)
  }, [term])

  const submit = (e) => {
    e.preventDefault()
    setParams(term.trim() ? { q: term.trim() } : {})
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <form onSubmit={submit} className="relative mx-auto mb-3 max-w-2xl">
        <div className="glass flex items-center gap-3 rounded-full border border-[var(--color-line)] px-5 py-3.5 shadow-sm">
          <SearchIcon size={17} className="text-[var(--color-ink-soft)]" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search for products, brands, or categories…"
            className="w-full bg-transparent text-sm outline-none"
            autoFocus
          />
        </div>

        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white shadow-lg">
            {suggestions.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => {
                  setTerm(s.name)
                  setParams({ q: s.name })
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-[var(--color-paper-dim)]"
              >
                <img src={s.images[0]} alt="" className="h-9 w-9 rounded-lg object-cover" />
                <span>
                  <span className="block font-medium text-[var(--color-ink)]">{s.name}</span>
                  <span className="block text-xs text-[var(--color-ink-soft)]">{s.brand}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </form>

      {!q && (
        <div className="mx-auto mb-10 max-w-2xl">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">Trending searches</p>
          <div className="flex flex-wrap justify-center gap-2">
            {TRENDING_SEARCHES.map((t) => (
              <button
                key={t}
                onClick={() => setParams({ q: t })}
                className="rounded-full border border-[var(--color-line)] px-4 py-2 text-xs text-[var(--color-ink-soft)] hover:border-[var(--color-gold)] hover:text-[var(--color-ink)]"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {q && (
        <div className="flex flex-col gap-8 lg:flex-row">
          <FilterSidebar filters={filters} setFilters={setFilters} brands={brands} stores={stores} onClear={() => setFilters({})} />
          <div className="flex-1">
            <p className="mb-5 text-sm text-[var(--color-ink-soft)]">
              {loading ? 'Searching…' : `${data.length} results for "${q}"`}
            </p>
            {loading ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : data.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--color-line)] py-20 text-center text-sm text-[var(--color-ink-soft)]">
                No results for "{q}". Try a different search term.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {data.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
