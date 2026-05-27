'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {usePathname} from 'next/navigation'

// ─── Track map ────────────────────────────────────────────────────────────────

const TRACKS: Record<string, string> = {
  '/':           '/audio/portada.mp3',
  '/invisibles': '/audio/invisibles.mp3',
  '/musica':     '/audio/musica.mp3',
}

const STORAGE_KEY    = 'ismael-audio'   // 'on' | 'off'
const TARGET_VOLUME  = 0.28
const FADE_MS        = 1400
const FADE_STEP_MS   = 40

// ─── AudioPlayer ──────────────────────────────────────────────────────────────

export function AudioPlayer() {
  const pathname  = usePathname()
  const audioRef  = useRef<HTMLAudioElement | null>(null)

  // playing = audio is running (or trying to)
  // ready   = user has interacted / autoplay succeeded
  const [playing,  setPlaying]  = useState(false)
  const [ready,    setReady]    = useState(false)   // false = blocked, show hint

  const prevTrack  = useRef<string | null>(null)
  const fadeTimer  = useRef<ReturnType<typeof setInterval> | null>(null)
  const isDark     = pathname === '/'

  // ── Fade helpers ─────────────────────────────────────────────────────────

  const stopFade = useCallback(() => {
    if (fadeTimer.current !== null) { clearInterval(fadeTimer.current); fadeTimer.current = null }
  }, [])

  const fadeIn = useCallback((audio: HTMLAudioElement, to = TARGET_VOLUME) => {
    stopFade()
    const steps = FADE_MS / FADE_STEP_MS
    const step  = to / steps
    fadeTimer.current = setInterval(() => {
      if (audio.volume + step < to) { audio.volume += step }
      else { audio.volume = to; stopFade() }
    }, FADE_STEP_MS)
  }, [stopFade])

  const fadeOut = useCallback((audio: HTMLAudioElement, then?: () => void) => {
    stopFade()
    const step = (audio.volume || TARGET_VOLUME) / (FADE_MS / FADE_STEP_MS)
    fadeTimer.current = setInterval(() => {
      if (audio.volume > step) { audio.volume -= step }
      else { audio.volume = 0; audio.pause(); stopFade(); then?.() }
    }, FADE_STEP_MS)
  }, [stopFade])

  // ── Load + play a src ─────────────────────────────────────────────────────

  const loadAndPlay = useCallback((src: string) => {
    const audio = audioRef.current
    if (!audio) return
    audio.src   = src
    audio.loop  = true
    audio.volume = 0
    audio.load()
    audio.play()
      .then(() => { fadeIn(audio); setPlaying(true); setReady(true) })
      .catch(() => { /* blocked — user must click */ })
  }, [fadeIn])

  // ── On mount: attempt autoplay using saved preference ─────────────────────
  // Start with volume=0 to maximise browser autoplay compatibility.
  // Most browsers allow volume=0 autoplay; we fade in once play() resolves.

  useEffect(() => {
    const pref    = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    const wantOn  = pref !== 'off'   // default on for new visitors
    const src     = TRACKS[pathname]
    if (!src || !wantOn) return
    prevTrack.current = src
    loadAndPlay(src)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])   // mount only

  // ── Route changes: swap track, preserve play state ────────────────────────

  useEffect(() => {
    const audio = audioRef.current
    const src   = TRACKS[pathname] ?? null

    if (!ready) return   // not started yet — nothing to swap

    if (!src) {
      // Page has no dedicated track — keep playing whatever is already running
      return
    }

    if (prevTrack.current === src) return   // same track, keep going
    prevTrack.current = src

    if (!audio) return

    if (!audio.paused) {
      // Currently playing → cross-fade
      fadeOut(audio, () => loadAndPlay(src))
    } else if (playing) {
      // Was playing before (e.g. came back from /about) → resume
      loadAndPlay(src)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // ── Persist preference whenever playing changes ───────────────────────────

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(STORAGE_KEY, playing ? 'on' : 'off')
  }, [playing, ready])

  // ── Cleanup ───────────────────────────────────────────────────────────────

  useEffect(() => () => stopFade(), [stopFade])

  // ── Toggle ────────────────────────────────────────────────────────────────

  const toggle = useCallback(() => {
    const audio = audioRef.current
    const src   = TRACKS[pathname]
    if (!audio) return

    if (!ready) {
      // Autoplay was blocked — first manual click starts it
      const trackToPlay = src ?? prevTrack.current ?? TRACKS['/']
      prevTrack.current = trackToPlay
      loadAndPlay(trackToPlay)
      setReady(true)
      return
    }

    if (audio.paused) {
      if (src && audio.src !== new URL(src, window.location.href).href) {
        loadAndPlay(src)
      } else {
        audio.play().catch(() => {})
        fadeIn(audio)
        setPlaying(true)
      }
    } else {
      fadeOut(audio, () => setPlaying(false))
    }
  }, [ready, pathname, loadAndPlay, fadeIn, fadeOut])

  // ─── Render ───────────────────────────────────────────────────────────────

  const dimColor   = isDark ? 'rgba(210,206,228,0.60)' : 'var(--ink-faint)'
  const hoverColor = isDark ? 'rgba(232,228,244,0.90)' : 'var(--ink-soft)'

  return (
    <>
      <audio ref={audioRef} preload="none" />

      <button
        onClick={toggle}
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
        style={{
          position:   'fixed',
          bottom:     'clamp(28px, 3vw, 44px)',
          right:      'var(--gutter)',
          zIndex:     90,
          background: 'none',
          border:     'none',
          cursor:     'pointer',
          padding:    '8px',
          display:    'flex',
          alignItems: 'center',
          gap:        '7px',
          color:      dimColor,
          transition: 'color 300ms ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = hoverColor }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = dimColor }}
      >
        {playing ? <AudioBars /> : <PlayIcon />}
        <span style={{
          fontFamily:    'var(--serif)',
          fontSize:      '0.58rem',
          letterSpacing: '0.32em',
          textTransform: 'lowercase',
        }}>
          audio
        </span>
      </button>
    </>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
      <path d="M0 0 L10 6 L0 12 Z" />
    </svg>
  )
}

function AudioBars() {
  return (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="currentColor">
      <style>{`
        @keyframes ab1{0%,100%{height:4px;y:4.5px}50%{height:13px;y:0}}
        @keyframes ab2{0%,100%{height:9px;y:2px}50%{height:4px;y:4.5px}}
        @keyframes ab3{0%,100%{height:6px;y:3.5px}50%{height:11px;y:1px}}
        @keyframes ab4{0%,100%{height:11px;y:1px}50%{height:5px;y:4px}}
        .ab1{animation:ab1 1.1s ease-in-out infinite}
        .ab2{animation:ab2 1.1s ease-in-out infinite .2s}
        .ab3{animation:ab3 1.1s ease-in-out infinite .4s}
        .ab4{animation:ab4 1.1s ease-in-out infinite .15s}
      `}</style>
      <rect className="ab1" x="0"  width="2.5" rx="1" />
      <rect className="ab2" x="4"  width="2.5" rx="1" />
      <rect className="ab3" x="8"  width="2.5" rx="1" />
      <rect className="ab4" x="12" width="2"   rx="1" />
    </svg>
  )
}
