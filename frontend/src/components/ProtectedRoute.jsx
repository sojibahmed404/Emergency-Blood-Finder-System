import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute — redirects to /login if not authenticated.
 * If `role` is provided, also checks the user's role.
 */
export default function ProtectedRoute({ children, role }) {
  const { isLoggedIn, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-3 border-gray-700 border-t-blood-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/dashboard" replace />

  return children
}

