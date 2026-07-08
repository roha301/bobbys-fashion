import { useEffect, useState } from 'react'
import { homeDecorApi } from '../api/homeDecorClient'

export function useHomeDecorProducts(filters = {}) {
  const [state, setState] = useState({ loading: true, error: null, data: [] })
  const key = JSON.stringify(filters)

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true }))

    homeDecorApi
      .getProducts(filters)
      .then((data) => {
        if (!cancelled) setState({ loading: false, error: null, data })
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ loading: false, error: err.message, data: [] })
        }
      })

    return () => {
      cancelled = true
    }
  }, [key])

  return state
}

export function useHomeDecorCategories() {
  const [state, setState] = useState({ loading: true, error: null, data: [] })
  useEffect(() => {
    let cancelled = false
    homeDecorApi
      .getCategories()
      .then((data) => {
        if (!cancelled) setState({ loading: false, error: null, data })
      })
      .catch((err) => {
        if (!cancelled) setState({ loading: false, error: err.message, data: [] })
      })
    return () => {
      cancelled = true
    }
  }, [])
  return state
}

export function useHomeDecorProduct(id) {
  const [state, setState] = useState({ loading: true, error: null, data: null })
  useEffect(() => {
    let cancelled = false
    setState({ loading: true, error: null, data: null })
    homeDecorApi
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

export function useHomeDecorBrandsAndStores() {
  const [brands, setBrands] = useState([])
  const [stores, setStores] = useState([])

  useEffect(() => {
    let cancelled = false
    Promise.all([
      homeDecorApi.getBrands().catch(() => []),
      homeDecorApi.getStores().catch(() => [])
    ]).then(([b, s]) => {
      if (cancelled) return
      setBrands(b)
      setStores(s)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { brands, stores }
}

export function useHomeDecorHomeData() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: { categories: [], trending: [], deals: [], featured: [] },
  })

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true }))

    homeDecorApi
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
