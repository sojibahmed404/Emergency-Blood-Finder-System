import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'
import { FiDroplet, FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'DONOR',
    bloodGroup: '', location: '', phone: ''
  })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      const data = await authService.register(payload)
      login({ id: data.id, name: data.name, email: data.email, role: data.role }, data.token)
      toast.success(`Welcome, ${data.name}! Account created.`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
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
          <h1 className="font-heading font-black text-3xl text-gray-900 dark:text-gray-100 transition-colors">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 transition-colors mt-2 text-sm">Join the BloodFinder community</p>
        </div>

        <div className="bg-white dark:bg-[#111b21] transition-colors rounded-3xl p-8 border border-gray-200 dark:border-gray-800 transition-colors shadow-sm">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Default Role (Hidden) */}
          <input type="hidden" name="role" value="DONOR" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors uppercase tracking-wider mb-1.5" htmlFor="name">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors text-lg" />
                <input
                  id="name" name="name" type="text" required
                  className="w-full bg-gray-50 dark:bg-[#202c33] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-800 dark:text-gray-200 transition-colors rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="Your full name"
                  value={form.name} onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors uppercase tracking-wider mb-1.5" htmlFor="email">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors text-lg" />
                <input
                  id="email" name="email" type="email" required
                  className="w-full bg-gray-50 dark:bg-[#202c33] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-800 dark:text-gray-200 transition-colors rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors uppercase tracking-wider mb-1.5" htmlFor="password">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors text-lg" />
                <input
                  id="password" name="password"
                  type={showPw ? 'text' : 'password'} required
                  className="w-full bg-gray-50 dark:bg-[#202c33] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-800 dark:text-gray-200 transition-colors rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange}
                />
                <button type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-600"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors text-lg" />
                <input
                  id="confirmPassword" name="confirmPassword"
                  type={showPw ? 'text' : 'password'} required
                  className="w-full bg-gray-50 dark:bg-[#202c33] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-800 dark:text-gray-200 transition-colors rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="Repeat your password"
                  value={form.confirmPassword} onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 transition-colors">
              <p className="text-sm font-bold text-red-600">Donor Information</p>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors uppercase tracking-wider mb-1.5">Blood Group *</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-[#202c33] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-800 dark:text-gray-200 transition-colors rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                   <option value="">Select blood group</option>
                   {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                     <option key={bg} value={bg}>{bg}</option>
                   ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors uppercase tracking-wider mb-1.5">Location</label>
                <input name="location" value={form.location} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#202c33] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-800 dark:text-gray-200 transition-colors rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="e.g. Sirajganj" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors uppercase tracking-wider mb-1.5">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#202c33] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-800 dark:text-gray-200 transition-colors rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="Phone number" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center">
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Create Account'
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 transition-colors mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-red-600 hover:text-red-800 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

