'use client'

import {useEffect, useRef, useState} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AudioEngineProps {
  scrollProgress:  React.MutableRefObject<number>
  inContent?:      boolean
  onRegisterFade?: (fadeOut: () => void) => void
}

// ─── Audio concept ────────────────────────────────────────────────────────────
//
//  ON LOAD      → Hopeful A-major pad plays (calm, open, luminous).
//                 Starts the moment the user first interacts (scroll / click).
//
//  SCROLLING    → As introProgress rises (0→1), the pad fades progressively
//                 to silence. The journey into darkness is also a journey
//                 into silence — what hurts cannot always be heard.
//
//  IN CONTENT   → Calm sea with breaking waves washes in slowly.
//                 Stillness after the journey.

// ─── Pink-noise buffer source ─────────────────────────────────────────────────

function makePinkNoise(ctx: AudioContext, duration = 5): AudioBufferSourceNode {
  const len = ctx.sampleRate * duration
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d   = buf.getChannelData(0)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1
    b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759
    b2 = 0.96900*b2 + w*0.1538520; b3 = 0.86650*b3 + w*0.3104856
    b4 = 0.55000*b4 + w*0.5329522; b5 = -0.7616*b5 - w*0.0168980
    d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + w * 0.5362) * 0.10
  }
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop   = true
  return src
}

// ─── AudioEngine ──────────────────────────────────────────────────────────────

