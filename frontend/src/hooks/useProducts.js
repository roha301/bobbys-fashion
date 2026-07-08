import { useEffect, useState, useMemo } from 'react'
import { api } from '../api/client'
import { PRODUCTS, STORES } from '../data/mockData'

/**
 * Loads products from the live backend.
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
      .catch((err) => {
        if (!cancelled) {
          setState({ loading: false, error: err.message, source: 'live', data: [] })
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
  const [state, setState] = useState({ loading: true, error: null, source: null, data: [] })
  useEffect(() => {
    let cancelled = false
    api
      .getCategories()
      .then((data) => {
        if (!cancelled) setState({ loading: false, error: null, source: 'live', data })
      })
      .catch((err) => {
        if (!cancelled) setState({ loading: false, error: err.message, source: 'live', data: [] })
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
      .catch((err) => {
        if (!cancelled) setState({ loading: false, error: 'not-found', data: null })
      })
    return () => {
      cancelled = true
    }
  }, [id])
  return state
}

export function useBrandsAndStores() {
  const [brands, setBrands] = useState([])
  const [stores, setStores] = useState([])

  useEffect(() => {
    let cancelled = false
    Promise.all([
      api.getBrands().catch(() => []),
      api.getStores().catch(() => [])
    ]).then(([b, s]) => {
      if (cancelled) return
      const fallbackBrands = Array.from(new Set(PRODUCTS.map((p) => p.brand))).filter(Boolean)
      setBrands(b.length ? b : fallbackBrands)
      setStores(s.length ? s : STORES)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { brands, stores }
}

export function useHomeData() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: { categories: [], trending: [], deals: [], featured: [] },
  })

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true }))

    api
      .getHomeData()
      .then((data) => {
        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            data: {
              categories: data.categories || [],
              trending: data.trending || [],
              deals: data.deals || [],
              featured: data.featured || [],
            },
          })
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            loading: false,
            error: err.message,
            data: { categories: [], trending: [], deals: [], featured: [] },
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}

