'use client'

import {useEffect, useState, useCallback} from 'react'
import {usePathname, useRouter} from 'next/navigation'
import {useLang} from '@/app/components/LanguageContext'

const INTRO_THRESHOLD_VH = 4.85

export default function GlobalHeader() {
  const pathname       = usePathname()
  const router         = useRouter()
  const {lang, toggle} = useLang()

  const isHome      = pathname === '/'
  const isAbout     = pathname === '/about'
  const isProyectos = pathname === '/invisibles'
  const isMusica    = pathname === '/musica'

  const [inIntro,   setInIntro]   = useState(isHome)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [menuReady, setMenuReady] = useState(false)  // triggers fade-in after mount

  useEffect(() => {
    if (!isHome) { setInIntro(false); return }
    const check = () => setInIntro(window.scrollY < window.innerHeight * INTRO_THRESHOLD_VH)
    check()
    window.addEventListener('scroll', check, {passive: true})
    return () => window.removeEventListener('scroll', check)
  }, [isHome])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [menuOpen])

  // Close on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const openMenu = useCallback(() => {
    setMenuOpen(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setMenuReady(true)))
  }, [])

  const closeMenu = useCallback(() => {
    setMenuReady(false)
    setTimeout(() => setMenuOpen(false), 380)
  }, [])

  const navigate = useCallback((href: string) => {
    closeMenu()
    setTimeout(() => router.push(href), 380)
  }, [closeMenu, router])

  const headerState = isHome && inIntro ? 'hidden' : 'solid'

  const labels = {
    bio:       'bio',
    proyectos: 'invisibles',
    musica:    lang === 'es' ? 'música' : 'music',
  }

  return (
    <>
      <header className="chrome-header" data-state={headerState}>
        {/* Wordmark */}
        <button
          className="chrome-wordmark"
          onClick={() => {
            if (isHome) window.dispatchEvent(new Event('scroll-to-intro'))
            else router.push('/')
          }}
          aria-label="Ismael Barredo — ir al inicio"
        >
          ismael barredo
        </button>

        {/* Desktop nav */}
        <nav className="chrome-nav">
          <button className={'chrome-link' + (isAbout     ? ' is-active' : '')} onClick={() => router.push('/about')}>{labels.bio}</button>
          <span className="chrome-divider" aria-hidden />
          <button className={'chrome-link' + (isProyectos ? ' is-active' : '')} onClick={() => router.push('/invisibles')}>{labels.proyectos}</button>
          <span className="chrome-divider" aria-hidden />
          <button className={'chrome-link' + (isMusica    ? ' is-active' : '')} onClick={() => router.push('/musica')}>{labels.musica}</button>
          <span className="chrome-divider" aria-hidden />
          <button className="chrome-link chrome-link--upper" onClick={toggle} aria-label="Cambiar idioma">
            {lang === 'es' ? 'en' : 'es'}
          </button>
        </nav>

        {/* Hamburger — mobile only */}
        <button
          className="chrome-hamburger"
          onClick={openMenu}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span className="chrome-hamburger__line" />
          <span className="chrome-hamburger__line" />
          <span className="chrome-hamburger__line" />
        </button>
      </header>

      {/* Full-screen mobile menu overlay */}
      {menuOpen && (
        <div
          className={'mobile-menu' + (menuReady ? ' mobile-menu--open' : '')}
          onClick={closeMenu}
          aria-modal="true"
          role="dialog"
        >
          {/* Close button */}
          <button
            className="mobile-menu__close"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >×</button>

          {/* Links */}
          <nav className="mobile-menu__nav" onClick={e => e.stopPropagation()}>
            <button
              className={'mobile-menu__link' + (isAbout     ? ' is-active' : '')}
              onClick={() => navigate('/about')}
              style={{transitionDelay: menuReady ? '120ms' : '0ms'}}
            >{labels.bio}</button>

            <button
              className={'mobile-menu__link' + (isProyectos ? ' is-active' : '')}
              onClick={() => navigate('/invisibles')}
              style={{transitionDelay: menuReady ? '180ms' : '0ms'}}
            >{labels.proyectos}</button>

            <button
              className={'mobile-menu__link' + (isMusica    ? ' is-active' : '')}
              onClick={() => navigate('/musica')}
              style={{transitionDelay: menuReady ? '240ms' : '0ms'}}
            >{labels.musica}</button>

            <button
              className="mobile-menu__lang"
              onClick={() => { toggle(); closeMenu() }}
              style={{transitionDelay: menuReady ? '300ms' : '0ms'}}
            >{lang === 'es' ? 'en' : 'es'}</button>
          </nav>
        </div>
      )}
    </>
  )
}
