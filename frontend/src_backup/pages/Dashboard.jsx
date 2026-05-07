import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { donorService } from '../services/donorService'
import { requestService } from '../services/requestService'
import toast from 'react-hot-toast'
import {
  FiUser, FiInbox, FiSend, FiActivity,
  FiCheckCircle, FiXCircle, FiSave, FiMapPin, FiPhone, FiCalendar
} from 'react-icons/fi'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const STATUS_COLORS = {
  PENDING:  'bg-orange-100 text-orange-700 border-orange-200',
  ACCEPTED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
}

export default function Dashboard() {
  const { user, isDonor, isReceiver } = useAuth()

  // Donor profile state
  const [profile, setProfile]   = useState(null)
  const [form, setForm]         = useState({
    bloodGroup: '', location: '', phone: '', availability: true, lastDonated: ''
  })
  const [saving, setSaving]     = useState(false)

  // Request state
  const [outgoing, setOutgoing] = useState([])
  const [incoming, setIncoming] = useState([])
  const [reqLoading, setReqLoading] = useState(false)

  // Load donor profile
  useEffect(() => {
    if (isDonor) {
      donorService.getMe()
        .then(p => {
          setProfile(p)
          setForm({
            bloodGroup:   p.bloodGroup   || '',
            location:     p.location     || '',
            phone:        p.phone        || '',
            availability: p.availability ?? true,
            lastDonated:  p.lastDonated  || '',
          })
        })
        .catch(() => {})
    }
  }, [isDonor])

  // Load requests
  useEffect(() => {
    setReqLoading(true)
    const promises = []
    if (isReceiver) promises.push(requestService.getMine().then(setOutgoing).catch(() => {}))
    if (isDonor)    promises.push(requestService.getIncoming().then(setIncoming).catch(() => {}))
    
    Promise.all(promises).finally(() => setReqLoading(false))
  }, [isDonor, isReceiver])

  async function saveProfile(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const p = await donorService.saveProfile(form)
      setProfile(p)
      toast.success('Profile saved successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  async function respondToRequest(id, status) {
    try {
      await requestService.updateStatus(id, status)
      setIncoming(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      toast.success(`Request ${status.toLowerCase()}`)
    } catch {
      toast.error('Failed to update request')
    }
  }

  const pendingIncoming = incoming.filter(r => r.status === 'PENDING').length
  const activeOutgoing = outgoing.filter(r => r.status === 'ACCEPTED').length

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Date Header */}
      <div className="flex justify-end mb-6">
        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
          <FiCalendar className="text-gray-400" /> {today}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Blue/Purple */}
        <div className="bg-indigo-500 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <FiInbox /> <span className="text-sm font-semibold uppercase tracking-wider">Incoming</span>
            </div>
            <div className="text-4xl font-bold">{incoming.length}</div>
            <div className="text-xs mt-1 opacity-90">Total Requests Received</div>
          </div>
        </div>

        {/* Card 2: Green */}
        <div className="bg-emerald-500 rounded-2xl p-5 text-white shadow-lg shadow-emerald-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <FiSend /> <span className="text-sm font-semibold uppercase tracking-wider">Sent</span>
            </div>
            <div className="text-4xl font-bold">{outgoing.length}</div>
            <div className="text-xs mt-1 opacity-90">{activeOutgoing} Accepted</div>
          </div>
        </div>

        {/* Card 3: Orange */}
        <div className="bg-orange-500 rounded-2xl p-5 text-white shadow-lg shadow-orange-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <FiActivity /> <span className="text-sm font-semibold uppercase tracking-wider">Pending</span>
            </div>
            <div className="text-4xl font-bold">{pendingIncoming}</div>
            <div className="text-xs mt-1 opacity-90">Requires your attention</div>
          </div>
        </div>

        {/* Card 4: Teal */}
        <div className="bg-teal-500 rounded-2xl p-5 text-white shadow-lg shadow-teal-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <FiUser /> <span className="text-sm font-semibold uppercase tracking-wider">Status</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {isDonor ? (form.availability ? 'Available' : 'Unavailable') : 'Receiver'}
            </div>
            <div className="text-xs mt-2 opacity-90">{form.bloodGroup || 'No Blood Group'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Requests Table */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-indigo-500"><FiActivity /></span> Recent Requests
            </h2>
            <span className="text-xs font-semibold text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
              {isDonor ? incoming.length : outgoing.length} Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-l-lg">Name</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {reqLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-400">Loading requests...</td>
                  </tr>
                ) : (isDonor ? incoming : outgoing).length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-400">No requests found.</td>
                  </tr>
                ) : (
                  (isDonor ? incoming : outgoing).map(req => (
                    <tr key={req.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{isDonor ? req.requesterName : req.donorName}</p>
                        <p className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate" title={req.message}>
                        {req.message || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[req.status]}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isDonor && req.status === 'PENDING' ? (
                          <div className="flex gap-2">
                            <button onClick={() => respondToRequest(req.id, 'ACCEPTED')} className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors" title="Accept">
                              <FiCheckCircle className="text-lg" />
                            </button>
                            <button onClick={() => respondToRequest(req.id, 'REJECTED')} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors" title="Reject">
                              <FiXCircle className="text-lg" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Profile Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-emerald-500"><FiUser /></span> My Profile
            </h2>
          </div>

          {isDonor ? (
            <form onSubmit={saveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Blood Group *</label>
                  <select
                    value={form.bloodGroup} required
                    onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Location</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text" className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="e.g. Sirajganj"
                      value={form.location}
                      onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel" className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="017..."
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Last Donation</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date" className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      value={form.lastDonated}
                      onChange={e => setForm(f => ({ ...f, lastDonated: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Availability toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Availability Status</p>
                  <p className="text-xs text-gray-500 mt-0.5">Visible to receivers during search</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, availability: !f.availability }))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none
                    ${form.availability ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300
                    ${form.availability ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <button type="submit" disabled={saving} className="w-full py-3 bg-[#5a67d8] hover:bg-[#4c51bf] text-white font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/30 flex items-center justify-center gap-2">
                {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave /> Save Profile</>}
              </button>
            </form>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-16 h-16 mx-auto bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center text-3xl mb-4">
                🏥
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Receiver Account</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-[250px] mx-auto">
                Your account is currently set up as a Receiver. You can send blood requests to available donors.
              </p>
              <div className="inline-block text-left bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-semibold">Account Details</p>
                <p className="text-sm font-medium text-gray-800 mt-2"><span className="text-gray-500 mr-2">Name:</span> {user?.name}</p>
                <p className="text-sm font-medium text-gray-800 mt-1"><span className="text-gray-500 mr-2">Email:</span> {user?.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
