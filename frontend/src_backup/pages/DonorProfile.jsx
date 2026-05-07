import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { donorService } from '../services/donorService'
import { useAuth } from '../context/AuthContext'
import RequestModal from '../components/RequestModal'
import {
  FiArrowLeft, FiMapPin, FiPhone, FiCalendar,
  FiMail, FiCheckCircle, FiXCircle, FiDroplet,
  FiMessageCircle
} from 'react-icons/fi'

const BG_COLORS = {
  'A+': 'from-red-500 to-red-600',
  'A-': 'from-orange-500 to-orange-600',
  'B+': 'from-blue-500 to-blue-600',
  'B-': 'from-indigo-500 to-indigo-600',
  'AB+': 'from-purple-500 to-purple-600',
  'AB-': 'from-pink-500 to-pink-600',
  'O+': 'from-emerald-500 to-emerald-600',
  'O-': 'from-teal-500 to-teal-600',
}

export default function DonorProfile() {
  const { id } = useParams()
  const { isLoggedIn, isReceiver } = useAuth()
  const [donor,   setDonor]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [modal,   setModal]   = useState(false)

  useEffect(() => {
    donorService.getById(id)
      .then(setDonor)
      .catch(() => setError('Donor not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-3 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="max-w-xl mx-auto text-center py-20 px-4">
      <div className="text-6xl mb-4">😢</div>
      <h2 className="font-heading font-bold text-2xl text-gray-800 mb-2">Donor Not Found</h2>
      <Link to="/search" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl inline-flex items-center gap-2 mt-4 transition-colors">← Back to Search</Link>
    </div>
  )

  const gradClass = BG_COLORS[donor.bloodGroup] || 'from-gray-500 to-gray-600'

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link to="/search" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors mb-6 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
        <FiArrowLeft /> Back to Search
      </Link>

      {/* Profile card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm animate-slide-up">
        {/* Gradient banner */}
        <div className={`bg-gradient-to-br ${gradClass} p-8 sm:p-10 relative`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-white text-indigo-600
                            flex items-center justify-center text-5xl font-black shadow-lg">
              {donor.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="font-heading font-black text-3xl text-white">{donor.name}</h1>
              <p className="text-white/80 text-sm mt-1">{donor.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-4">
                <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                  {donor.bloodGroup} Blood Group
                </span>
                <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border ${
                  donor.availability ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30' : 'bg-red-500/20 text-red-100 border-red-500/30'
                }`}>
                  {donor.availability ? <FiCheckCircle /> : <FiXCircle />}
                  {donor.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-8 sm:p-10">
          <h2 className="font-heading font-bold text-xl text-gray-900 mb-6">Donor Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { icon: FiDroplet,  label: 'Blood Group',    value: donor.bloodGroup },
              { icon: FiMapPin,   label: 'Location',       value: donor.location || '—' },
              { icon: FiPhone,    label: 'Phone',          value: donor.phone    || '—' },
              { icon: FiCalendar, label: 'Last Donated',   value: donor.lastDonated || 'Not specified' },
              { icon: FiMail,     label: 'Email',          value: donor.email },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Icon className="text-indigo-500 text-lg" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Direct Contact Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {donor.phone && donor.phone !== '—' && (
              <>
                {/* Call Button */}
                <a href={`tel:${donor.phone}`} className="flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors border border-indigo-100">
                  <FiPhone className="text-lg" /> Call Now
                </a>
                
                {/* WhatsApp Button */}
                <a 
                  href={`https://wa.me/${
                    donor.phone.replace(/[^0-9+]/g, '').startsWith('01') && donor.phone.replace(/[^0-9+]/g, '').length === 11
                      ? '88' + donor.phone.replace(/[^0-9+]/g, '')
                      : donor.phone.replace(/[^0-9]/g, '')
                  }`} 
                  target="_blank" rel="noopener noreferrer" 
                  className="flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-100"
                >
                  <FiMessageCircle className="text-lg" /> WhatsApp
                </a>
              </>
            )}
            
            {/* Email / Gmail Button */}
            {donor.email && !donor.email.includes("manual_") && (
              <a 
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${donor.email}`} 
                target="_blank" rel="noopener noreferrer" 
                className="flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors border border-blue-100"
              >
                <FiMail className="text-lg" /> Gmail
              </a>
            )}
          </div>

          {/* Request button */}
          {isLoggedIn && isReceiver && donor.availability && (
            <button onClick={() => setModal(true)} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 text-lg">
              <FiDroplet /> Request Blood Donation
            </button>
          )}
          {!isLoggedIn && (
            <div className="text-center p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-sm text-indigo-800">
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 underline decoration-2 underline-offset-2">Sign in</Link>{' '}
              as a Receiver to send a formal blood request through the system.
            </div>
          )}
        </div>
      </div>

      {modal && <RequestModal donor={donor} onClose={() => setModal(false)} />}
    </div>
  )
}
