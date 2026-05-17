'use client'

import Link from 'next/link'
import {useLang} from '@/app/components/LanguageContext'

export default function Header() {
  const {lang, toggle} = useLang()

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-10 py-6 bg-[#faf8f5]/85 backdrop-blur-md border-b border-[rgba(90,76,62,0.07)]">
      <Link
        href="/"
        className="font-serif text-[0.9rem] tracking-[0.22em] lowercase text-[rgba(40,32,28,0.85)] no-underline"
      >
        invisibles
      </Link>

      <nav className="flex items-center gap-8">
        <Link
          href="/about"
          className="font-serif text-[0.72rem] tracking-[0.28em] lowercase text-[rgba(80,66,52,0.65)] no-underline hover:text-[rgba(40,32,28,0.85)] transition-colors duration-300"
        >
          {lang === 'es' ? 'sobre' : 'about'}
        </Link>

        <button
          onClick={toggle}
          className="font-serif text-[0.62rem] tracking-[0.28em] uppercase text-[rgba(90,76,62,0.38)] hover:text-[rgba(90,76,62,0.75)] transition-colors duration-300 bg-transparent border-none cursor-pointer p-0"
          aria-label="Switch language"
        >
          {lang === 'es' ? 'en' : 'es'}
        </button>
      </nav>
    </header>
  )
}
