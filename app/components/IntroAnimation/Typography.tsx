'use client'

import {motion, useTransform, type MotionValue} from 'framer-motion'
import {useLang} from '@/app/components/LanguageContext'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TypographyProps {
  visible: boolean
  scrollMV: MotionValue<number>
  navVisible: boolean
  onNavigate: (href: string) => void
}

interface AnimatedCharProps {
  char: string
  delay: number
  visible: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TITLE = 'invisibles'

const TEXT = {
  es: {
    subtitle: 'lo que no se ve, también duele',
    enter: 'entrar',
    about: 'sobre',
  },
  en: {
    subtitle: 'what you cannot see, still hurts',
    enter: 'enter',
    about: 'about',
  },
} as const

// ─── Single character ─────────────────────────────────────────────────────────
// Each letter flickers into visibility — partial, unstable, then settling.

function AnimatedChar({char, delay, visible}: AnimatedCharProps) {
  return (
    <motion.span
      style={{display: 'inline-block', whiteSpace: 'pre'}}
      initial={{opacity: 0, y: 10, x: 0}}
      animate={
        visible
          ? {
              // Simulates the text almost disappearing before stabilising
              opacity: [0, 0.15, 0.05, 0.55, 0.3, 0.85, 0.5, 1],
              y: [10, 5, 8, 2, 5, 1, 2, 0],
              x: [1, -1.5, 2, -1, 0.5, -0.5, 0.2, 0],
            }
          : {opacity: 0, y: 10}
      }
      transition={{
        delay,
        duration: 4.2,
        ease: 'easeOut',
        times: [0, 0.08, 0.18, 0.38, 0.52, 0.7, 0.86, 1],
      }}
    >
      {char}
    </motion.span>
  )
}

// ─── Main Typography Component ────────────────────────────────────────────────

export function Typography({visible, scrollMV, navVisible, onNavigate}: TypographyProps) {
  const {lang, toggle} = useLang()
  const t = TEXT[lang]

  // Fade the entire overlay out as the user scrolls into the site
  const opacity = useTransform(scrollMV, [0, 0.45], [1, 0])

  const titleDelay = TITLE.length * 0.07

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10,
        opacity,
      }}
    >
      {/* ── Title ── */}
      <h1
        aria-label={TITLE}
        style={{
          fontSize: 'clamp(1.8rem, 4.5vw, 4rem)',
          fontWeight: 300,
          letterSpacing: '0.35em',
          textTransform: 'lowercase',
          color: 'rgba(232, 228, 224, 0.94)',
          fontFamily: 'Georgia, "Times New Roman", serif',
          marginBottom: '1.8rem',
          lineHeight: 1.3,
          textAlign: 'center',
        }}
      >
        {TITLE.split('').map((char, i) => (
          <AnimatedChar key={i} char={char === ' ' ? ' ' : char} delay={i * 0.07 + 0.4} visible={visible} />
        ))}
      </h1>

      {/* ── Subtitle ── */}
      <motion.p
        key={lang}
        initial={{opacity: 0}}
        animate={visible ? {opacity: 0.42} : {opacity: 0}}
        transition={{delay: titleDelay + 1.4, duration: 3.0, ease: 'easeOut'}}
        style={{
          fontSize: 'clamp(0.65rem, 1.4vw, 0.85rem)',
          letterSpacing: '0.28em',
          textTransform: 'lowercase',
          color: 'rgba(195, 190, 215, 0.9)',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        {t.subtitle}
      </motion.p>

      {/* ── Navigation links — fade in after typography settles ── */}
      <motion.nav
        initial={{opacity: 0, y: 12}}
        animate={navVisible ? {opacity: 1, y: 0} : {opacity: 0, y: 12}}
        transition={{duration: 1.8, ease: 'easeOut'}}
        style={{
          position: 'absolute',
          bottom: '3.5rem',
          display: 'flex',
          gap: '3rem',
          alignItems: 'center',
          pointerEvents: navVisible ? 'auto' : 'none',
        }}
        aria-label="Site navigation"
      >
        <motion.button
          onClick={() => onNavigate('/about')}
          whileHover={{opacity: 1}}
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.32em',
            textTransform: 'lowercase',
            color: 'rgba(200, 196, 215, 0.55)',
            fontFamily: 'Georgia, "Times New Roman", serif',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'color 0.4s ease',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(232, 228, 224, 0.9)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(200, 196, 215, 0.55)'
          }}
        >
          {t.about}
        </motion.button>

        {/* ── Language toggle ── */}
        <motion.button
          onClick={toggle}
          style={{
            fontSize: '0.58rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(195, 190, 215, 0.35)',
            fontFamily: 'Georgia, "Times New Roman", serif',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'color 0.4s ease',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(195, 190, 215, 0.7)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(195, 190, 215, 0.35)'
          }}
          aria-label="Switch language"
        >
          {lang === 'es' ? 'en' : 'es'}
        </motion.button>
      </motion.nav>

      {/* ── Scroll hint — pulses while nav is not yet visible ── */}
      <motion.div
        initial={{opacity: 0}}
        animate={visible && !navVisible ? {opacity: [0, 0, 0.4, 0.2, 0.4]} : {opacity: 0}}
        transition={{
          delay: titleDelay + 2.8,
          duration: 4,
          repeat: navVisible ? 0 : Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          bottom: '3.5rem',
          fontSize: '0.58rem',
          letterSpacing: '0.35em',
          color: 'rgba(195, 190, 215, 0.5)',
          textTransform: 'uppercase',
          fontFamily: 'Georgia, serif',
        }}
      >
        {t.enter}
      </motion.div>
    </motion.div>
  )
}
