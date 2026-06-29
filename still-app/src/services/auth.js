const TOKEN_KEY = 'still_token'

export function setToken(t) { sessionStorage.setItem(TOKEN_KEY, t) }
export function getToken() { return sessionStorage.getItem(TOKEN_KEY) }
export function clearToken() { sessionStorage.removeItem(TOKEN_KEY) }
export function isAuthenticated() { return getToken() !== null }
