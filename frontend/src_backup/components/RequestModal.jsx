import { useState } from 'react'
import { FiX, FiSend } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { requestService } from '../services/requestService'

export default function RequestModal({ donor, onClose }) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) {
      toast.error('Please write a message')
      return
    }
    setLoading(true)
    try {
      await requestService.create({ donorId: donor.id, message })
      toast.success('Blood request sent successfully!')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-slide-up border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-xl text-gray-900">Request Blood Donation</h2>
            <p className="text-sm text-gray-500 mt-0.5">Sending request to <span className="text-indigo-600 font-semibold">{donor.name}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Donor info */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 mb-6">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 font-bold shadow-sm text-lg">
            {donor.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{donor.name}</p>
            <p className="text-xs text-indigo-600 font-semibold mt-0.5">{donor.bloodGroup} • {donor.location}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Your Message</label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 resize-none"
              rows={4}
              placeholder="Describe your emergency and why you need blood donation..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl flex-1 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex-1 transition-colors flex items-center justify-center gap-2">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><FiSend /> Send Request</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
