import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { donorService } from '../services/donorService'
import { FiDroplet, FiSearch, FiUsers, FiHeart, FiArrowRight, FiShield, FiZap } from 'react-icons/fi'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const STEPS = [
  { icon: FiSearch,  title: 'Search', desc: 'Filter donors by blood group and location' },
  { icon: FiUsers,   title: 'Connect', desc: 'View donor contact info and send requests' },
  { icon: FiDroplet, title: 'Donate', desc: 'Donor responds and coordinates with receiver' },
]

export default function Home() {
  const { isLoggedIn } = useAuth()
  const [stats, setStats] = useState({ donors: 0, locations: 0 })

  useEffect(() => {
    donorService.getAll().then(donors => {
      setStats({
        donors: donors.length,
        locations: [...new Set(donors.map(d => d.location).filter(Boolean))].length,
      })
    }).catch(() => {})
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-[#111b21] transition-colors border border-gray-200 dark:border-gray-800 transition-colors rounded-3xl p-8 sm:p-12 lg:p-16 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <FiDroplet className="w-64 h-64 text-red-900" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-semibold mb-6">
            <FiDroplet className="animate-pulse-slow" />
            Emergency Blood Finder System v2.1
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6 text-gray-900 dark:text-gray-100 transition-colors">
            Save Lives with <br/>
            <span className="text-red-600">One Search</span>
          </h1>

          <p className="text-gray-500 dark:text-gray-400 transition-colors text-lg mb-8 max-w-2xl">
            Find blood donors in your area instantly. Connect with verified donors and get the blood you need in emergency situations — fast and free.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/search" className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-red-500/30 flex items-center gap-2">
              <FiSearch /> Search Donors Now
            </Link>
            {!isLoggedIn && (
              <Link to="/add-donor" className="px-8 py-3.5 bg-white dark:bg-[#111b21] transition-colors border border-gray-300 dark:border-gray-700 transition-colors text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-all flex items-center gap-2">
                Add a Donor <FiArrowRight />
              </Link>
            )}
          </div>
        </div>

        {/* Stats row inside Hero */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-12 border-t border-gray-100 dark:border-gray-800 transition-colors relative z-10">
          {[
            { value: stats.donors, label: 'Active Donors' },
            { value: stats.locations, label: 'Locations' },
            { value: BLOOD_GROUPS.length, label: 'Blood Groups' },
            { value: '24/7', label: 'Emergency Support' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 dark:bg-[#202c33] transition-colors rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800 transition-colors">
              <div className="text-2xl sm:text-3xl font-heading font-black text-red-600">
                {s.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors font-bold uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Blood Groups Quick Filter ────────────────────────── */}
      <section className="bg-white dark:bg-[#111b21] transition-colors border border-gray-200 dark:border-gray-800 transition-colors rounded-3xl p-8 shadow-sm">
        <h2 className="font-heading font-bold text-xl text-gray-800 dark:text-gray-200 transition-colors mb-6 flex items-center gap-2">
          <FiDroplet className="text-red-500" /> Search by Blood Group
        </h2>
        <div className="flex flex-wrap gap-3">
          {BLOOD_GROUPS.map(bg => (
            <Link
              key={bg}
              to={`/search?bloodGroup=${encodeURIComponent(bg)}`}
              className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors bg-gray-50 dark:bg-[#202c33] transition-colors text-gray-700 font-bold hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm hover:shadow-md"
            >
              {bg}
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-[#111b21] transition-colors border border-gray-200 dark:border-gray-800 transition-colors rounded-3xl p-8 shadow-sm">
          <h2 className="font-heading font-black text-2xl text-gray-900 dark:text-gray-100 transition-colors mb-6">How It Works</h2>
          <div className="space-y-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-800 dark:text-gray-200 transition-colors text-lg">{step.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 transition-colors text-sm mt-1">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 shadow-sm text-white flex flex-col justify-center text-center relative overflow-hidden">
          <FiHeart className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10" />
          <h2 className="font-heading font-black text-3xl mb-4 relative z-10">Become a Donor Today</h2>
          <p className="text-red-100 mb-8 relative z-10 text-sm sm:text-base px-4">
            Your single donation can save up to 3 lives. Register now and be a hero in your community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 relative z-10">
            <Link to="/add-donor" className="px-6 py-3 bg-white dark:bg-[#111b21] transition-colors text-red-700 hover:bg-gray-50 font-bold rounded-xl transition-colors shadow-lg">
              Register as Donor
            </Link>
            <Link to="/bloodbanks" className="px-6 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-colors">
              View Blood Banks
            </Link>
          </div>
        </section>
      </div>

    </div>
  )
}

