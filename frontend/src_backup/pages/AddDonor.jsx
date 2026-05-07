import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { donorService } from '../services/donorService'
import toast from 'react-hot-toast'
import { FiUserPlus, FiMapPin, FiPhone, FiDroplet } from 'react-icons/fi'

export default function AddDonor() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    bloodGroup: '',
    location: '',
    phone: ''
  })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await donorService.quickAdd(form)
      toast.success('Donor added successfully!')
      navigate('/search') // Redirect to search to view the new donor
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add donor. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-black text-gray-900 mb-2 flex items-center gap-3">
          <FiUserPlus className="text-indigo-600" /> Quick Add Donor
        </h1>
        <p className="text-gray-500">Add a donor manually without full account registration.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="name">Donor Name *</label>
              <div className="relative">
                <FiUserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  id="name" name="name" type="text" required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="Full name"
                  value={form.name} onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="email">Email Address (Optional)</label>
              <div className="relative">
                <FiDroplet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  id="email" name="email" type="email"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="Email address"
                  value={form.email} onChange={handleChange}
                />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="bloodGroup">Blood Group *</label>
              <select 
                id="bloodGroup" name="bloodGroup" required
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" value={form.bloodGroup} onChange={handleChange}
              >
                <option value="">Select blood group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="location">Location *</label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  id="location" name="location" type="text" required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="e.g. Dhaka"
                  value={form.location} onChange={handleChange}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5" htmlFor="phone">Phone Number *</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  id="phone" name="phone" type="text" required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="01XXXXXXXXX"
                  value={form.phone} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center">
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Save Donor Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
