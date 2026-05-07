import { useLanguage } from '../context/LanguageContext'
import { FiMessageSquare, FiMail, FiPhone } from 'react-icons/fi'

export default function HelpPage() {
  const { lang, t } = useLanguage()

  const faqs = lang === 'bn' ? [
    ['কিভাবে ডোনার হওয়া যায়?', '"Donor Register" বাটনে ক্লিক করে নাম, ইমেইল, পাসওয়ার্ড ও রক্তের তথ্য দিয়ে নিবন্ধন করুন।'],
    ['কিভাবে ডোনার খুঁজবো?', '"Find Donors" পেজে গিয়ে রক্তের গ্রুপ ও এলাকা দিয়ে সার্চ করুন।'],
    ['পাসওয়ার্ড ভুলে গেলে কী করবো?', 'Settings → Change Password এ গিয়ে পুরাতন পাসওয়ার্ড দিয়ে নতুন পাসওয়ার্ড সেট করুন।'],
    ['সার্চে আমার প্রোফাইল দেখাচ্ছে না কেন?', 'Settings → Availability Status এ গিয়ে "Available to Donate" চালু করুন।'],
    ['অ্যাকাউন্ট মুছতে চাইলে কী করতে হবে?', 'Settings → Delete Account এ গিয়ে "DELETE" লিখে নিশ্চিত করুন।'],
    ['ডোনারের সাথে কীভাবে যোগাযোগ করবো?', 'ডোনারের প্রোফাইলে ঢুকে কল, WhatsApp বা Email বাটন ব্যবহার করুন।'],
    ['ব্লাড ব্যাংক কোথায় পাবো?', 'Sidebar থেকে "Blood Banks" মেনুতে ক্লিক করুন।'],
    ['অ্যাডমিন প্যানেল কে ব্যবহার করতে পারবে?', 'শুধুমাত্র ADMIN রোলের অ্যাকাউন্ট থেকে Admin Panel ব্যবহার করা যাবে।'],
  ] : [
    ['How to become a donor?', 'Click "Donor Register" and fill in your name, email, password, and blood information.'],
    ['How to find a donor?', 'Go to "Find Donors" page and search by blood group and location.'],
    ['What if I forget my password?', 'Go to Settings → Change Password and set a new password using your old one.'],
    ['Why is my profile not showing in search?', 'Go to Settings → Availability Status and enable "Available to Donate".'],
    ['How to delete my account?', 'Go to Settings → Delete Account and type "DELETE" to confirm.'],
    ['How to contact a donor?', 'Open the donor\'s profile and use the Call, WhatsApp, or Email buttons.'],
    ['Where can I find blood banks?', 'Click "Blood Banks" in the sidebar menu.'],
    ['Who can use the Admin Panel?', 'Only accounts with the ADMIN role can access the Admin Panel.'],
  ]

  return (
    <div className="max-w-2xl mx-auto pb-16 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xl">
            <FiMessageSquare />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-black text-gray-900 dark:text-white">{t('helpSupport')}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('helpDesc')}</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-3 mb-8">
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
          FAQ
        </h2>
        {faqs.map(([q, a]) => (
          <div key={q} className="bg-white dark:bg-[#111b21] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm transition-colors">
            <p className="font-semibold text-gray-800 dark:text-gray-200 flex items-start gap-2">
              <span className="text-sky-500 mt-0.5">❓</span> {q}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 pl-6">{a}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="bg-white dark:bg-[#111b21] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-colors">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiMessageSquare className="text-orange-500" />
          {lang === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
        </h2>
        <div className="space-y-3">
          <a href="mailto:support@bloodfinder.com" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#202c33] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
            <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
              <FiMail />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'bn' ? 'ইমেইল' : 'Email'}</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors">support@bloodfinder.com</p>
            </div>
          </a>
          <a href="tel:+8801700000000" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#202c33] hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group">
            <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-500 flex items-center justify-center">
              <FiPhone />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'bn' ? 'ফোন' : 'Phone'}</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-green-600 transition-colors">+880 1700-000000</p>
            </div>
          </a>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-900/30">
          <p className="text-xs text-sky-700 dark:text-sky-400">
            {lang === 'bn'
              ? '📌 Team: Code Cube | Khwaja Yunus Ali University'
              : '📌 Team: Code Cube | Khwaja Yunus Ali University'}
          </p>
        </div>
      </div>
    </div>
  )
}
