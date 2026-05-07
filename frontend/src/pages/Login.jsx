import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'
import { FiDroplet, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Login() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await authService.login(form)
      login({ id: data.id, name: data.name, email: data.email, role: data.role }, data.token)
      toast.success(`${t('welcomeBack')}, ${data.name}!`)
      if (data.role === 'ADMIN') navigate('/admin')
      else navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || t('invalidCredentials')
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 w-full">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30">
            <FiDroplet className="text-white text-3xl" />
          </div>
          <h1 className="font-heading font-black text-3xl text-gray-900 dark:text-gray-100 transition-colors">{t('welcomeBack')}</h1>
          <p className="text-gray-500 dark:text-gray-400 transition-colors mt-2 text-sm">{t('signInDesc')}</p>
        </div>

        <div className="bg-white dark:bg-[#111b21] transition-colors rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="email">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  id="email" name="email" type="email" autoComplete="email" required
                  className="w-full bg-gray-50 dark:bg-[#202c33] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="password">
                {t('password')}
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  id="password" name="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" required
                  className="w-full bg-gray-50 dark:bg-[#202c33] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t('signIn')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            {t('noAccount')}{' '}
            <Link to="/add-donor" className="text-red-600 hover:text-red-800 font-semibold transition-colors">
              {t('registerHere')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
