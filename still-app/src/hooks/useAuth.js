import { useState, useCallback } from 'react'
import { setToken, clearToken, isAuthenticated } from '../services/auth'
import { api } from '../services/api'

function getUserFromSession() {
  try {
    const raw = sessionStorage.getItem('still_user')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveUser(u) { sessionStorage.setItem('still_user', JSON.stringify(u)) }
function clearUser() { sessionStorage.removeItem('still_user') }

export function useAuth() {
  const [user, setUser] = useState(getUserFromSession)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.post('/login', { email, password })
      setToken(data.token)
      const u = { ...(data.user || {}), email }
      saveUser(u)
      setUser(u)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      await api.post('/users', { user: { email, password } })
      const data = await api.post('/login', { email, password })
      setToken(data.token)
      const u = { ...(data.user || {}), email }
      saveUser(u)
      setUser(u)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearToken()
    clearUser()
    setUser(null)
  }, [])

  return { user, loading, error, login, register, logout, isAuthenticated: isAuthenticated() }
}
