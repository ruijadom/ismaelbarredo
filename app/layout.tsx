import './globals.css'

import type {Metadata} from 'next'
import {Cormorant_Garamond} from 'next/font/google'
import {LanguageProvider} from '@/app/components/LanguageContext'
import GlobalHeader from '@/app/components/Header'

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '500'],
  style:    ['normal', 'italic'],
  variable: '--font-cormorant',
  display:  'swap',
})

export const metadata: Metadata = {
  title:       'invisibles',
  description: 'lo que no se ve, también duele',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={cormorant.variable}>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <GlobalHeader />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
