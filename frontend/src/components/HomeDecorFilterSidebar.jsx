import { useMemo } from 'react'

const RATINGS = [4.5, 4, 3.5, 3]

export default function HomeDecorFilterSidebar({ filters, setFilters, brands = [], stores = [], onClear }) {
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }))

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-[var(--color-ink)]">Filters</h3>
          <button onClick={onClear} className="text-xs font-medium text-[var(--color-gold-dark)] hover:underline">
            Clear all
          </button>
        </div>

        <FilterGroup label="Price range">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => update({ minPrice: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-line)] px-2.5 py-2 text-xs outline-none focus:border-[var(--color-gold)]"
            />
            <span className="text-xs text-[var(--color-ink-soft)]">–</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => update({ maxPrice: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-line)] px-2.5 py-2 text-xs outline-none focus:border-[var(--color-gold)]"
            />
          </div>
        </FilterGroup>

        {brands.length > 0 && (
          <FilterGroup label="Brand">
            <select
              value={filters.brand || ''}
              onChange={(e) => update({ brand: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-line)] px-2.5 py-2 text-xs outline-none focus:border-[var(--color-gold)]"
            >
              <option value="">All brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </FilterGroup>
        )}

        {stores.length > 0 && (
          <FilterGroup label="Store">
            <select
              value={filters.store || ''}
              onChange={(e) => update({ store: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-line)] px-2.5 py-2 text-xs outline-none focus:border-[var(--color-gold)]"
            >
              <option value="">All stores</option>
              {stores.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FilterGroup>
        )}

        <FilterGroup label="Minimum rating">
          <div className="flex flex-wrap gap-2">
            {RATINGS.map((r) => (
              <button
                key={r}
                onClick={() => update({ minRating: filters.minRating === r ? '' : r })}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  filters.minRating === r
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
                    : 'border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-gold)]'
                }`}
              >
                {r}+
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Color" last>
          <div className="flex flex-wrap gap-2">
            {['White', 'Grey', 'Brown', 'Brass', 'Teal', 'Gold', 'Sage Green'].map((c) => (
              <button
                key={c}
                onClick={() => update({ color: filters.color === c ? '' : c })}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  filters.color === c
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
                    : 'border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-gold)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </FilterGroup>
      </div>
    </aside>
  )
}

function FilterGroup({ label, children, last }) {
  return (
    <div className={`${last ? '' : 'mb-5 border-b border-[var(--color-line)] pb-5'}`}>
      <p className="mb-3 text-xs font-medium text-[var(--color-ink)]">{label}</p>
      {children}
    </div>
  )
}
