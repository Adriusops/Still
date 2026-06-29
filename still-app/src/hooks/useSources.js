import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

export function useSources() {
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSources = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get('/sources')
      setSources(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSources()
  }, [fetchSources])

  const addSource = useCallback(async (url) => {
    const source = await api.post('/sources', { source: { url } })
    setSources(prev => [...prev, source])
    return source
  }, [])

  const updateSource = useCallback(async (id, attrs) => {
    const updated = await api.patch(`/sources/${id}`, attrs)
    setSources(prev => prev.map(s => s.id === id ? updated : s))
    return updated
  }, [])

  return { sources, loading, error, addSource, updateSource, refresh: fetchSources }
}
