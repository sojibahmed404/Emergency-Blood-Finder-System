import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiDroplet, FiHome, FiSearch, FiUsers, FiActivity,
  FiLogIn, FiLogOut, FiUser, FiShield, FiMenu, FiX,
  FiHeart, FiUserPlus
} from 'react-icons/fi'

const navLinks = [
  { to: '/',           label: 'Home',        icon: FiHome,     public: true },
  { to: '/search',     label: 'Find Donors', icon: FiSearch,   public: true },
  { to: '/bloodbanks', label: 'Blood Banks', icon: FiHeart,    public: true },
  { to: '/add-donor',  label: 'Add Donor',   icon: FiUserPlus, public: true },
  { to: '/dashboard',  label: 'Dashboard',   icon: FiActivity, auth: true },
  { to: '/admin',      label: 'Admin',       icon: FiShield,   role: 'ADMIN' },
]

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
    setOpen(false)
  }

  const visibleLinks = navLinks.filter(link => {
    if (link.role) return isLoggedIn && user?.role === link.role
    if (link.auth) return isLoggedIn
    return true
  })

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blood-600 to-blood-800
                            flex items-center justify-center shadow-lg shadow-blood-900/50
                            group-hover:shadow-blood-700/50 transition-all duration-300">
              <FiDroplet className="text-white text-lg" />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-white text-lg leading-none">BloodFinder</span>
              <p className="text-xs text-blood-400 leading-none font-medium">Emergency System</p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map(link => {
              const Icon = link.icon
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${active
                      ? 'bg-blood-900/50 text-blood-400 border border-blood-800/50'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                    }`}
                >
                  <Icon className="text-base" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/60
                                border border-gray-700/50">
                  <div className="w-6 h-6 rounded-full bg-blood-700 flex items-center justify-center">
                    <FiUser className="text-white text-xs" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-200 leading-none">{user?.name?.split(' ')[0]}</p>
                    <p className="text-xs text-blood-400 leading-none mt-0.5">{user?.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400
                             hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all">
                  <FiLogOut /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <FiLogIn /> Login
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-gray-950/95 backdrop-blur-xl
                        animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {visibleLinks.map(link => {
              const Icon = link.icon
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${active
                      ? 'bg-blood-900/50 text-blood-400 border border-blood-800/50'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                    }`}
                >
                  <Icon className="text-base" />
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-3 border-t border-white/5">
              {isLoggedIn ? (
                <button onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400
                             hover:bg-red-950/20 rounded-xl transition-all">
                  <FiLogOut /> Logout
                </button>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 rounded-xl">
                    <FiLogIn /> Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full justify-center text-sm">
                    Register as Donor/Receiver
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
