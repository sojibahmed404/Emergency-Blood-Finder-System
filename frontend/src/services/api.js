import axios from 'axios'

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

const api = axios.create({
  baseURL: isLocal ? '/api' : 'https://blood-finder-backend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
})

/* Attach JWT token from localStorage to every request */
api.interceptors.request.use((config) => {
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
