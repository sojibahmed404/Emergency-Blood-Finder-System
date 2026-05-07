import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  /* Rehydrate from localStorage on mount */
  useEffect(() => {
    const savedToken = localStorage.getItem('bf_token')
    const savedUser  = localStorage.getItem('bf_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  function login(userData, jwtToken) {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('bf_token', jwtToken)
    localStorage.setItem('bf_user', JSON.stringify(userData))
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('bf_token')
    localStorage.removeItem('bf_user')
  }

  const isLoggedIn = !!token
  const isAdmin    = user?.role === 'ADMIN'
  const isDonor    = user?.role === 'DONOR'
  const isReceiver = user?.role === 'RECEIVER'

  return (
    <AuthContext.Provider value={{ user, token, loading, isLoggedIn, isAdmin, isDonor, isReceiver, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
