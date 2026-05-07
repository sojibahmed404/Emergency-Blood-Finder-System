import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiActivity, FiSearch, FiHeart, FiUserPlus,
  FiShield, FiLogOut, FiDroplet
} from 'react-icons/fi'

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout, isLoggedIn } = useAuth()
  const location = useLocation()

  const navGroups = [
    {
      title: 'MAIN',
      links: [
        { to: '/', label: 'Home', icon: FiActivity },
        { to: '/dashboard', label: 'Dashboard', icon: FiActivity, auth: true },
      ]
    },
    {
      title: 'BLOOD SYSTEM',
      links: [
        { to: '/search', label: 'Find Donors', icon: FiSearch },
        { to: '/bloodbanks', label: 'Blood Banks', icon: FiHeart },
        { to: '/add-donor', label: 'Add Donor', icon: FiUserPlus },
      ]
    },
    {
      title: 'SYSTEM',
      links: [
        { to: '/admin', label: 'Admin Panel', icon: FiShield, role: 'ADMIN' },
      ]
    }
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-[#1e1e2d] flex flex-col z-50
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center gap-3 px-6 bg-[#1a1a27]">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <FiDroplet className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-wide">BloodFinder</h1>
            <p className="text-xs text-gray-400">Emergency System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-thin">
          {navGroups.map((group, idx) => {
            const visibleLinks = group.links.filter(link => {
              if (link.role && user?.role !== link.role) return false
              if (link.auth && !isLoggedIn) return false
              return true
            })

            if (visibleLinks.length === 0) return null

            return (
              <div key={idx}>
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.title}
                </p>
                <div className="space-y-1">
                  {visibleLinks.map(link => {
                    const Icon = link.icon
                    const active = location.pathname === link.to
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                          ${active 
                            ? 'bg-[#2a2a3c] text-white' 
                            : 'text-gray-400 hover:text-gray-200 hover:bg-[#2a2a3c]/50'
                          }`}
                      >
                        <Icon className={`text-lg ${active ? 'text-indigo-400' : 'text-gray-500'}`} />
                        {link.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Account Group */}
          <div>
            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              ACCOUNT
            </p>
            <div className="space-y-1">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <FiLogOut className="text-lg" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-[#2a2a3c]/50 transition-all"
                  >
                    <FiUserPlus className="text-lg" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-[#2a2a3c]/50 transition-all"
                  >
                    <FiShield className="text-lg" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
