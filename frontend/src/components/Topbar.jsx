import { useLocation, useNavigate, Link } from 'react-router-dom'
import { FiMenu, FiBell, FiLogOut, FiLogIn, FiUser, FiChevronDown } from 'react-icons/fi'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Topbar({ onMenuClick }) {
  const { user, isLoggedIn, logout } = useAuth()
  const { lang, switchLang, t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

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

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

  const handleLanguageChange = (newLang) => {
    switchLang(newLang)
    setLangOpen(false)
  }

  return (
    <header className="h-16 bg-gradient-to-r from-red-700 to-red-600 dark:from-[#202c33] dark:to-[#202c33] dark:border-b dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 shadow-md z-10 transition-colors duration-300">
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

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications */}
        <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors relative">
          <FiBell className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border-2 border-[#5a67d8]"></span>
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button 
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
          >
            <span className="uppercase">{lang}</span>
            <FiChevronDown className={`text-sm transition-transform ${langOpen ? 'rotate-180' : ''}`} />
          </button>
          {langOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-red-800 rounded-lg shadow-lg border border-white/20">
              <button 
                onClick={() => handleLanguageChange('en')}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${lang === 'en' ? 'bg-red-700 text-white font-semibold' : 'text-white/80 hover:bg-red-700'}`}
              >
                English
              </button>
              <button 
                onClick={() => handleLanguageChange('bn')}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${lang === 'bn' ? 'bg-red-700 text-white font-semibold' : 'text-white/80 hover:bg-red-700'}`}
              >
                বাংলা
              </button>
            </div>
          )}
        </div>

        {/* User Profile / Login */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 pl-3 pr-2 py-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer border-l border-white/20"
            >
              <div className="hidden md:block text-right">
                <p className="text-white text-sm font-semibold leading-none">{user?.name || 'User'}</p>
                <p className="text-white/70 text-xs mt-1 leading-none">{user?.role === 'ADMIN' ? 'Admin' : 'Member'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold border border-white/30">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-red-800 rounded-lg shadow-lg border border-white/20 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/20">
                  <p className="text-white font-semibold text-sm">{user?.name}</p>
                  <p className="text-white/70 text-xs">{user?.role === 'ADMIN' ? 'Admin' : 'Member'}</p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-white/80 hover:bg-red-700 transition-colors text-sm"
                >
                  <FiUser className="text-base" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-red-200 hover:bg-red-700 transition-colors text-sm border-t border-white/20"
                >
                  <FiLogOut className="text-base" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-3 border-l border-white/20">
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              <FiLogIn className="text-base" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
