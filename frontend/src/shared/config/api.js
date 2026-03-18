const rawApiUrl = import.meta.env.VITE_API_URL?.trim() || 'http://127.0.0.1:8080/api'

export const API_URL = rawApiUrl.replace(/\/+$/, '')
export const AUTH_STORAGE_KEY = 'loadingtestvmapp.auth'
