import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { donorService } from '../services/donorService'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import RequestModal from '../components/RequestModal'
import {
  FiArrowLeft, FiMapPin, FiPhone, FiCalendar,
  FiMail, FiCheckCircle, FiXCircle, FiDroplet,
  FiMessageCircle, FiLock, FiUser, FiHeart, FiStar
} from 'react-icons/fi'

const BG_COLORS = {
  'A+':  'from-red-500 to-rose-600',
  'A-':  'from-orange-500 to-amber-600',
  'B+':  'from-blue-500 to-indigo-600',
  'B-':  'from-violet-500 to-purple-600',
  'AB+': 'from-purple-500 to-fuchsia-600',
  'AB-': 'from-pink-500 to-rose-600',
  'O+':  'from-emerald-500 to-teal-600',
  'O-':  'from-teal-500 to-cyan-600',
}

export default function DonorProfile() {
  const { id } = useParams()
  const { isLoggedIn, isReceiver } = useAuth()
  const { lang, t } = useLanguage()
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
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading donor profile...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="max-w-xl mx-auto text-center py-20 px-4">
      <div className="text-6xl mb-4">😢</div>
      <h2 className="font-heading font-bold text-2xl text-gray-800 dark:text-gray-200 mb-2">Donor Not Found</h2>
      <Link to="/search" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl inline-flex items-center gap-2 mt-4 transition-colors">← Back to Search</Link>
    </div>
  )

  const gradClass = BG_COLORS[donor.bloodGroup] || 'from-gray-500 to-gray-600'

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link to="/search" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors mb-6 bg-white dark:bg-[#111b21] border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-xl shadow-sm">
        <FiArrowLeft /> {lang === 'bn' ? 'সার্চে ফিরুন' : 'Back to Search'}
      </Link>

      {/* Profile card */}
      <div className="bg-white dark:bg-[#111b21] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm animate-slide-up">

        {/* ── Gradient Banner ────────────────────────────── */}
        <div className={`bg-gradient-to-br ${gradClass} relative overflow-hidden`}>
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-black/10" />
          <FiHeart className="absolute bottom-4 right-8 text-white/10 text-8xl" />

          <div className="relative p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center text-5xl font-black text-white shadow-2xl">
                  {donor.name?.charAt(0).toUpperCase()}
                </div>
                {/* Blood group badge on avatar */}
                <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
                  <span className="text-xs font-black text-red-600">{donor.bloodGroup}</span>
                </div>
              </div>

              {/* Name & badges */}
              <div className="flex-1 text-center sm:text-left pb-2">
                <h1 className="font-heading font-black text-3xl sm:text-4xl text-white drop-shadow-sm">
                  {donor.name}
                </h1>

                {/* Show location subtitle (NOT email) */}
                {donor.location && (
                  <p className="text-white/75 text-sm mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                    <FiMapPin className="text-xs" /> {donor.location}
                  </p>
                )}

                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-4">
                  <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold border border-white/25">
                    🩸 {donor.bloodGroup} Blood Group
                  </span>
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                    donor.availability
                      ? 'bg-emerald-500/25 text-emerald-50 border-emerald-400/40'
                      : 'bg-red-900/30 text-red-100 border-red-400/30'
                  }`}>
                    {donor.availability ? <FiCheckCircle /> : <FiXCircle />}
                    {donor.availability
                      ? (lang === 'bn' ? 'পাওয়া যাচ্ছে' : 'Available')
                      : (lang === 'bn' ? 'অনুপলব্ধ' : 'Unavailable')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Details Body ───────────────────────────────── */}
        <div className="p-6 sm:p-8">

          {/* Info grid */}
          <h2 className="font-heading font-bold text-base uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            {lang === 'bn' ? 'ডোনারের তথ্য' : 'Donor Information'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {[
              {
                icon: FiDroplet,
                label: t('bloodGroup'),
                value: donor.bloodGroup,
                locked: false,
              },
              {
                icon: FiMapPin,
                label: t('location'),
                value: donor.location || '—',
                locked: false,
              },
              {
                icon: FiPhone,
                label: t('phone'),
                value: isLoggedIn ? (donor.phone || '—') : null,
                locked: !isLoggedIn,
              },
              {
                icon: FiCalendar,
                label: t('lastDonated'),
                value: donor.lastDonated || (lang === 'bn' ? 'উল্লেখ নেই' : 'Not specified'),
                locked: false,
              },
              {
                icon: FiMail,
                label: t('emailAddress'),
                value: isLoggedIn ? donor.email : null,
                locked: !isLoggedIn,
              },
            ].map(({ icon: Icon, label, value, locked }) => (
              <div key={label} className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${
                locked
                  ? 'bg-gray-50/70 dark:bg-[#1a2329] border-gray-100 dark:border-gray-800/60'
                  : 'bg-gray-50 dark:bg-[#202c33] border-gray-100 dark:border-gray-800'
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  locked
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'bg-white dark:bg-[#111b21]'
                }`}>
                  {locked
                    ? <FiLock className="text-gray-400 text-lg" />
                    : <Icon className="text-red-500 text-lg" />
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
                  {locked ? (
                    <Link to="/login" className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors mt-0.5 flex items-center gap-1">
                      <FiLock className="text-[10px]" />
                      {lang === 'bn' ? 'লগইন করুন দেখতে' : 'Login to view'}
                    </Link>
                  ) : (
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5 truncate">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Direct Contact ──────────────────────────── */}
          <div className="mb-6">
            <h2 className="font-heading font-bold text-base uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
              {t('directContact')}
            </h2>

            {isLoggedIn ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {donor.phone && donor.phone !== '—' && (
                  <>
                    <a href={`tel:${donor.phone}`}
                      className="py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5">
                      <FiPhone /> {t('callNow')}
                    </a>
                    <a
                      href={`https://wa.me/${
                        donor.phone.replace(/[^0-9+]/g, '').startsWith('01') && donor.phone.replace(/[^0-9+]/g, '').length === 11
                          ? '88' + donor.phone.replace(/[^0-9+]/g, '')
                          : donor.phone.replace(/[^0-9]/g, '')
                      }`}
                      target="_blank" rel="noopener noreferrer"
                      className="py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5">
                      <FiMessageCircle /> {t('whatsapp')}
                    </a>
                  </>
                )}
                {donor.email && !donor.email.includes('manual_') && (
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${donor.email}`}
                    target="_blank" rel="noopener noreferrer"
                    className="py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5">
                    <FiMail /> {t('gmail')}
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                  <FiLock className="text-red-500 text-2xl" />
                </div>
                <h4 className="text-gray-800 dark:text-gray-200 font-bold mb-1.5">
                  {lang === 'bn' ? 'লগইন প্রয়োজন' : 'Login Required'}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs mx-auto">
                  {lang === 'bn'
                    ? 'ডোনারের সাথে সরাসরি যোগাযোগ করতে লগইন করুন।'
                    : 'Please login to contact this donor directly via call, WhatsApp or email.'}
                </p>
                <Link to="/login" className="inline-flex items-center gap-2 px-7 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  <FiUser /> {t('login')}
                </Link>
              </div>
            )}
          </div>

          {/* ── Request Button (Receiver only) ─────────── */}
          {isLoggedIn && isReceiver && donor.availability && (
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setModal(true)}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 text-lg hover:-translate-y-0.5 hover:shadow-xl">
                <FiDroplet /> {lang === 'bn' ? 'রক্তদান রিকোয়েস্ট করুন' : 'Request Blood Donation'}
              </button>
            </div>
          )}

          {!isLoggedIn && (
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
              <Link to="/login" className="font-bold text-red-600 hover:text-red-700 underline decoration-2 underline-offset-2">
                {lang === 'bn' ? 'লগইন করুন' : 'Sign in'}
              </Link>{' '}
              {lang === 'bn' ? 'রিভার হিসেবে রিকোয়েস্ট পাঠাতে।' : 'as a Receiver to send a formal blood request.'}
            </div>
          )}
        </div>
      </div>

      {modal && <RequestModal donor={donor} onClose={() => setModal(false)} />}
    </div>
  )
}
