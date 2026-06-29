import { getToken } from './auth'

const BASE = '/api/v1'

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur serveur')
  return data
}

export const api = {
  post:  (path, body) => request('POST', path, body),
  get:   (path)       => request('GET', path),
  patch: (path, body) => request('PATCH', path, body),
}
