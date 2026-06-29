import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

export function useFeed() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFeed = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get('/items')
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

  return { items, loading, error, refresh: fetchFeed }
}
