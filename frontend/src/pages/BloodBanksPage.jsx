import { useState, useEffect } from 'react'
import { bloodBankService } from '../services/bloodBankService'
import { useAuth } from '../context/AuthContext'
import BloodBankCard from '../components/BloodBankCard'
import toast from 'react-hot-toast'
import { FiHeart, FiPlus, FiSearch, FiX } from 'react-icons/fi'

export default function BloodBanksPage() {
  const { isAdmin } = useAuth()
  const [banks,   setBanks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState({ name: '', location: '', contact: '', description: '' })
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    loadBanks()
  }, [])

  async function loadBanks() {
    setLoading(true)
    try {
      const data = await bloodBankService.getAll()
      setBanks(data)
    } catch {
      toast.error('Failed to load blood banks')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setForm({ name: '', location: '', contact: '', description: '' })
    setModal(true)
  }

  function openEdit(bank) {
    setEditing(bank)
    setForm({ name: bank.name, location: bank.location, contact: bank.contact, description: bank.description || '' })
    setModal(true)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this blood bank?')) return
    try {
      await bloodBankService.delete(id)
      setBanks(prev => prev.filter(b => b.id !== id))
      toast.success('Blood bank deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const updated = await bloodBankService.update(editing.id, form)
        setBanks(prev => prev.map(b => b.id === editing.id ? updated : b))
        toast.success('Blood bank updated')
      } else {
        const created = await bloodBankService.create(form)
        setBanks(prev => [created, ...prev])
        toast.success('Blood bank added')
      }
      setModal(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const filtered = banks.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-black text-3xl text-gray-900 dark:text-gray-100 transition-colors">Blood Banks</h1>
          <p className="text-gray-500 dark:text-gray-400 transition-colors mt-1 text-sm">
            {banks.length} blood banks across Sirajganj district
          </p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm">
            <FiPlus /> Add Blood Bank
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors" />
        <input
          type="text"
          className="w-full bg-white dark:bg-[#111b21] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-800 dark:text-gray-200 transition-colors rounded-2xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm"
          placeholder="Search by name or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-600">
            <FiX className="text-xl" />
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center py-16">
          <div className="w-10 h-10 border-3 border-gray-200 dark:border-gray-800 transition-colors border-t-red-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400 transition-colors text-sm">Loading blood banks...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(bank => (
            <BloodBankCard
              key={bank.id}
              bank={bank}
              isAdmin={isAdmin}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-[#111b21] transition-colors border border-gray-200 dark:border-gray-800 transition-colors rounded-3xl shadow-sm">
          <div className="mb-4"><FiHeart className="mx-auto text-red-100 text-6xl" /></div>
          <h3 className="font-heading font-bold text-xl text-gray-800 dark:text-gray-200 transition-colors mb-2">No Blood Banks Found</h3>
          <p className="text-gray-500 dark:text-gray-400 transition-colors text-sm">
            {search ? 'Try a different search term' : 'No blood banks have been added yet'}
          </p>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#111b21] transition-colors rounded-3xl p-8 w-full max-w-md shadow-2xl animate-slide-up border border-gray-100 dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl text-gray-900 dark:text-gray-100 transition-colors">
                {editing ? 'Edit Blood Bank' : 'Add Blood Bank'}
              </h2>
              <button onClick={() => setModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-600 transition-colors">
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors uppercase tracking-wider mb-1.5">Name *</label>
                <input type="text" className="w-full bg-gray-50 dark:bg-[#202c33] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-800 dark:text-gray-200 transition-colors rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" required placeholder="Blood bank name"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors uppercase tracking-wider mb-1.5">Location *</label>
                <input type="text" className="w-full bg-gray-50 dark:bg-[#202c33] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-800 dark:text-gray-200 transition-colors rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" required placeholder="e.g. Sirajganj sodor"
                  value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors uppercase tracking-wider mb-1.5">Contact *</label>
                <input type="text" className="w-full bg-gray-50 dark:bg-[#202c33] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-800 dark:text-gray-200 transition-colors rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" required placeholder="01700-000000"
                  value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors uppercase tracking-wider mb-1.5">Description</label>
                <textarea className="w-full bg-gray-50 dark:bg-[#202c33] transition-colors border border-gray-200 dark:border-gray-800 transition-colors text-gray-800 dark:text-gray-200 transition-colors rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 resize-none" rows={3} placeholder="Optional description"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-3 bg-white dark:bg-[#111b21] transition-colors border border-gray-300 dark:border-gray-700 transition-colors text-gray-700 hover:bg-gray-50 font-semibold rounded-xl flex-1 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl flex-1 transition-colors flex items-center justify-center">
                  {saving
                    ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : (editing ? 'Update' : 'Add Bank')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

