import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'
import {
  FiUserPlus, FiMapPin, FiPhone, FiDroplet,
  FiMail, FiLock, FiEye, FiEyeOff, FiUser
} from 'react-icons/fi'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function AddDonor() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodGroup: '',
    location: '',
    phone: '',
    role: 'DONOR'
  })

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setError(t('passwordMismatch'))
      return
    }
    if (form.password.length < 6) {
      setError(t('passwordTooShort'))
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      const data = await authService.register(payload)
      login({ id: data.id, name: data.name, email: data.email, role: data.role }, data.token)
      toast.success(`${t('welcomeBack')}, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || t('registrationFailed')
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30">
          <FiUserPlus className="text-white text-3xl" />
        </div>
        <h1 className="text-3xl font-heading font-black text-gray-900 dark:text-gray-100 transition-colors">
          {t('joinAsDonor')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 transition-colors mt-2 text-sm">
          {t('joinDesc')}
        </p>
      </div>

      <div className="bg-white dark:bg-[#111b21] transition-colors rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="name">
              {t('fullName')} *
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                id="name" name="name" type="text" required
                className="w-full bg-gray-50 dark:bg-[#202c33] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                placeholder={t('fullNamePlaceholder')}
                value={form.name} onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="email">
              {t('emailAddress')} *
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                id="email" name="email" type="email" required
                className="w-full bg-gray-50 dark:bg-[#202c33] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                placeholder={t('emailPlaceholder')}
                value={form.email} onChange={handleChange}
              />
            </div>
          </div>

          {/* Password row */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="password">
                {t('password')} *
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  id="password" name="password" type={showPass ? 'text' : 'password'} required
                  className="w-full bg-gray-50 dark:bg-[#202c33] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder={t('passwordPlaceholder')}
                  value={form.password} onChange={handleChange}
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPass(v => !v)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">
                {t('confirmPassword')} *
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} required
                  className="w-full bg-gray-50 dark:bg-[#202c33] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder={t('confirmPasswordPlaceholder')}
                  value={form.confirmPassword} onChange={handleChange}
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Blood Group + Phone */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="bloodGroup">
                {t('bloodGroup')} *
              </label>
              <div className="relative">
                <FiDroplet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                <select
                  id="bloodGroup" name="bloodGroup" required
                  className="w-full bg-gray-50 dark:bg-[#202c33] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  value={form.bloodGroup} onChange={handleChange}
                >
                  <option value="">{t('selectBloodGroup')}</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="phone">
                {t('phoneNumber')} *
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  id="phone" name="phone" type="text" required
                  className="w-full bg-gray-50 dark:bg-[#202c33] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="01XXXXXXXXX"
                  value={form.phone} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5" htmlFor="location">
              {t('area')} *
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                id="location" name="location" type="text" required
                className="w-full bg-gray-50 dark:bg-[#202c33] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                placeholder={t('areaPlaceholder')}
                value={form.location} onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-red-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiUserPlus />
                {t('registerBtn')}
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            {t('alreadyAccount')}{' '}
            <Link to="/login" className="text-red-600 hover:text-red-800 font-semibold transition-colors">
              {t('loginHere')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
