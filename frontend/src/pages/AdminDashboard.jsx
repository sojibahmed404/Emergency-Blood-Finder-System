import { useState, useEffect } from 'react'
import { adminService } from '../services/adminService'
import { bloodBankService } from '../services/bloodBankService'
import { donorService } from '../services/donorService'
import toast from 'react-hot-toast'
import {
  FiUsers, FiDroplet, FiHeart, FiActivity,
  FiCheckCircle, FiXCircle, FiTrash2, FiRefreshCw
} from 'react-icons/fi'

const STATUS_COLORS = {
  ACTIVE:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  BLOCKED: 'bg-red-100 text-red-700 border-red-200',
}
const ROLE_COLORS = {
  ADMIN:    'bg-purple-100 text-purple-700 border-purple-200',
  DONOR:    'bg-red-100 text-red-700 border-red-200',
  RECEIVER: 'bg-blue-100 text-blue-700 border-blue-200',
}

export default function AdminDashboard() {
  const [stats,  setStats]  = useState(null)
  const [users,  setUsers]  = useState([])
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('users') // users | donors

  useEffect(() => {
    loadStats()
    loadUsers()
    loadDonors()
  }, [])

  async function loadStats() {
    try {
      const s = await adminService.getStats()
      setStats(s)
    } catch { toast.error('Failed to load stats') }
  }

  async function loadUsers() {
    setLoading(true)
    try {
      const u = await adminService.getUsers()
      setUsers(u)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  async function loadDonors() {
    setLoading(true)
    try {
      const d = await donorService.getAll()
      setDonors(d)
    } catch { toast.error('Failed to load donors') }
    finally { setLoading(false) }
  }

  async function toggleBlock(id) {
    try {
      const res = await adminService.toggleBlock(id)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: res.status } : u))
      toast.success('User status updated')
    } catch { toast.error('Failed to update user') }
  }

  async function deleteUser(id) {
    if (!confirm('Permanently delete this user?')) return
    try {
      await adminService.deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success('User deleted')
      await loadStats()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Date & Refresh Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 transition-colors">Admin Overview</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors hidden sm:flex items-center gap-2">
            <FiCheckCircle className="text-gray-400 dark:text-gray-500 transition-colors" /> {today}
          </p>
          <button onClick={() => { loadStats(); loadUsers(); loadDonors(); }} 
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#111b21] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-600 dark:text-gray-300 transition-colors rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-red-500 rounded-2xl p-5 text-white shadow-lg shadow-red-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <FiUsers /> <span className="text-sm font-semibold uppercase tracking-wider">Total Users</span>
            </div>
            <div className="text-4xl font-bold">{stats?.totalUsers || 0}</div>
            <div className="text-xs mt-1 opacity-90">{stats?.blockedUsers || 0} Blocked</div>
          </div>
        </div>

        <div className="bg-emerald-500 rounded-2xl p-5 text-white shadow-lg shadow-emerald-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <FiDroplet /> <span className="text-sm font-semibold uppercase tracking-wider">Donors</span>
            </div>
            <div className="text-4xl font-bold">{stats?.totalDonors || 0}</div>
            <div className="text-xs mt-1 opacity-90">{stats?.availableDonors || 0} Available Now</div>
          </div>
        </div>

        <div className="bg-orange-500 rounded-2xl p-5 text-white shadow-lg shadow-orange-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <FiActivity /> <span className="text-sm font-semibold uppercase tracking-wider">Requests</span>
            </div>
            <div className="text-4xl font-bold">{stats?.totalRequests || 0}</div>
            <div className="text-xs mt-1 opacity-90">{stats?.pendingRequests || 0} Pending</div>
          </div>
        </div>

        <div className="bg-teal-500 rounded-2xl p-5 text-white shadow-lg shadow-teal-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <FiHeart /> <span className="text-sm font-semibold uppercase tracking-wider">Blood Banks</span>
            </div>
            <div className="text-4xl font-bold">{stats?.totalBloodBanks || 0}</div>
            <div className="text-xs mt-1 opacity-90">Active Centers</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#111b21] transition-colors border border-gray-200 dark:border-gray-800 transition-colors rounded-2xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 transition-colors bg-gray-50 dark:bg-[#202c33] transition-colors/50">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors
              ${activeTab === 'users' ? 'text-[#5a67d8] bg-white dark:bg-[#111b21] transition-colors border-b-2 border-[#5a67d8]' : 'text-gray-500 dark:text-gray-400 transition-colors hover:text-gray-700'}`}
          >
            <FiUsers /> System Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('donors')}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors
              ${activeTab === 'donors' ? 'text-[#5a67d8] bg-white dark:bg-[#111b21] transition-colors border-b-2 border-[#5a67d8]' : 'text-gray-500 dark:text-gray-400 transition-colors hover:text-gray-700'}`}
          >
            <FiDroplet /> Registered Donors ({donors.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-gray-200 dark:border-gray-800 transition-colors border-t-red-500 rounded-full animate-spin" />
            </div>
          ) : activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 dark:text-gray-400 transition-colors uppercase bg-gray-50 dark:bg-[#202c33] transition-colors/50 border-b border-gray-200 dark:border-gray-800 transition-colors">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800 transition-colors last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">
                            {u.name?.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200 transition-colors">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 transition-colors">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${ROLE_COLORS[u.role]}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[u.status]}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== 'ADMIN' && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => toggleBlock(u.id)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors
                                ${u.status === 'ACTIVE' 
                                  ? 'text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100' 
                                  : 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                }`}
                            >
                              {u.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                            </button>
                            <button onClick={() => deleteUser(u.id)}
                              className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors" title="Delete">
                              <FiTrash2 />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 dark:text-gray-400 transition-colors uppercase bg-gray-50 dark:bg-[#202c33] transition-colors/50 border-b border-gray-200 dark:border-gray-800 transition-colors">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Blood Group</th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-6 py-4 font-semibold">Phone</th>
                    <th className="px-6 py-4 font-semibold">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map(d => (
                    <tr key={d.id} className="border-b border-gray-100 dark:border-gray-800 transition-colors last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            {d.name?.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200 transition-colors">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                          {d.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 transition-colors">{d.location || '—'}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 transition-colors">{d.phone || '—'}</td>
                      <td className="px-6 py-4">
                        {d.availability 
                          ? <span className="flex items-center gap-1 text-emerald-600 font-medium"><FiCheckCircle /> Yes</span>
                          : <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500 transition-colors"><FiXCircle /> No</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

