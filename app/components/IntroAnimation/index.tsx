'use client'

import {useRef, useEffect, useState, useCallback} from 'react'
import {motion, useMotionValue} from 'framer-motion'
import {useRouter} from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {Typography} from './Typography'
import {AudioEngine} from './AudioEngine'
import {playHangDrum} from './hangDrum'
import {useLang} from '@/app/components/LanguageContext'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MousePosition {
  x: number
  y: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DARK_HOLD_MS = 2200
const EMERGENCE_MS = 3500
const NAV_DELAY_MS = DARK_HOLD_MS + 5500

// ─── Content ──────────────────────────────────────────────────────────────────

const zone3Copy = {
  es: {
    tagline:    'no estás sola/o',
    label:      'invisibles',
    para1:      'Un proyecto artístico hispano-portugués que explora la experiencia de las enfermedades invisibles a través del videoarte, la música en directo, la instalación audiovisual y el testimonio en primera persona.',
    para2:      'La obra se sitúa entre el documental experimental, el cine expandido y la performance sonora contemporánea, proponiendo una experiencia perceptiva basada en la escucha, el cuerpo y la emoción. Más que explicar, Invisibles busca hacer sentir.',
    videoArt:   'trailer videoarte',
    perf:       'trailer performativo',
    fullProject:'proyecto completo',
    bio:        'ismael barredo',
  },
  en: {
    tagline:    'you are not alone',
    label:      'invisibles',
    para1:      'A Spanish-Portuguese artistic project exploring the experience of invisible illnesses through video art, live music, audiovisual installation, and first-person testimony.',
    para2:      'The work sits between experimental documentary, expanded cinema, and contemporary sound performance — proposing a perceptual experience based on listening, the body, and emotion. More than explaining, Invisibles seeks to make you feel.',
    videoArt:   'video art trailer',
    perf:       'performative trailer',
    fullProject:'full project',
    bio:        'ismael barredo',
  },
}

// ─── Dynamic import — WebGL must be client-only, never SSR ───────────────────

const Scene3D = dynamic(() => import('./Scene3D').then((m) => m.Scene3D), {ssr: false})

// ─── IntroAnimation ───────────────────────────────────────────────────────────

export function IntroAnimation() {
  const router    = useRouter()
  const {lang}    = useLang()
  const c         = zone3Copy[lang]

  const mouseRef  = useRef<MousePosition>({x: 0, y: 0})

  const scrollProgressRef = useRef<number>(0)
  const emergenceRef      = useRef<number>(0)
  const scrollMV          = useMotionValue(0)

  const audioFadeRef = useRef<(() => void) | null>(null)

  const [audioStarted,  setAudioStarted]  = useState(false)
  const [typoVisible,   setTypoVisible]   = useState(false)
  const [navVisible,    setNavVisible]    = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [lightStage,    setLightStage]    = useState(false)
  const lightStageRef = useRef(false)

  // ── Reset scroll on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  // ── Detect prefers-reduced-motion ─────────────────────────────────────────
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
      setAudioStarted(true)

      const start = performance.now()
      let raf: number
      const tick = () => {
        const elapsed = performance.now() - start
        emergenceRef.current = Math.min(1, elapsed / EMERGENCE_MS)
        if (emergenceRef.current < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)

      const typoTimer = setTimeout(() => setTypoVisible(true), 600)
      const navTimer  = setTimeout(() => setNavVisible(true),  NAV_DELAY_MS - DARK_HOLD_MS)

      return () => {
        cancelAnimationFrame(raf)
        clearTimeout(typoTimer)
        clearTimeout(navTimer)
      }
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
        duration:        2.4,
        easing:          (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel:     true,
        wheelMultiplier: 0.75,
      })
      lenisInstance.scrollTo(0, {immediate: true})

      lenisInstance.on('scroll', ({progress}: {progress: number}) => {
        scrollProgressRef.current = progress
        scrollMV.set(progress)
        if (progress > 0.82 && !lightStageRef.current) {
          lightStageRef.current = true
          setLightStage(true)
        }
      })

      const loop = (time: number) => {
        lenisInstance?.raf(time)
        rafId = requestAnimationFrame(loop)
      }
      rafId = requestAnimationFrame(loop)
    }

    initLenis()
    return () => {
      cancelAnimationFrame(rafId)
      lenisInstance?.destroy()
    }
  }, [scrollMV])

  // ── Navigation with bowl sound ────────────────────────────────────────────
  const navigateWithBowl = useCallback(async (href: string) => {
    audioFadeRef.current?.()
    await playHangDrum()
    router.push(href)
  }, [router])

  // ── Global mouse tracking ─────────────────────────────────────────────────
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
          color: '#e8e4e0', fontFamily: 'Georgia, serif', fontWeight: 300,
          fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', letterSpacing: '0.35em', textTransform: 'lowercase',
        }}>invisibles</h1>
        <p style={{
          color: 'rgba(195, 190, 215, 0.6)', fontFamily: 'Georgia, serif',
          fontStyle: 'italic', fontSize: '0.8rem', letterSpacing: '0.25em',
        }}>{c.tagline}</p>
        <a href="/about" style={{
          color: 'rgba(200, 196, 215, 0.7)', fontFamily: 'Georgia, serif',
          fontSize: '0.75rem', letterSpacing: '0.28em', textDecoration: 'none', textTransform: 'lowercase',
          marginTop: '2rem',
        }}>{c.bio}</a>
      </section>
    )
  }

  return (
    <>
      {/* ── Fixed 3D scene ── */}
      <Scene3D
        mouseRef={mouseRef}
        scrollProgress={scrollProgressRef}
        emergence={emergenceRef}
      />

      {/* ── Fixed typography overlay (fades out at ~45% scroll) ── */}
      <Typography visible={typoVisible} scrollMV={scrollMV} navVisible={navVisible} onNavigate={navigateWithBowl} />

      {/* ── Fixed audio engine + mute button ── */}
      <AudioEngine
        started={audioStarted}
        scrollProgress={scrollProgressRef}
        onRegisterFade={(fn) => { audioFadeRef.current = fn }}
      />

      {/* ── Zone 3: Invisibles presentation ────────────────────────────────────
           Fades in over 6s when scroll passes 0.82.
           Shows the full Invisibles project card with images and video links.
           "ismael barredo" button navigates to bio page.
      ── */}
      <motion.div
        initial={false}
        animate={{
          opacity:         lightStage ? 1 : 0,
          backgroundColor: lightStage ? 'rgba(250, 248, 245, 0.98)' : 'rgba(250, 248, 245, 0)',
        }}
        transition={{ duration: 6, ease: 'easeInOut' }}
        style={{
          position:       'fixed',
          inset:          0,
          zIndex:         20,
          overflowY:      'auto',
          pointerEvents:  lightStage ? 'auto' : 'none',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '3rem 1.5rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={lightStage ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: lightStage ? 2.8 : 0, duration: 3.2, ease: 'easeOut' }}
          style={{
            width:     '100%',
            maxWidth:  '660px',
            display:   'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap:       '2.4rem',
          }}
        >
          {/* ── Tagline ── */}
          <p style={{
            fontFamily:    'Georgia, "Times New Roman", serif',
            fontSize:      'clamp(0.5rem, 0.85vw, 0.6rem)',
            letterSpacing: '0.52em',
            textTransform: 'uppercase',
            color:         'rgba(90, 76, 62, 0.42)',
          }}>
            {c.tagline}
          </p>

          {/* ── Invisibles card ── */}
          <div style={{
            width:           '100%',
            background:      'rgba(255, 254, 251, 0.85)',
            border:          '1px solid rgba(90, 76, 62, 0.1)',
            borderRadius:    '4px',
            padding:         'clamp(1.8rem, 4vw, 2.8rem)',
            boxShadow:       '0 2px 32px rgba(80, 60, 40, 0.06), 0 1px 4px rgba(80, 60, 40, 0.04)',
          }}>

            {/* Label */}
            <p style={{
              fontFamily:    'Georgia, serif',
              fontSize:      '0.56rem',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color:         'rgba(90, 76, 62, 0.38)',
              marginBottom:  '1.4rem',
            }}>
              {c.label}
            </p>

            {/* Description paragraphs */}
            <p style={{
              fontFamily:  'Georgia, "Times New Roman", serif',
              fontSize:    'clamp(0.88rem, 1.4vw, 1.02rem)',
              lineHeight:  1.92,
              color:       'rgba(50, 38, 28, 0.78)',
              marginBottom: '1.1rem',
            }}>
              {c.para1}
            </p>
            <p style={{
              fontFamily:  'Georgia, "Times New Roman", serif',
              fontSize:    'clamp(0.88rem, 1.4vw, 1.02rem)',
              lineHeight:  1.92,
              color:       'rgba(50, 38, 28, 0.78)',
              marginBottom: '2rem',
              fontStyle:   'italic',
            }}>
              {c.para2}
            </p>

            {/* Images */}
            <div style={{
              display:             'grid',
              gridTemplateColumns: '1fr 1fr',
              gap:                 '0.75rem',
              marginBottom:        '2rem',
            }}>
              <div style={{
                position:     'relative',
                aspectRatio:  '4/3',
                overflow:     'hidden',
                borderRadius: '2px',
                background:   'rgba(90,76,62,0.06)',
              }}>
                <Image
                  src="/images/invisibles-1.jpg"
                  alt="Invisibles — performance"
                  fill
                  style={{objectFit: 'cover'}}
                  sizes="(max-width: 660px) 50vw, 300px"
                />
              </div>
              <div style={{
                position:     'relative',
                aspectRatio:  '4/3',
                overflow:     'hidden',
                borderRadius: '2px',
                background:   'rgba(90,76,62,0.06)',
              }}>
                <Image
                  src="/images/invisibles-2.jpg"
                  alt="Invisibles — instalación"
                  fill
                  style={{objectFit: 'cover'}}
                  sizes="(max-width: 660px) 50vw, 300px"
                />
              </div>
            </div>

            {/* Video links */}
            <div style={{
              display:        'flex',
              flexWrap:       'wrap',
              gap:            '2rem',
              alignItems:     'center',
            }}>
              {[
                {label: c.videoArt,    href: 'https://youtu.be/I35ExmFIU8c'},
                {label: c.perf,        href: 'https://www.youtube.com/watch?v=-WrDiiHHN0I'},
                {label: c.fullProject, href: 'https://youtube.com/playlist?list=PLigjdb67OBM8Tv_7iZkoEdnZ69ulqN8J-&si=dMf9DRhr6jAZgpnt'},
              ].map(({label, href}) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily:    'Georgia, serif',
                    fontSize:      '0.58rem',
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color:         'rgba(90, 76, 62, 0.48)',
                    textDecoration: 'none',
                    transition:    'color 0.35s ease',
                    display:       'flex',
                    alignItems:    'center',
                    gap:           '0.4rem',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(60, 46, 34, 0.9)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(90, 76, 62, 0.48)'
                  }}
                >
                  <span style={{fontSize: '0.65rem', opacity: 0.6}}>▶</span>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Bio navigation ── */}
          <button
            onClick={() => navigateWithBowl('/about')}
            style={{
              fontFamily:    'Georgia, "Times New Roman", serif',
              fontSize:      'clamp(0.6rem, 1vw, 0.68rem)',
              letterSpacing: '0.34em',
              textTransform: 'lowercase',
              color:         'rgba(80, 66, 52, 0.45)',
              background:    'none',
              border:        'none',
              cursor:        'pointer',
              padding:       '0.5rem 0',
              transition:    'color 0.4s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(50, 38, 28, 0.85)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(80, 66, 52, 0.45)'
            }}
          >
            {c.bio} →
          </button>
        </motion.div>
      </motion.div>

      {/* ── Accessibility skip link ── */}
      <a
        href="#main-content"
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
        id="main-content"
        aria-hidden="true"
        style={{ height: '500vh', background: '#020204', pointerEvents: 'none' }}
      />
    </>
  )
}
