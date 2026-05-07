import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { donorService } from '../services/donorService'
import { useAuth } from '../context/AuthContext'
import DonorCard from '../components/DonorCard'
import RequestModal from '../components/RequestModal'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const LOCATIONS    = ['', 'Belkuchi', 'Shahjadpur', 'Ullapara', 'Sirajganj', 'Sirajganj sodor', 'Enayetpur', 'Tangail']

export default function SearchPage() {
  const { isLoggedIn, isReceiver } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [bloodGroup, setBloodGroup] = useState(searchParams.get('bloodGroup') || '')
  const [location,   setLocation]   = useState(searchParams.get('location')   || '')
  const [donors,     setDonors]     = useState([])
  const [loading,    setLoading]    = useState(false)
  const [searched,   setSearched]   = useState(false)
  const [selected,   setSelected]   = useState(null)

  // Auto-search if URL has params
  useEffect(() => {
    if (searchParams.get('bloodGroup') || searchParams.get('location')) {
      handleSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSearch(e) {
    if (e) e.preventDefault()
    setLoading(true)
    setSearched(true)
    try {
      const params = {}
      if (bloodGroup) params.bloodGroup = bloodGroup
      if (location)   params.location   = location
      const data = await donorService.search(params)
      setDonors(data)
      setSearchParams(params)
    } catch {
      setDonors([])
    } finally {
      setLoading(false)
    }
  }

  function clearFilters() {
    setBloodGroup('')
    setLocation('')
    setDonors([])
    setSearched(false)
    setSearchParams({})
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-black text-3xl text-gray-900 mb-2">
          Find Blood Donors
        </h1>
        <p className="text-gray-500">
          Search across {LOCATIONS.length - 1}+ locations in Sirajganj district
        </p>
      </div>

      {/* Search form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          {/* Blood group select */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={e => setBloodGroup(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              {BLOOD_GROUPS.map(bg => (
                <option key={bg} value={bg}>
                  {bg || 'All Blood Groups'}
                </option>
              ))}
            </select>
          </div>

          {/* Location select */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Location</label>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>
                  {loc || 'All Locations'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 items-end">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 flex-1 sm:flex-none">
              <FiSearch /> Search
            </button>
            {searched && (
              <button type="button" onClick={clearFilters} className="px-4 py-2.5 bg-white border border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all">
                <FiX />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex flex-col items-center py-16">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Searching donors...</p>
        </div>
      )}

      {!loading && searched && (
        <>
          {/* Result count */}
          <div className="flex items-center gap-2 mb-6">
            <FiFilter className="text-indigo-500" />
            <span className="text-sm text-gray-500">
              <span className="text-gray-900 font-semibold">{donors.length}</span> donor{donors.length !== 1 ? 's' : ''} found
              {bloodGroup && <> for blood group <span className="text-indigo-600 font-bold">{bloodGroup}</span></>}
              {location && <> in <span className="text-indigo-600 font-bold">{location}</span></>}
            </span>
          </div>

          {donors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map(donor => (
                <DonorCard
                  key={donor.id}
                  donor={donor}
                  onRequest={isLoggedIn && isReceiver ? setSelected : null}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="text-5xl mb-4 text-gray-300">🔍</div>
              <h3 className="font-heading font-bold text-lg text-gray-800 mb-2">No Donors Found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters or clearing the search</p>
              <button onClick={clearFilters} className="mt-4 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm font-semibold transition-colors">
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}

      {!searched && !loading && (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="text-6xl mb-4 text-indigo-100">🩸</div>
          <h3 className="font-heading font-bold text-xl text-gray-800 mb-2">
            Ready to Find a Donor?
          </h3>
          <p className="text-gray-500 text-sm">Use the search form above to find blood donors near you</p>
        </div>
      )}

      {/* Request modal */}
      {selected && (
        <RequestModal donor={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
