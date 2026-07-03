import { useEffect, useState, useMemo } from 'react'
import { api } from '../api/client'
import { PRODUCTS, CATEGORIES } from '../data/mockData'

/**
 * Loads products from the live backend when available, and quietly falls
 * back to local mock data otherwise (e.g. while the FastAPI server isn't
 * running during frontend-only preview).
 */
export function useProducts(filters = {}) {
  const [state, setState] = useState({ loading: true, error: null, source: null, data: [] })
  const key = JSON.stringify(filters)

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true }))

    api
      .getProducts(filters)
      .then((data) => {
        if (!cancelled) setState({ loading: false, error: null, source: 'live', data })
      })
      .catch(() => {
        if (!cancelled) {
          const filtered = applyLocalFilters(PRODUCTS, filters)
          setState({ loading: false, error: null, source: 'mock', data: filtered })
        }
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}

export function useCategories() {
  const [state, setState] = useState({ loading: true, source: null, data: [] })
  useEffect(() => {
    let cancelled = false
    api
      .getCategories()
      .then((data) => {
        if (!cancelled) setState({ loading: false, source: 'live', data })
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, source: 'mock', data: CATEGORIES })
      })
    return () => {
      cancelled = true
    }
  }, [])
  return state
}

export function useProduct(id) {
  const [state, setState] = useState({ loading: true, error: null, data: null })
  useEffect(() => {
    let cancelled = false
    setState({ loading: true, error: null, data: null })
    api
      .getProduct(id)
      .then((data) => {
        if (!cancelled) setState({ loading: false, error: null, data })
      })
      .catch(() => {
        const found = PRODUCTS.find((p) => String(p.id) === String(id))
        if (!cancelled) setState({ loading: false, error: found ? null : 'not-found', data: found || null })
      })
    return () => {
      cancelled = true
    }
  }, [id])
  return state
}

function applyLocalFilters(products, filters) {
  let result = [...products]
  if (filters.category) result = result.filter((p) => p.category === filters.category)
  if (filters.featured) result = result.filter((p) => p.featured)
  if (filters.trending) result = result.filter((p) => p.trending)
  if (filters.deal) result = result.filter((p) => p.deal)
  if (filters.store) result = result.filter((p) => p.store.toLowerCase() === String(filters.store).toLowerCase())
  if (filters.brand) result = result.filter((p) => p.brand.toLowerCase() === String(filters.brand).toLowerCase())
  if (filters.minRating) result = result.filter((p) => p.rating >= Number(filters.minRating))
  if (filters.q) {
    const q = String(filters.q).toLowerCase()
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
  }
  if (filters.sort === 'price_low') result.sort((a, b) => a.price - b.price)
  if (filters.sort === 'price_high') result.sort((a, b) => b.price - a.price)
  if (filters.sort === 'popular') result.sort((a, b) => b.rating - a.rating)
  if (filters.sort === 'newest') result.sort((a, b) => b.id - a.id)
  return result
}

export function useBrandsAndStores() {
  return useMemo(() => {
    const brands = [...new Set(PRODUCTS.map((p) => p.brand))]
    const stores = [...new Set(PRODUCTS.map((p) => p.store))]
    return { brands, stores }
  }, [])
}
