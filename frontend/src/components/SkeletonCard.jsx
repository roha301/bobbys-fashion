export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white">
      <div className="aspect-[3/4] w-full shimmer bg-[var(--color-paper-dim)]" />
      <div className="space-y-2 p-4">
        <div className="h-2.5 w-1/3 shimmer rounded bg-[var(--color-paper-dim)]" />
        <div className="h-3.5 w-4/5 shimmer rounded bg-[var(--color-paper-dim)]" />
        <div className="h-3.5 w-1/2 shimmer rounded bg-[var(--color-paper-dim)]" />
        <div className="h-9 w-full shimmer rounded-full bg-[var(--color-paper-dim)] mt-3" />
      </div>
    </div>
  )
}
