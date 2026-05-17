'use client'

import {useEffect, useState} from 'react'
import {usePathname, useRouter} from 'next/navigation'
import {useLang} from '@/app/components/LanguageContext'

// Header state: hidden (top of intro) → overlay (over dark 3D) → solid (editorial content)
// Home page uses 500vh spacer; editorial content begins after innerHeight * 5.

type HeaderState = 'hidden' | 'overlay' | 'solid'

export default function GlobalHeader() {
  const pathname          = usePathname()
  const router            = useRouter()
  const {lang, toggle}    = useLang()

  const [scrollY, setScrollY] = useState(0)
  const [vh,      setVh]      = useState(800)

  useEffect(() => {
    const update = () => {
      setScrollY(window.scrollY)
      setVh(window.innerHeight)
    }
    update()
    window.addEventListener('scroll', update, {passive: true})
    window.addEventListener('resize', update, {passive: true})
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // Compute header state
  let state: HeaderState
  if (pathname !== '/') {
    state = 'solid'
  } else {
    // on home: 500vh spacer → editorial content after 5 * vh
    const inEditorial = scrollY > vh * 4.85
    if (inEditorial) {
      state = 'solid'
    } else if (scrollY < vh * 0.3) {
      state = 'hidden'
    } else {
      state = 'overlay'
    }
  }

  const isHome  = pathname === '/'
  const isAbout = pathname === '/about'

  const labels = {
    obra:  lang === 'es' ? 'obra'  : 'work',
    sobre: lang === 'es' ? 'sobre' : 'about',
  }

  return (
    <header className="chrome-header" data-state={state}>
      {/* Wordmark */}
      <button
        className="chrome-wordmark"
        onClick={() => { router.push('/') }}
        aria-label="Invisibles — ir al inicio"
      >
        invisibles
      </button>

      {/* Nav */}
      <nav className="chrome-nav">
        <button
          className={'chrome-link' + (isHome ? ' is-active' : '')}
          onClick={() => router.push('/')}
        >
          {labels.obra}
        </button>

        <span className="chrome-divider" aria-hidden />

        <button
          className={'chrome-link' + (isAbout ? ' is-active' : '')}
          onClick={() => router.push('/about')}
        >
          {labels.sobre}
        </button>

        <span className="chrome-divider" aria-hidden />

        <button
          className="chrome-link chrome-link--upper"
          onClick={toggle}
          aria-label="Cambiar idioma"
        >
          {lang === 'es' ? 'en' : 'es'}
        </button>
      </nav>
    </header>
  )
}
