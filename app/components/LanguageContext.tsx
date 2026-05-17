'use client'

import {createContext, useContext, useState, type ReactNode} from 'react'

export type Lang = 'es' | 'en'

interface LanguageContextValue {
  lang: Lang
  toggle: () => void
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  toggle: () => {},
})

export function LanguageProvider({children}: {children: ReactNode}) {
  const [lang, setLang] = useState<Lang>('es')
  const toggle = () => setLang((l) => (l === 'es' ? 'en' : 'es'))
  return (
    <LanguageContext.Provider value={{lang, toggle}}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