export function AudioEngine({scrollProgress, inContent = false, onRegisterFade}: AudioEngineProps) {
  const ctxRef        = useRef<AudioContext | null>(null)
  const masterRef     = useRef<GainNode | null>(null)
  const padGainRef    = useRef<GainNode | null>(null)
  const seaGainRef    = useRef<GainNode | null>(null)
  const rafRef        = useRef<number>(0)
  const stopablesRef  = useRef<AudioScheduledSourceNode[]>([])
  const initializedRef = useRef(false)

  const [ready, setReady] = useState(false)
  const [muted, setMuted] = useState(false)

  // ── Build audio graph — called on first user interaction ─────────────────
  const initAudio = () => {
    if (initializedRef.current) return
    initializedRef.current = true

    const AudioCtx = window.AudioContext ||
      (window as Window & {webkitAudioContext?: typeof AudioContext}).webkitAudioContext!
    const ctx = new AudioCtx()
    ctxRef.current = ctx

    const resume = () => { if (ctx.state === 'suspended') ctx.resume() }
    resume()

    const track = <T extends AudioScheduledSourceNode>(n: T): T => {
      stopablesRef.current.push(n); return n
    }

    // ── Master ──────────────────────────────────────────────────────────────
    const master = ctx.createGain()
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 3)
    master.connect(ctx.destination)
    masterRef.current = master

    onRegisterFade?.(() => {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 2)
    })

    // ── Reverb ──────────────────────────────────────────────────────────────
    const reverb = ctx.createConvolver()
    const rLen   = ctx.sampleRate * 7
    const rBuf   = ctx.createBuffer(2, rLen, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = rBuf.getChannelData(ch)
      for (let i = 0; i < rLen; i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/rLen, 1.4)
    }
    reverb.buffer = rBuf
    const rvGain = ctx.createGain(); rvGain.gain.value = 0.48
    reverb.connect(rvGain); rvGain.connect(master)

    // ── HOPEFUL PAD — A major 9th ────────────────────────────────────────────
    // A3·C#4·E4·B4·E5 — triangle waves, warm overtones, lifted by the 9th (B4)
    const padGain   = ctx.createGain(); padGain.gain.value = 1.0
    const padFilter = ctx.createBiquadFilter()
    padFilter.type = 'lowpass'; padFilter.frequency.value = 5500; padFilter.Q.value = 0.4

    const padNotes: [number, number, number][] = [
      [220,   0.18, 0],    // A3
      [277.2, 0.20, 3],    // C#4
      [329.6, 0.16, -2],   // E4
      [493.9, 0.15, 5],    // B4 (9th — the "hope")
      [659.3, 0.07, -4],   // E5 (shimmer)
    ]
    padNotes.forEach(([freq, lvl, dt]) => {
      const o = track(ctx.createOscillator())
      const g = ctx.createGain()
      o.type = 'triangle'; o.frequency.value = freq; o.detune.value = dt
      g.gain.value = lvl
      o.connect(g); g.connect(padFilter); o.start()
    })

    // Vibrato on B4 for warmth
    const vibOsc = track(ctx.createOscillator())
    vibOsc.type = 'sine'; vibOsc.frequency.value = 3.6
    const vibMod = ctx.createGain(); vibMod.gain.value = 3.5
    const vibNote = track(ctx.createOscillator())
    vibNote.type = 'triangle'; vibNote.frequency.value = 493.9; vibNote.detune.value = -8
    const vibNoteG = ctx.createGain(); vibNoteG.gain.value = 0.10
    vibOsc.connect(vibMod); vibMod.connect(vibNote.frequency)
    vibNote.connect(vibNoteG); vibNoteG.connect(padFilter)
    vibOsc.start(); vibNote.start()

    padFilter.connect(padGain)
    padGain.connect(master); padGain.connect(reverb)
    padGainRef.current = padGain

    // ── SEA WAVES — calm ocean, breaking on shore ────────────────────────────
    // Three noise layers with slow wave-rhythm amplitude modulation.
    // Wave LFOs at different rates create irregular, natural-feeling surf.
    const seaGain = ctx.createGain(); seaGain.gain.value = 0
    seaGainRef.current = seaGain

    // 1. Deep ocean rumble (sub-bass shelf)
    const rumble = track(makePinkNoise(ctx, 7))
    const rumbleLP = ctx.createBiquadFilter()
    rumbleLP.type = 'lowpass'; rumbleLP.frequency.value = 320; rumbleLP.Q.value = 0.7
    const rumbleG = ctx.createGain(); rumbleG.gain.value = 0.55
    rumble.connect(rumbleLP); rumbleLP.connect(rumbleG); rumbleG.connect(seaGain)
    rumble.start()

    // 2. Wave wash — mid texture (the "shhhh" of breaking water)
    const wash = track(makePinkNoise(ctx, 6))
    const washBP = ctx.createBiquadFilter()
    washBP.type = 'bandpass'; washBP.frequency.value = 700; washBP.Q.value = 0.45
    const washG = ctx.createGain(); washG.gain.value = 0.45
    wash.connect(washBP); washBP.connect(washG); washG.connect(seaGain)
    wash.start()

    // 3. Fine spray — high, airy detail
    const spray = track(makePinkNoise(ctx, 5))
    const sprayBP = ctx.createBiquadFilter()
    sprayBP.type = 'bandpass'; sprayBP.frequency.value = 3200; sprayBP.Q.value = 0.6
    const sprayG = ctx.createGain(); sprayG.gain.value = 0.18
    spray.connect(sprayBP); sprayBP.connect(sprayG); sprayG.connect(seaGain)
    spray.start()

    // Wave rhythms — three LFOs at different speeds create irregular surf
    const waveLFOs: [number, number][] = [
      [0.11, 0.38],  // primary swell (~9 s)
      [0.07, 0.20],  // secondary swell (~14 s)
      [0.19, 0.12],  // small chop (~5 s)
    ]
    waveLFOs.forEach(([rate, depth]) => {
      const lfo = track(ctx.createOscillator())
      lfo.type = 'sine'; lfo.frequency.value = rate
      const mod = ctx.createGain(); mod.gain.value = depth
      lfo.connect(mod); mod.connect(seaGain.gain)
      lfo.start()
    })

    seaGain.connect(reverb); seaGain.connect(master)

    // ── Scroll-reactive pad fade (RAF loop) ──────────────────────────────────
    // introProgress 0→1 maps to padGain 1→0 (linear, smooth)
    // Once inContent, pad is already 0 — this just maintains it
    const tick = () => {
      if (padGainRef.current && ctx.state !== 'closed') {
        const p      = Math.min(1, Math.max(0, scrollProgress.current))
        const target = Math.pow(1 - p, 1.6)  // slightly curved fade
        const curr   = padGainRef.current.gain.value
        // Gentle lag (not instant) so it feels like breathing with the scroll
        padGainRef.current.gain.value = curr + (target - curr) * 0.04
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    setReady(true)
  }

  // ── First-interaction listener ────────────────────────────────────────────
  useEffect(() => {
    const onInteract = () => { initAudio() }
    const opts = {once: true, passive: true} as const

    // Try immediately (works in browsers that allow audio without gesture — e.g. mobile in some contexts)
    // Then fall back to first scroll/touch/click
    window.addEventListener('scroll', onInteract, opts)
    window.addEventListener('click',  onInteract, opts)
    window.addEventListener('touchstart', onInteract, opts)

    return () => {
      window.removeEventListener('scroll', onInteract)
      window.removeEventListener('click',  onInteract)
      window.removeEventListener('touchstart', onInteract)
      cancelAnimationFrame(rafRef.current)
      stopablesRef.current.forEach(n => { try { n.stop() } catch(_) {} })
      stopablesRef.current = []
      ctxRef.current?.close()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Sea waves: activate when inContent changes ────────────────────────────
  useEffect(() => {
    const ctx    = ctxRef.current
    const seaG   = seaGainRef.current
    const master = masterRef.current
    if (!ctx || !seaG || !master) return

    const t = ctx.currentTime
    if (inContent) {
      // Pad is already faded by scroll; ensure it's silent
      if (padGainRef.current) {
        padGainRef.current.gain.cancelScheduledValues(t)
        padGainRef.current.gain.linearRampToValueAtTime(0, t + 2)
      }
      // Gently raise master and sea
      master.gain.linearRampToValueAtTime(0.18, t + 4)
      seaG.gain.linearRampToValueAtTime(0.75, t + 8)
    } else {
      // Back in intro — silence sea, restore pad via RAF loop
      seaG.gain.linearRampToValueAtTime(0, t + 3)
    }
  }, [inContent])

  // ── Toggle mute ──────────────────────────────────────────────────────────
  const toggleMute = () => {
    const ctx    = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return
    const target = inContent ? 0.18 : 0.15
    master.gain.linearRampToValueAtTime(muted ? target : 0, ctx.currentTime + 0.6)
    setMuted(m => !m)
  }

  if (!ready) return null

  return (
    <button
      onClick={toggleMute}
      aria-label={muted ? 'Enable sound' : 'Mute sound'}
      style={{
        position:      'fixed',
        bottom:        '2rem',
        right:         '2rem',
        background:    'transparent',
        border:        `1px solid ${inContent ? 'rgba(90,76,62,0.18)' : 'rgba(255,255,255,0.13)'}`,
        color:         inContent ? 'rgba(90,76,62,0.38)' : 'rgba(200,196,215,0.42)',
        padding:       '0.5rem 1.1rem',
        cursor:        'pointer',
        fontFamily:    'Georgia, serif',
        fontSize:      '0.62rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        zIndex:        200,
        transition:    'color 0.4s ease, border-color 0.4s ease',
      }}
      onMouseEnter={e => {
        const b = e.currentTarget as HTMLButtonElement
        b.style.color = inContent ? 'rgba(90,76,62,0.85)' : 'rgba(200,196,215,0.9)'
      }}
      onMouseLeave={e => {
        const b = e.currentTarget as HTMLButtonElement
        b.style.color = inContent ? 'rgba(90,76,62,0.38)' : 'rgba(200,196,215,0.42)'
      }}
    >
      {muted ? 'sound on' : 'sound off'}
    </button>
  )
}
