import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'

export default function TrendingCarousel({ products }) {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div ref={trackRef} className="gold-scroll flex gap-5 overflow-x-auto pb-4 scroll-smooth">
        {products.map((p, i) => (
          <div key={p.id} className="w-[240px] flex-shrink-0 sm:w-[260px]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className="glass absolute -left-3 top-1/3 hidden h-10 w-10 items-center justify-center rounded-full shadow-md sm:flex"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="glass absolute -right-3 top-1/3 hidden h-10 w-10 items-center justify-center rounded-full shadow-md sm:flex"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
