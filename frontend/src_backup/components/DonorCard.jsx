import { Link } from 'react-router-dom'
import { FiPhone, FiMapPin, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi'

const BG_COLORS = {
  'A+': 'bg-red-100 text-red-700 border-red-200',
  'A-': 'bg-orange-100 text-orange-700 border-orange-200',
  'B+': 'bg-blue-100 text-blue-700 border-blue-200',
  'B-': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'AB+': 'bg-purple-100 text-purple-700 border-purple-200',
  'AB-': 'bg-pink-100 text-pink-700 border-pink-200',
  'O+': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'O-': 'bg-teal-100 text-teal-700 border-teal-200',
}

export default function DonorCard({ donor, onRequest }) {
  const bgClass = BG_COLORS[donor.bloodGroup] || 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md group">
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            {donor.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-1">
              {donor.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{donor.email}</p>
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
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiMapPin className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{donor.location}</span>
          </div>
        )}
        {donor.phone && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiPhone className="text-gray-400 flex-shrink-0" />
            <span>{donor.phone}</span>
          </div>
        )}
        {donor.lastDonated && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiCalendar className="text-gray-400 flex-shrink-0" />
            <span>Last donated: {donor.lastDonated}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className={`flex items-center gap-1.5 text-xs font-semibold ${
          donor.availability ? 'text-emerald-600' : 'text-gray-400'
        }`}>
          {donor.availability
            ? <><FiCheckCircle /> Available</>
            : <><FiXCircle /> Unavailable</>
          }
        </span>

        <div className="flex gap-2 items-center">
          <Link
            to={`/donor/${donor.id}`}
            className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            View Profile →
          </Link>
          {onRequest && donor.availability && (
            <button
              onClick={() => onRequest(donor)}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-100 transition-all font-semibold ml-2"
            >
              Request
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
