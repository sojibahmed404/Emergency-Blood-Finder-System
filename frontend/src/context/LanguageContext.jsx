import { createContext, useContext, useState } from 'react'
import translations from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('bf_lang') || 'bn')

  function switchLang(newLang) {
    setLang(newLang)
    localStorage.setItem('bf_lang', newLang)
  }

  function t(key) {
    return translations[lang]?.[key] || translations['en']?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
