import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import FilterSidebar from '../components/FilterSidebar'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import { useProducts, useBrandsAndStores } from '../hooks/useProducts'
import { api } from '../api/client'
import { getLocalSuggestions } from '../data/mockData'

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

  const [querySuggestions, setQuerySuggestions] = useState([])
  const [productSuggestions, setProductSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)

  useEffect(() => {
    if (!term.trim()) {
      setQuerySuggestions([])
      setProductSuggestions([])
      return
    }

    const delayDebounceFn = setTimeout(() => {
      // 1. Fetch query predictions (autocomplete phrases)
      api.predict(term)
        .then((res) => {
          setQuerySuggestions(res.slice(0, 5))
        })
        .catch(() => {
          const fallback = getLocalSuggestions(term)
          setQuerySuggestions(fallback.slice(0, 5))
        })

      // 2. Fetch product suggestions
      api.search(term)
        .then((res) => {
          setProductSuggestions(res.slice(0, 5))
        })
        .catch(() => {
          setProductSuggestions([])
        })
    }, 200)

    return () => clearTimeout(delayDebounceFn)
  }, [term])

  const combinedSuggestions = useMemo(() => {
    return [
      ...querySuggestions.map((q) => ({ type: 'query', id: `q-${q}`, label: q, data: q })),
      ...productSuggestions.map((p) => ({ type: 'product', id: `p-${p.id}`, label: p.name, data: p })),
    ]
  }, [querySuggestions, productSuggestions])

  const selectSuggestion = (item) => {
    if (item.type === 'query') {
      setTerm(item.data)
      setParams({ q: item.data })
    } else {
      setTerm(item.data.name)
      setParams({ q: item.data.name })
    }
    setShowSuggestions(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setShowSuggestions(true)
      setActiveSuggestionIndex((prev) =>
        prev < combinedSuggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setShowSuggestions(true)
      setActiveSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : combinedSuggestions.length - 1
      )
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < combinedSuggestions.length) {
        e.preventDefault()
        selectSuggestion(combinedSuggestions[activeSuggestionIndex])
      } else {
        e.preventDefault()
        setParams(term.trim() ? { q: term.trim() } : {})
        setShowSuggestions(false)
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveSuggestionIndex(-1)
    }
  }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.search-page-form')) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    setParams(term.trim() ? { q: term.trim() } : {})
    setShowSuggestions(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <form onSubmit={submit} className="search-page-form relative mx-auto mb-3 max-w-2xl">
        <div className="glass flex items-center gap-3 rounded-full border border-[var(--color-line)] px-5 py-3.5 shadow-sm">
          <SearchIcon size={17} className="text-[var(--color-ink-soft)]" />
          <input
            value={term}
            onChange={(e) => {
              setTerm(e.target.value)
              setShowSuggestions(true)
              setActiveSuggestionIndex(-1)
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products, brands, or categories…"
            className="w-full bg-transparent text-sm outline-none"
            autoFocus
          />
        </div>

        {showSuggestions && combinedSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white/95 backdrop-blur-md shadow-xl py-2">
            {querySuggestions.length > 0 && (
              <div className="border-b border-[var(--color-line)] pb-2 mb-2">
                <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)] opacity-60">
                  Suggested Searches
                </div>
                {querySuggestions.map((q, idx) => {
                  const itemIndex = idx
                  const isActive = itemIndex === activeSuggestionIndex
                  return (
                    <button
                      type="button"
                      key={`query-${q}`}
                      onClick={() => selectSuggestion({ type: 'query', data: q })}
                      onMouseEnter={() => setActiveSuggestionIndex(itemIndex)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition cursor-pointer ${
                        isActive
                          ? 'bg-[var(--color-paper-dim)] text-[var(--color-gold-dark)] font-medium'
                          : 'text-[var(--color-ink)]'
                      }`}
                    >
                      <SearchIcon size={14} className="text-[var(--color-ink-soft)] shrink-0" />
                      <span>{q}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {productSuggestions.length > 0 && (
              <div>
                <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)] opacity-60">
                  Suggested Products
                </div>
                {productSuggestions.map((p, idx) => {
                  const itemIndex = querySuggestions.length + idx
                  const isActive = itemIndex === activeSuggestionIndex
                  return (
                    <button
                      type="button"
                      key={`prod-${p.id}`}
                      onClick={() => selectSuggestion({ type: 'product', data: p })}
                      onMouseEnter={() => setActiveSuggestionIndex(itemIndex)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition cursor-pointer ${
                        isActive
                          ? 'bg-[var(--color-paper-dim)] text-[var(--color-gold-dark)] font-medium'
                          : 'text-[var(--color-ink)]'
                      }`}
                    >
                      <img src={p.images?.[0] || '/logo.png'} alt="" className="h-9 w-9 rounded-lg object-cover shrink-0 border border-[var(--color-line)]" />
                      <div className="min-w-0 flex-1">
                        <span className="block font-medium truncate">{p.name}</span>
                        <span className="block text-xs text-[var(--color-ink-soft)] truncate">{p.brand}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </form>

      {!q && (
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">Trending searches</p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {TRENDING_SEARCHES.map((t) => (
              <button
                key={t}
                onClick={() => setParams({ q: t })}
                className="rounded-full border border-[var(--color-line)] px-4 py-2 text-xs text-[var(--color-ink-soft)] hover:border-[var(--color-gold)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
              >
                {t}
              </button>
            ))}
          </div>
          
          <div className="border-t border-[var(--color-line)] pt-8 mt-8">
            <p className="text-xs text-[var(--color-ink-soft)] mb-4">Looking for the full catalog?</p>
            <Link
              to="/category/all"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-medium text-white transition hover:bg-[var(--color-gold-dark)] shadow-sm"
            >
              Browse All Products
            </Link>
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
