import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import {
  FiActivity, FiSearch, FiHeart, FiUserPlus,
  FiShield, FiLogOut, FiDroplet, FiSettings, FiMessageSquare, FiInfo
} from 'react-icons/fi'

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout, isLoggedIn } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()

  const navGroups = [
    {
      title: 'MAIN',
      links: [
        { to: '/', label: t('home'), icon: FiActivity },
        { to: '/dashboard', label: t('dashboard'), icon: FiActivity, auth: true },
      ]
    },
    {
      title: 'BLOOD SYSTEM',
      links: [
        { to: '/search', label: t('findDonors'), icon: FiSearch },
        { to: '/bloodbanks', label: t('bloodBanks'), icon: FiHeart },
      ]
    },
    {
      title: 'SYSTEM',
      links: [
        { to: '/admin', label: t('adminPanel'), icon: FiShield, role: 'ADMIN' },
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
        fixed top-0 left-0 h-screen w-64 bg-red-950 dark:bg-[#111b21] dark:border-r dark:border-gray-800 flex flex-col z-50
        transition-all duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center gap-3 px-6 bg-[#1a1a27]">
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
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
                            ? 'bg-red-900 text-white' 
                            : 'text-gray-400 hover:text-gray-200 hover:bg-red-900/50'
                          }`}
                      >
                        <Icon className={`text-lg ${active ? 'text-red-400' : 'text-gray-500'}`} />
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
              {!isLoggedIn && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-red-900/50 transition-all"
                  >
                    <FiUserPlus className="text-lg" />
                    {t('login')}
                  </Link>
                  <Link
                    to="/add-donor"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-red-900/50 transition-all"
                  >
                    <FiShield className="text-lg" />
                    {t('donorRegister')}
                  </Link>
                </>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-1">
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${location.pathname === '/settings'
                    ? 'bg-red-900 text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-red-900/50'
                  }`}
              >
                <FiSettings className={`text-lg ${location.pathname === '/settings' ? 'text-red-400' : 'text-gray-500'}`} />
                {t('settings')}
              </Link>

              <Link
                to="/help"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${location.pathname === '/help'
                    ? 'bg-red-900 text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-red-900/50'
                  }`}
              >
                <FiMessageSquare className={`text-lg ${location.pathname === '/help' ? 'text-red-400' : 'text-gray-500'}`} />
                {t('helpSupport')}
              </Link>

              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${location.pathname === '/about'
                    ? 'bg-red-900 text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-red-900/50'
                  }`}
              >
                <FiInfo className={`text-lg ${location.pathname === '/about' ? 'text-red-400' : 'text-gray-500'}`} />
                {t('aboutApp')}
              </Link>

              {isLoggedIn && (
                <button
                  onClick={() => { logout(); setIsOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <FiLogOut className="text-lg" />
                  {t('logout')}
                </button>
              )}
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
