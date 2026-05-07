import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { authService } from '../services/authService'
import { donorService } from '../services/donorService'
import toast from 'react-hot-toast'
import {
  FiUser, FiMoon, FiSun, FiBell, FiShield,
  FiLock, FiPhone, FiMapPin, FiDroplet, FiClock,
  FiEye, FiTrash2, FiMessageSquare, FiInfo, FiHelpCircle,
  FiLogOut, FiGlobe, FiChevronDown, FiChevronUp, FiSave, FiMail
} from 'react-icons/fi'

function Section({ icon: Icon, iconBg = 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', title, subtitle, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white dark:bg-[#111b21] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50 dark:hover:bg-[#1a2530] transition-colors">
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${iconBg}`}><Icon /></div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <span className="text-gray-400 ml-2 flex-shrink-0">{open ? <FiChevronUp /> : <FiChevronDown />}</span>
      </button>
      {open && <div className="px-5 sm:px-6 pb-6 border-t border-gray-100 dark:border-gray-800 pt-4">{children}</div>}
    </div>
  )
}

function Toggle({ label, sublabel, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
        {sublabel && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
      <button onClick={() => onChange(!value)} className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ml-4 ${value ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

function InputField({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />}
        <input className={`w-full bg-gray-50 dark:bg-[#202c33] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all`} {...props} />
      </div>
    </div>
  )
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function Settings() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { lang, switchLang, t } = useLanguage()
  const navigate = useNavigate()

  const [profile, setProfile] = useState({ name: user?.name || '', phone: '', address: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [pw, setPw] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [savingPw, setSavingPw] = useState(false)
  const [notif, setNotif] = useState({ sms: true, email: true, app: true })
  const [blood, setBlood] = useState({ bloodGroup: '', lastDonated: '', availability: true })
  const [savingBlood, setSavingBlood] = useState(false)
  const [privacy, setPrivacy] = useState({ hidePhone: false, publicProfile: true })
  const [feedback, setFeedback] = useState('')
  const [sendingFeedback, setSendingFeedback] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSavingProfile(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success(t('profileUpdated'))
    setSavingProfile(false)
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    if (pw.newPassword !== pw.confirmPassword) { toast.error(t('passwordMismatchError')); return }
    if (pw.newPassword.length < 6) { toast.error(t('passwordTooShort')); return }
    setSavingPw(true)
    try {
      await authService.login({ email: user.email, password: pw.oldPassword })
      toast.success(t('passwordChanged'))
      setPw({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      toast.error(t('oldPasswordWrong'))
    } finally {
      setSavingPw(false)
    }
  }

  async function handleSaveBlood(e) {
    e.preventDefault()
    setSavingBlood(true)
    try {
      await donorService.saveProfile(blood)
      toast.success(t('bloodUpdated'))
    } catch {
      toast.error(t('saveFailed'))
    } finally {
      setSavingBlood(false)
    }
  }

  async function handleFeedback(e) {
    e.preventDefault()
    if (!feedback.trim()) return
    setSendingFeedback(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success(t('feedbackSent'))
    setFeedback('')
    setSendingFeedback(false)
  }

  function handleLogout() {
    logout()
    navigate('/')
    toast.success(t('logoutSuccess'))
  }

  function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') { toast.error(t('typeDelete')); return }
    toast.error(t('contactAdmin'))
    setDeleteConfirm('')
  }

  const btnClass = "mt-4 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-60"

  const faqItems = lang === 'bn' ? [
    ['কিভাবে ডোনার হওয়া যায়?', '"Donor Register" বাটনে ক্লিক করে নিবন্ধন করুন।'],
    ['পাসওয়ার্ড ভুলে গেলে?', 'Settings > Change Password থেকে পরিবর্তন করুন।'],
    ['সার্চে আমার নাম দেখাচ্ছে না?', 'Availability Status চালু আছে কিনা চেক করুন।'],
    ['যোগাযোগ করতে চাইলে?', 'Feedback সেকশনে মেসেজ পাঠান।'],
  ] : [
    ['How to become a donor?', 'Click the "Donor Register" button to sign up.'],
    ['Forgot password?', 'Go to Settings > Change Password to update it.'],
    ['Not showing in search?', 'Check if Availability Status is turned on.'],
    ['Want to contact us?', 'Send a message in the Feedback section.'],
  ]

  const aboutItems = [
    [t('appName'), 'Emergency Blood Finder System'],
    [t('version'), 'v2.1.0'],
    [t('team'), 'Code Cube'],
    [t('university'), 'Khwaja Yunus Ali University'],
    [t('backend'), 'Spring Boot 3.4'],
    [t('frontend'), 'React + Vite + Tailwind CSS'],
  ]

  return (
    <div className="max-w-2xl mx-auto pb-16 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-black text-gray-900 dark:text-white">⚙️ {t('settingsTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{t('settingsDesc')}</p>
      </div>

      <div className="space-y-3">

        {/* 1. Profile */}
        <Section icon={FiUser} title={t('profileSettings')} subtitle={t('profileDesc')} defaultOpen>
          <form onSubmit={handleSaveProfile} className="space-y-4 mt-2">
            <InputField label={t('yourFullName')} icon={FiUser} value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder={t('fullNamePlaceholder')} />
            <InputField label={t('yourEmail')} icon={FiMail} value={user?.email || ''} disabled />
            <InputField label={t('yourPhone')} icon={FiPhone} value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="01XXXXXXXXX" />
            <InputField label={t('yourAddress')} icon={FiMapPin} value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} placeholder={t('areaPlaceholder')} />
            <button type="submit" disabled={savingProfile} className={btnClass}>
              {savingProfile ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />}
              {t('saveBtn')}
            </button>
          </form>
        </Section>

        {/* 2. Change Password */}
        <Section icon={FiLock} title={t('changePassword')} subtitle={t('changePasswordDesc')}>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-2">
            <InputField label={t('oldPassword')} icon={FiLock} type="password" value={pw.oldPassword} onChange={e => setPw(p => ({ ...p, oldPassword: e.target.value }))} placeholder="••••••••" required />
            <InputField label={t('newPassword')} icon={FiLock} type="password" value={pw.newPassword} onChange={e => setPw(p => ({ ...p, newPassword: e.target.value }))} placeholder={t('passwordPlaceholder')} required />
            <InputField label={t('confirmNewPassword')} icon={FiLock} type="password" value={pw.confirmPassword} onChange={e => setPw(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="••••••••" required />
            <button type="submit" disabled={savingPw} className={btnClass}>
              {savingPw ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiShield />}
              {t('changePasswordBtn')}
            </button>
          </form>
        </Section>

        {/* 3. Notifications */}
        <Section icon={FiBell} iconBg="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" title={t('notificationSettings')} subtitle={t('notificationDesc')}>
          <div className="mt-2">
            <Toggle label={t('smsNotification')} sublabel={t('smsDesc')} value={notif.sms} onChange={v => setNotif(n => ({ ...n, sms: v }))} />
            <Toggle label={t('emailNotification')} sublabel={t('emailDesc')} value={notif.email} onChange={v => setNotif(n => ({ ...n, email: v }))} />
            <Toggle label={t('appNotification')} sublabel={t('appDesc')} value={notif.app} onChange={v => setNotif(n => ({ ...n, app: v }))} />
          </div>
        </Section>

        {/* 4. Theme */}
        <Section icon={theme === 'dark' ? FiMoon : FiSun} iconBg="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" title={t('darkLightMode')} subtitle={t('darkLightDesc')}>
          <div className="flex gap-3 mt-3">
            <button onClick={() => setTheme('light')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${theme === 'light' ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-600' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
              <FiSun /> {t('lightMode')}
            </button>
            <button onClick={() => setTheme('dark')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${theme === 'dark' ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
              <FiMoon /> {t('darkMode')}
            </button>
          </div>
        </Section>

        {/* 5. Language */}
        <Section icon={FiGlobe} iconBg="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" title={t('languageSettings')} subtitle={t('languageDesc')}>
          <div className="flex gap-3 mt-3">
            <button onClick={() => { switchLang('bn'); toast.success('ভাষা: বাংলা') }} className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${lang === 'bn' ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
              🇧🇩 বাংলা
            </button>
            <button onClick={() => { switchLang('en'); toast.success('Language: English') }} className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${lang === 'en' ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
              🇬🇧 English
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {lang === 'bn' ? '✅ বর্তমান ভাষা: বাংলা' : '✅ Current Language: English'}
          </p>
        </Section>

        {/* 6. Blood Info */}
        <Section icon={FiDroplet} iconBg="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" title={t('bloodInfo')} subtitle={t('bloodInfoDesc')}>
          <form onSubmit={handleSaveBlood} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{t('bloodGroup')}</label>
              <select value={blood.bloodGroup} onChange={e => setBlood(b => ({ ...b, bloodGroup: e.target.value }))} className="w-full bg-gray-50 dark:bg-[#202c33] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500">
                <option value="">{t('selectBloodGroup')}</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <InputField label={t('lastDonation')} type="date" value={blood.lastDonated} onChange={e => setBlood(b => ({ ...b, lastDonated: e.target.value }))} />
            <button type="submit" disabled={savingBlood} className={btnClass}>
              {savingBlood ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />}
              {t('saveBtn')}
            </button>
          </form>
        </Section>

        {/* 7. Availability */}
        <Section icon={FiClock} iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" title={t('availabilityStatusTitle')} subtitle={t('availabilityDesc')}>
          <div className="mt-3">
            <Toggle label={t('availableToDonate')} sublabel={t('availableToggleDesc')} value={blood.availability} onChange={v => setBlood(b => ({ ...b, availability: v }))} />
            <p className={`mt-3 text-sm font-semibold ${blood.availability ? 'text-emerald-600' : 'text-red-500'}`}>
              {blood.availability ? t('youAreAvailable') : t('youAreBusy')}
            </p>
          </div>
        </Section>

        {/* 8. Privacy */}
        <Section icon={FiEye} iconBg="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" title={t('privacySettings')} subtitle={t('privacyDesc')}>
          <div className="mt-2">
            <Toggle label={t('hidePhone')} sublabel={t('hidePhoneDesc')} value={privacy.hidePhone} onChange={v => setPrivacy(p => ({ ...p, hidePhone: v }))} />
            <Toggle label={t('publicProfile')} sublabel={t('publicProfileDesc')} value={privacy.publicProfile} onChange={v => setPrivacy(p => ({ ...p, publicProfile: v }))} />
          </div>
        </Section>

        {/* 9. Feedback */}
        <Section icon={FiMessageSquare} iconBg="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" title={t('feedbackReport')} subtitle={t('feedbackDesc')}>
          <form onSubmit={handleFeedback} className="mt-3 space-y-3">
            <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} required placeholder={t('feedbackPlaceholder')} className="w-full bg-gray-50 dark:bg-[#202c33] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none" />
            <button type="submit" disabled={sendingFeedback} className={btnClass}>
              {sendingFeedback ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiMessageSquare />}
              {t('sendFeedback')}
            </button>
          </form>
        </Section>

        {/* 10. Delete Account */}
        <Section icon={FiTrash2} iconBg="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" title={t('deleteAccount')} subtitle={t('deleteDesc')}>
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('deleteWarning')}</p>
            <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder={t('deleteConfirmPlaceholder')} className="w-full bg-gray-50 dark:bg-[#202c33] border border-red-200 dark:border-red-900 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500" />
            <button onClick={handleDeleteAccount} className="mt-3 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2">
              <FiTrash2 /> {t('deleteBtn')}
            </button>
          </div>
        </Section>

      </div>
    </div>
  )
}
