'use client'

import {useRef, useEffect, useState, useCallback} from 'react'
import {motion, useMotionValue} from 'framer-motion'
import {useRouter} from 'next/navigation'
import dynamic from 'next/dynamic'
import {Typography} from './Typography'
import {Scene3DErrorBoundary} from './Scene3DErrorBoundary'
import {useLang} from '@/app/components/LanguageContext'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MousePosition { x: number; y: number }

// ─── Constants ────────────────────────────────────────────────────────────────

const DARK_HOLD_MS = 2200
const EMERGENCE_MS = 3500
const NAV_DELAY_MS = DARK_HOLD_MS + 2800   // nav links appear ~5 s after load (was 7.7 s)

// ─── Dynamic import (WebGL client-only) ──────────────────────────────────────

const Scene3D = dynamic(() => import('./Scene3D').then((m) => m.Scene3D), {ssr: false})

// ─── IntroAnimation ───────────────────────────────────────────────────────────
// Renders the 500 vh immersive 3D scroll journey.
// After scroll, the cream transition (Zone 3) dissolves into the
// InvisiblesContent sections that live below this component in app/page.tsx.

export function IntroAnimation() {
  const router  = useRouter()
  const {lang}  = useLang()

  const mouseRef          = useRef<MousePosition>({x: 0, y: 0})
  const scrollProgressRef = useRef<number>(0)
  const emergenceRef      = useRef<number>(0)
  const scrollMV          = useMotionValue(0)
  const lenisRef          = useRef<import('lenis').default | null>(null)
  const navTimeoutRef     = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [typoVisible,   setTypoVisible]   = useState(false)
  const [navVisible,    setNavVisible]    = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [lightStage,    setLightStage]    = useState(false)
  const lightStageRef = useRef(false)

  const tagline = lang === 'es' ? 'músico · compositor · artista visual · musicoterapeuta · educador social' : 'musician · composer · visual artist · music therapist · social educator'

  // ── Reset scroll on mount ─────────────────────────────────────────────────
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  // ── prefers-reduced-motion ────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
  }, [])

  // ── Phase sequencer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) {
      emergenceRef.current = 1
      setTypoVisible(true)
      setNavVisible(true)
      return
    }
    const holdTimer = setTimeout(() => {
      const start = performance.now()
      let raf: number
      const tick = () => {
        emergenceRef.current = Math.min(1, (performance.now() - start) / EMERGENCE_MS)
        if (emergenceRef.current < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      const typoTimer = setTimeout(() => setTypoVisible(true), 600)
      const navTimer  = setTimeout(() => setNavVisible(true),  NAV_DELAY_MS - DARK_HOLD_MS)
      return () => { cancelAnimationFrame(raf); clearTimeout(typoTimer); clearTimeout(navTimer) }
    }, DARK_HOLD_MS)
    return () => clearTimeout(holdTimer)
  }, [reducedMotion])

  // ── Lenis smooth scroll ───────────────────────────────────────────────────
  useEffect(() => {
    let lenisInstance: import('lenis').default | null = null
    let rafId: number

    const initLenis = async () => {
      const {default: Lenis} = await import('lenis')
      lenisInstance = new Lenis({
        duration: 2.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.75,
      })
      lenisRef.current = lenisInstance
      lenisInstance.scrollTo(0, {immediate: true})

      lenisInstance.on('scroll', ({scroll}: {scroll: number}) => {
        // ── Intro progress — relative to the 500 vh spacer only ──────────────
        // Spacer height = 500 vh; max scrollable within spacer = 4 × innerHeight
        // (viewport = 1 vh, so last visible row of spacer is at scrollY = 4 × vh)
        const spacerMax     = window.innerHeight * 4
        const introProgress = Math.min(1, Math.max(0, scroll / spacerMax))

        scrollProgressRef.current = introProgress
        scrollMV.set(introProgress)

        // ── Zone 3 forward — cream dissolve at 66 % of intro journey (~330 vh)
        // Lock scroll immediately and navigate to /about once cream is established.
        if (introProgress > 0.66 && !lightStageRef.current) {
          lightStageRef.current = true
          setLightStage(true)
          lenisInstance?.stop()
          navTimeoutRef.current = setTimeout(() => {
            router.push('/about')
          }, 2400) // cream fade (2 s) + 400 ms buffer
        }

        // ── Zone 3 reverse — cancel navigation if user scrolls back below 55 %
        if (introProgress < 0.55 && lightStageRef.current) {
          lightStageRef.current = false
          setLightStage(false)
          if (navTimeoutRef.current !== null) {
            clearTimeout(navTimeoutRef.current)
            navTimeoutRef.current = null
          }
          lenisInstance?.start()
        }
      })

      const loop = (time: number) => { lenisInstance?.raf(time); rafId = requestAnimationFrame(loop) }
      rafId = requestAnimationFrame(loop)
    }
    initLenis()
    return () => {
      cancelAnimationFrame(rafId)
      lenisInstance?.destroy()
      if (navTimeoutRef.current !== null) clearTimeout(navTimeoutRef.current)
    }
  }, [scrollMV])

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigateWithBowl = useCallback((href: string) => {
    router.push(href)
  }, [router])

  // ── Logo "scroll to intro top" event ─────────────────────────────────────
  useEffect(() => {
    const handler = () => lenisRef.current?.scrollTo(0, {duration: 1.6})
    window.addEventListener('scroll-to-intro', handler)
    return () => window.removeEventListener('scroll-to-intro', handler)
  }, [])

  // ── Mouse tracking ────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }
    window.addEventListener('mousemove', onMove, {passive: true})
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── Reduced-motion fallback ───────────────────────────────────────────────
  if (reducedMotion) {
    return (
      <section style={{
        position: 'relative', width: '100vw', height: '100vh',
        background: '#020204', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
      }}>
        <h1 style={{
          color: '#e8e4e0', fontFamily: 'var(--serif)', fontWeight: 300,
          fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', letterSpacing: '0.35em', textTransform: 'lowercase',
        }}>ismael barredo</h1>
        <p style={{
          color: 'rgba(195, 190, 215, 0.6)', fontFamily: 'var(--serif)',
          fontStyle: 'italic', fontSize: '0.8rem', letterSpacing: '0.25em',
        }}>{tagline}</p>
      </section>
    )
  }

  return (
    <>
      {/* ── Fixed 3D scene (wrapped in error boundary for WebGL failures) ── */}
      <Scene3DErrorBoundary>
        <Scene3D mouseRef={mouseRef} scrollProgress={scrollProgressRef} emergence={emergenceRef} />
      </Scene3DErrorBoundary>

      {/* ── Fixed typography overlay (fades at ~45% scroll) ── */}
      <Typography
        visible={typoVisible}
        scrollMV={scrollMV}
        navVisible={navVisible}
        onNavigate={navigateWithBowl}
      />

      {/* ── Zone 3: cream dissolve transition ─────────────────────────────────
           Fades in at 82 % of the 500 vh intro scroll.
           Acts as a seamless visual bridge into the cream editorial content below.
           Does NOT re-appear when scrolling back up from content — the 3D animation
           with title is visible instead, giving a natural bidirectional experience.
           Resets if the user scrolls all the way back below 70 % of intro.
      ── */}
      <motion.div
        initial={false}
        animate={{opacity: lightStage ? 1 : 0}}
        transition={{duration: lightStage ? 2.0 : 0.6, ease: 'easeInOut'}}
        style={{
          position:        'fixed',
          inset:           0,
          zIndex:          20,
          backgroundColor: 'rgba(244, 241, 234, 0.97)',
          pointerEvents:   'none',
        }}
      />

      {/* ── Accessibility skip link ── */}
      <a
        href="#ismael-content"
        style={{
          position: 'fixed', top: '-9999px', left: '1rem',
          zIndex: 300, color: '#e8e4e0', background: '#020204', padding: '0.5rem 1rem',
        }}
        onFocus={e  => { (e.currentTarget as HTMLAnchorElement).style.top = '1rem' }}
        onBlur={e   => { (e.currentTarget as HTMLAnchorElement).style.top = '-9999px' }}
      >
        Saltar al contenido
      </a>

      {/* ── 500 vh scroll spacer — full camera journey ── */}
      <div
        aria-hidden="true"
        style={{height: '500vh', background: '#020204', pointerEvents: 'none'}}
      />
    </>
  )
}
