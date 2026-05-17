import './globals.css'

import type {Metadata} from 'next'
import {LanguageProvider} from '@/app/components/LanguageContext'

export const metadata: Metadata = {
  title: 'invisibles',
  description: 'lo que no se ve, también duele',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
