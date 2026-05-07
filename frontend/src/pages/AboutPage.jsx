import { useLanguage } from '../context/LanguageContext'
import { FiInfo, FiCode, FiUsers, FiGlobe } from 'react-icons/fi'

export default function AboutPage() {
  const { lang, t } = useLanguage()

  const items = [
    [t('appName'),    'Emergency Blood Finder System'],
    [t('version'),    'v2.1.0'],
    [t('team'),       'Code Cube'],
    [t('university'), 'Khwaja Yunus Ali University'],
    [t('backend'),    'Spring Boot 3.4 (Java)'],
    [t('frontend'),   'React + Vite + Tailwind CSS'],
  ]

  const members = [
    { name: 'Md Sojib Ahmed',    role: lang === 'bn' ? 'ফুল-স্ট্যাক ডেভেলপার' : 'Full-Stack Developer' },
    { name: 'Team Member 2',  role: lang === 'bn' ? 'ব্যাকএন্ড ডেভেলপার'   : 'Backend Developer' },
    { name: 'Team Member 3',  role: lang === 'bn' ? 'ফ্রন্টএন্ড ডেভেলপার'  : 'Frontend Developer' },
  ]

  return (
    <div className="max-w-2xl mx-auto pb-16 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
          <span className="text-white text-2xl">🩸</span>
        </div>
        <div>
          <h1 className="text-2xl font-heading font-black text-gray-900 dark:text-white">
            {t('aboutApp')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{t('aboutDesc')}</p>
        </div>
      </div>

      <div className="space-y-4">

        {/* App Info */}
        <div className="bg-white dark:bg-[#111b21] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center">
              <FiInfo />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              {lang === 'bn' ? 'অ্যাপের তথ্য' : 'App Information'}
            </h2>
          </div>
          <div className="space-y-0">
            {items.map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="text-sm text-gray-500 dark:text-gray-400">{k}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-white dark:bg-[#111b21] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FiUsers />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              {lang === 'bn' ? 'ডেভেলপার টিম' : 'Developer Team'}
            </h2>
          </div>
          <div className="space-y-3">
            {members.map(m => (
              <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#202c33] border border-gray-100 dark:border-gray-800">
                <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                  {m.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{m.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white dark:bg-[#111b21] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FiCode />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">
              {lang === 'bn' ? 'প্রযুক্তি স্ট্যাক' : 'Tech Stack'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Spring Boot', 'Java', 'MySQL', 'JWT', 'React', 'Vite', 'Tailwind CSS', 'REST API'].map(tech => (
              <span key={tech} className="px-3 py-1.5 bg-gray-100 dark:bg-[#202c33] text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* University */}
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 text-white shadow-lg shadow-red-500/20">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="https://www.kyau.edu.bd/images/kyau.png" 
              alt="KYAU Logo" 
              className="w-8 h-8 object-contain bg-white rounded-full p-0.5"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block'; // Show fallback icon if image fails
              }}
            />
            <FiGlobe className="text-xl text-red-200 hidden" />
            <p className="text-sm text-red-200 font-medium">Khwaja Yunus Ali University</p>
          </div>
          <h3 className="text-lg font-bold mb-1">Code Cube — Team Project</h3>
          <p className="text-red-200 text-sm">
            {lang === 'bn'
              ? 'এই প্রজেক্টটি বিশ্ববিদ্যালয়ের একটি একাডেমিক প্রজেক্ট হিসেবে তৈরি করা হয়েছে।'
              : 'This project was built as an academic project at university.'}
          </p>
          <div className="mt-4 pt-4 border-t border-red-500/40">
            <p className="text-xs text-red-300">Emergency Blood Finder System v2.1.0 • 2026</p>
          </div>
        </div>

      </div>
    </div>
  )
}
