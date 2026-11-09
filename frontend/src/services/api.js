import axios from 'axios'

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const api = axios.create({
  baseURL: supabaseUrl ? `${supabaseUrl}/functions/v1/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
})

/* Attach JWT token from localStorage to every request */
api.interceptors.request.use((config) => {
  if ((!supabaseUrl || !supabaseAnonKey) && !isLocal) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.')
  }
  if (supabaseUrl && !supabaseAnonKey) {
    throw new Error('Set VITE_SUPABASE_ANON_KEY to call the Supabase Edge Function.')
  }
  if (supabaseAnonKey) {
    config.headers.apikey = supabaseAnonKey
  }
  const token = localStorage.getItem('bf_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* Handle 401 globally */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bf_token')
      localStorage.removeItem('bf_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
