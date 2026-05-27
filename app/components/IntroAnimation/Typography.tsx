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

const TITLE = 'ismael barredo'

const TEXT = {
  es: {
    subtitle:  'músico · compositor · artista visual · musicoterapeuta · educador social',
    enter:     'entrar',
    bio:        'bio',
    invisibles: 'invisibles',
    musica:     'música',
    scrollHint: 'sumérgete',
  },
  en: {
    subtitle:   'musician · composer · visual artist · music therapist · social educator',
    enter:      'enter',
    bio:        'bio',
    invisibles: 'invisibles',
    musica:     'music',
    scrollHint: 'immerse',
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

  // Scroll indicator fades out the moment scrolling is detected
  const scrollIndicatorOpacity = useTransform(scrollMV, [0, 0.05], [1, 0])

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
        animate={visible ? {opacity: 0.72} : {opacity: 0}}
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
          gap: '2.4rem',
          alignItems: 'center',
          pointerEvents: navVisible ? 'auto' : 'none',
        }}
        aria-label="Site navigation"
      >
        {/* Bio */}
        <motion.button
          onClick={() => onNavigate('/about')}
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.32em',
            textTransform: 'lowercase',
            color: 'rgba(220, 216, 232, 0.82)',
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
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(220, 216, 232, 0.82)'
          }}
        >
          {t.bio}
        </motion.button>

        <span style={{width: '1px', height: '10px', background: 'rgba(195,190,215,0.40)', display: 'block'}} />

        {/* Invisibles */}
        <motion.button
          onClick={() => onNavigate('/invisibles')}
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.32em',
            textTransform: 'lowercase',
            color: 'rgba(220, 216, 232, 0.82)',
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
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(220, 216, 232, 0.82)'
          }}
        >
          {t.invisibles}
        </motion.button>

        <span style={{width: '1px', height: '10px', background: 'rgba(195,190,215,0.40)', display: 'block'}} />

        {/* Música */}
        <motion.button
          onClick={() => onNavigate('/musica')}
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.32em',
            textTransform: 'lowercase',
            color: 'rgba(220, 216, 232, 0.82)',
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
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(220, 216, 232, 0.82)'
          }}
        >
          {t.musica}
        </motion.button>

        <span style={{width: '1px', height: '10px', background: 'rgba(195,190,215,0.40)', display: 'block'}} />

        {/* ── Language toggle ── */}
        <motion.button
          onClick={toggle}
          style={{
            fontSize: '0.58rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(195, 190, 215, 0.58)',
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
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(195, 190, 215, 0.58)'
          }}
          aria-label="Switch language"
        >
          {lang === 'es' ? 'en' : 'es'}
        </motion.button>
      </motion.nav>

      {/* ── Scroll indicator ─────────────────────────────────────────────────
           Sits in flex flow between subtitle and nav.
           Outer div: fades out as soon as scrollMV > 0 (any scroll).
           Inner div: fades in after title settles.
      ── */}
      <motion.div style={{opacity: scrollIndicatorOpacity, pointerEvents: 'none'}}>
        <motion.div
          initial={{opacity: 0}}
          animate={visible ? {opacity: 1} : {opacity: 0}}
          transition={{delay: titleDelay + 2.4, duration: 1.8, ease: 'easeOut'}}
          style={{
            marginTop:     '3.2rem',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:           '10px',
          }}
        >
          {/* Line track with sliding dot */}
          <div style={{
            position:   'relative',
            width:      '1px',
            height:     '44px',
            background: 'rgba(195, 190, 215, 0.12)',
          }}>
            <motion.div
              style={{
                position:     'absolute',
                left:         '-1px',
                width:        '3px',
                height:       '12px',
                borderRadius: '2px',
                background:   'rgba(195, 190, 215, 0.52)',
              }}
              animate={{top: ['0%', '70%', '0%']}}
              transition={{duration: 2.2, repeat: Infinity, ease: [0.45, 0, 0.55, 1]}}
            />
          </div>

          <span style={{
            fontFamily:    'Georgia, serif',
            fontSize:      '0.68rem',
            letterSpacing: '0.38em',
            textTransform: 'lowercase',
            color:         'rgba(195, 190, 215, 0.65)',
          }}>
            {t.scrollHint}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
