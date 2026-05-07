import { useLocation } from 'react-router-dom'
import { FiMenu, FiBell } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth()
  const location = useLocation()

  // Derive page title from path
  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path === '/admin') return 'Admin Panel'
    if (path === '/search') return 'Find Donors'
    if (path === '/bloodbanks') return 'Blood Banks'
    if (path === '/add-donor') return 'Add Donor'
    return 'BloodFinder System'
  }

  return (
    <header className="h-16 bg-[#5a67d8] flex items-center justify-between px-4 sm:px-6 shadow-md z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg lg:hidden transition-colors"
        >
          <FiMenu className="text-xl" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">BF</span>
          </div>
          <h2 className="text-white font-semibold text-lg">{getPageTitle()}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors relative">
          <FiBell className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border-2 border-[#5a67d8]"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/20">
          <div className="hidden md:block text-right">
            <p className="text-white text-sm font-semibold leading-none">{user?.name || 'User'}</p>
            <p className="text-white/70 text-xs mt-1 leading-none">{user?.role === 'ADMIN' ? 'Admin' : 'Member'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold border border-white/30">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}
