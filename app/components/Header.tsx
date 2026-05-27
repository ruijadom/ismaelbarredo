'use client'

import {useEffect, useState} from 'react'
import {usePathname, useRouter} from 'next/navigation'
import {useLang} from '@/app/components/LanguageContext'

// Threshold: past this scrollY we've exited the 500 vh intro spacer
const INTRO_THRESHOLD_VH = 4.85

export default function GlobalHeader() {
  const pathname       = usePathname()
  const router         = useRouter()
  const {lang, toggle} = useLang()

  const isHome      = pathname === '/'
  const isAbout     = pathname === '/about'
  const isProyectos = pathname === '/invisibles'
  const isMusica    = pathname === '/musica'

  // Hide header while the intro animation is scrolling.
  // Initialise as true when on home so the very first render is already hidden —
  // prevents the cream header flash before the dark intro scene takes over.
  const [inIntro, setInIntro] = useState(isHome)

  useEffect(() => {
    if (!isHome) {
      setInIntro(false)
      return
    }
    const check = () => {
      setInIntro(window.scrollY < window.innerHeight * INTRO_THRESHOLD_VH)
    }
    check()
    window.addEventListener('scroll', check, {passive: true})
    return () => window.removeEventListener('scroll', check)
  }, [isHome])

  const headerState = isHome && inIntro ? 'hidden' : 'solid'

  const labels = {
    bio:       lang === 'es' ? 'bio'       : 'bio',
    proyectos: 'invisibles',
    musica:    lang === 'es' ? 'música'    : 'music',
  }

  return (
    <header className="chrome-header" data-state={headerState}>
      <button
        className="chrome-wordmark"
        onClick={() => {
          if (isHome) {
            window.dispatchEvent(new Event('scroll-to-intro'))
          } else {
            router.push('/')
          }
        }}
        aria-label="Ismael Barredo — ir al inicio"
      >
        ismael barredo
      </button>

      {/* Nav */}
      <nav className="chrome-nav">
        <button
          className={'chrome-link' + (isAbout ? ' is-active' : '')}
          onClick={() => router.push('/about')}
        >
          {labels.bio}
        </button>

        <span className="chrome-divider" aria-hidden />

        <button
          className={'chrome-link' + (isProyectos ? ' is-active' : '')}
          onClick={() => router.push('/invisibles')}
        >
          {labels.proyectos}
        </button>

        <span className="chrome-divider" aria-hidden />

        <button
          className={'chrome-link' + (isMusica ? ' is-active' : '')}
          onClick={() => router.push('/musica')}
        >
          {labels.musica}
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
