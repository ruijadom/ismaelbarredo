import './globals.css'

import type {Metadata} from 'next'
import {Cormorant_Garamond} from 'next/font/google'
import {LanguageProvider} from '@/app/components/LanguageContext'
import GlobalHeader from '@/app/components/Header'
import {AudioPlayer} from '@/app/components/AudioPlayer'

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '500'],
  style:    ['normal', 'italic'],
  variable: '--font-cormorant',
  display:  'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ismaelbarredo.com'),
  title:       'ismael barredo',
  description: 'Músico · Compositor · Artista Visual · Musicoterapeuta · Educador Social',
  openGraph: {
    title:       'ismael barredo',
    description: 'Músico · Compositor · Artista Visual · Musicoterapeuta · Educador Social',
    url:         'https://ismaelbarredo.com',
    siteName:    'ismael barredo',
    images: [
      {
        url:    '/images/share-image.png',
        width:  1200,
        height: 630,
        alt:    'ismael barredo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'ismael barredo',
    description: 'Músico · Compositor · Artista Visual · Musicoterapeuta · Educador Social',
    images:      ['/images/share-image.png'],
  },
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={cormorant.variable}>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <GlobalHeader />
          <AudioPlayer />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
