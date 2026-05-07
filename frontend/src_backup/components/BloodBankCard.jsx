import { FiHeart, FiMapPin, FiPhone, FiInfo } from 'react-icons/fi'

export default function BloodBankCard({ bank, onEdit, onDelete, isAdmin }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md group">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
          <FiHeart className="text-indigo-600 group-hover:text-white text-xl transition-colors" />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-heading font-bold text-gray-900 text-base leading-tight line-clamp-2">
            {bank.name}
          </h3>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-2.5 text-sm text-gray-600">
          <FiMapPin className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{bank.location}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-600">
          <FiPhone className="text-gray-400 flex-shrink-0" />
          <span className="font-medium">{bank.contact}</span>
        </div>
        {bank.description && (
          <div className="flex items-start gap-2.5 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">
            <FiInfo className="text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2 text-xs leading-relaxed">{bank.description}</span>
          </div>
        )}
      </div>

      {/* Admin actions */}
      {isAdmin && (
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button onClick={() => onEdit(bank)} className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-sm font-semibold transition-colors border border-indigo-100">
            Edit
          </button>
          <button onClick={() => onDelete(bank.id)} className="flex-1 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-sm font-semibold transition-colors border border-red-100">
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
