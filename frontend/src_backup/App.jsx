import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import ProtectedRoute  from './components/ProtectedRoute'
import Home            from './pages/Home'
import Login           from './pages/Login'
import Register        from './pages/Register'
import Dashboard       from './pages/Dashboard'
import SearchPage      from './pages/SearchPage'
import DonorProfile    from './pages/DonorProfile'
import AdminDashboard  from './pages/AdminDashboard'
import BloodBanksPage  from './pages/BloodBanksPage'
import AddDonor        from './pages/AddDonor'
import { useAuth }     from './context/AuthContext'

export default function App() {
  const { isLoggedIn } = useAuth()

  return (
    <DashboardLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/"            element={<Home />} />
        <Route path="/search"      element={<SearchPage />} />
        <Route path="/bloodbanks"  element={<BloodBanksPage />} />
        <Route path="/add-donor"   element={<AddDonor />} />
        <Route path="/donor/:id"   element={<DonorProfile />} />
        
        {/* Auth pages — redirect if already logged in */}
        <Route path="/login"    element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-8xl font-heading font-black text-indigo-500/20 mb-4">404</div>
            <h2 className="font-heading font-bold text-2xl text-gray-800 mb-2">Page Not Found</h2>
            <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
            <a href="/" className="px-6 py-2.5 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors">← Go Home</a>
          </div>
        } />
      </Routes>
    </DashboardLayout>
  )
}
