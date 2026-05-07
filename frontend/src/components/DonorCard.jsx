import { Link } from 'react-router-dom'
import { FiPhone, FiMapPin, FiCalendar, FiCheckCircle, FiXCircle, FiMail, FiMessageSquare } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const BG_COLORS = {
  'A+': 'bg-red-100 text-red-700 border-red-200',
  'A-': 'bg-orange-100 text-orange-700 border-orange-200',
  'B+': 'bg-blue-100 text-blue-700 border-blue-200',
  'B-': 'bg-red-100 text-red-700 border-red-200',
  'AB+': 'bg-purple-100 text-purple-700 border-purple-200',
  'AB-': 'bg-pink-100 text-pink-700 border-pink-200',
  'O+': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'O-': 'bg-teal-100 text-teal-700 border-teal-200',
}

export default function DonorCard({ donor, onRequest }) {
  const { isLoggedIn } = useAuth()
  const bgClass = BG_COLORS[donor.bloodGroup] || 'bg-gray-100 text-gray-700 border-gray-200 dark:border-gray-800 transition-colors'

  return (
    <div className="bg-white dark:bg-[#111b21] transition-colors border border-gray-200 dark:border-gray-800 transition-colors rounded-2xl p-5 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-md group">
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all">
            {donor.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 transition-colors text-sm leading-tight line-clamp-1">
              {donor.name}
            </h3>
            {isLoggedIn && <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors mt-0.5 line-clamp-1">{donor.email}</p>}
          </div>
        </div>

        {/* Blood group badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${bgClass}`}>
          {donor.bloodGroup}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {donor.location && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
            <FiMapPin className="text-gray-400 dark:text-gray-500 transition-colors flex-shrink-0" />
            <span className="truncate">{donor.location}</span>
          </div>
        )}
        {isLoggedIn && donor.phone && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
            <FiPhone className="text-gray-400 dark:text-gray-500 transition-colors flex-shrink-0" />
            <span>{donor.phone}</span>
          </div>
        )}
        {isLoggedIn && donor.email && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
            <FiMail className="text-gray-400 dark:text-gray-500 transition-colors flex-shrink-0" />
            <span className="truncate">{donor.email}</span>
          </div>
        )}
        {donor.lastDonated && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 transition-colors">
            <FiCalendar className="text-gray-400 dark:text-gray-500 transition-colors flex-shrink-0" />
            <span>Last donated: {donor.lastDonated}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 transition-colors">
        <span className={`flex items-center gap-1.5 text-xs font-semibold ${
          donor.availability ? 'text-emerald-600' : 'text-gray-400 dark:text-gray-500 transition-colors'
        }`}>
          {donor.availability
            ? <><FiCheckCircle /> Available</>
            : <><FiXCircle /> Unavailable</>
          }
        </span>

        <div className="flex gap-2 items-center">
          <Link
            to={`/donor/${donor.id}`}
            className="text-xs text-red-600 hover:text-red-800 transition-colors font-medium"
          >
            View Profile →
          </Link>
          {isLoggedIn && onRequest && donor.availability && (
            <button
              onClick={() => onRequest(donor)}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 transition-all font-semibold ml-2"
            >
              Request
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

