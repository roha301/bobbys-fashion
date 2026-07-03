const STORE_INITIALS = {
  amazon: 'A',
  myntra: 'M',
  ajio: 'AJ',
  flipkart: 'F',
  meesho: 'ME',
  nykaa: 'N',
}

export default function StoreBadge({ store }) {
  const key = (store || '').toLowerCase().split(' ')[0]
  const initial = STORE_INITIALS[key] || (store || '?').charAt(0)
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white/70 px-2.5 py-1 text-[10px] font-medium tracking-wide text-[var(--color-ink-soft)]">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-ink)] text-[9px] font-semibold text-white">
        {initial}
      </span>
      {store}
    </span>
  )
}
