'use client'

import {useEffect, useRef, useState} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AudioEngineProps {
  scrollProgress:  React.MutableRefObject<number>
  mousePosition?:  React.MutableRefObject<{x: number; y: number}>
  inContent?:      boolean
  onRegisterFade?: (fadeOut: () => void) => void
}

// ─── Audio concept ────────────────────────────────────────────────────────────
//
//  ON LOAD      → Hopeful A-major pad plays (calm, open, luminous).
//                 Starts the moment the user first interacts (scroll / click).
//
//  MOUSE        → X axis: morphs chord voicing — left emphasises the open 5th
//                 (A+E, spacious, ambiguous), right blooms the major 9th
//                 (C#+B, warm, hopeful). Y axis: filter brightness — top = airy,
//                 bottom = dark and intimate. All changes interpolate slowly
//                 (τ ≈ 1 s) so the sound breathes with the listener's gesture.
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

// ─── Voice gain tables ───────────────────────────────────────────────────────
// Five voices: A3 · C#4 · E4 · B4 · E5
// Mouse X = 0 (left)  → open fifth: root + 5th carry, 3rd/9th recede
// Mouse X = 1 (right) → full bloom: 3rd and 9th rise, the "hope" opens up

const GAINS_LEFT  = [0.22, 0.07, 0.20, 0.06, 0.03]
const GAINS_RIGHT = [0.10, 0.22, 0.11, 0.22, 0.10]

// ─── AudioEngine ──────────────────────────────────────────────────────────────

export function AudioEngine({scrollProgress, mousePosition, inContent = false, onRegisterFade}: AudioEngineProps) {
  const ctxRef        = useRef<AudioContext | null>(null)
  const masterRef     = useRef<GainNode | null>(null)
  const padGainRef    = useRef<GainNode | null>(null)
  const padFilterRef  = useRef<BiquadFilterNode | null>(null)
  const voiceGainsRef = useRef<GainNode[]>([])
  const seaGainRef    = useRef<GainNode | null>(null)
  const rafRef        = useRef<number>(0)
  const stopablesRef  = useRef<AudioScheduledSourceNode[]>([])
  const graphBuilt    = useRef(false)

  // Smoothed normalised mouse coords (0–1 each), updated in RAF
  const smoothNxRef = useRef(0.5)
  const smoothNyRef = useRef(0.5)

  const [ready, setReady] = useState(false)
  const [muted, setMuted] = useState(false)

  // ── Build audio graph — called once ctx exists ────────────────────────────
  const buildGraph = (ctx: AudioContext) => {
    if (graphBuilt.current) return
    graphBuilt.current = true

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
    // A3 · C#4 · E4 · B4 · E5 — triangle waves, warm overtones
    // Voice gains are morphed by mouse X in the RAF loop below
    const padGain   = ctx.createGain(); padGain.gain.value = 1.0
    const padFilter = ctx.createBiquadFilter()
    padFilter.type = 'lowpass'; padFilter.frequency.value = 4000; padFilter.Q.value = 0.4

    const padNotes: [number, number, number][] = [
      [220,   GAINS_LEFT[0], 0],    // A3
      [277.2, GAINS_LEFT[1], 3],    // C#4
      [329.6, GAINS_LEFT[2], -2],   // E4
      [493.9, GAINS_LEFT[3], 5],    // B4 (9th — the "hope")
      [659.3, GAINS_LEFT[4], -4],   // E5 (shimmer)
    ]

    const voiceGains: GainNode[] = []
    padNotes.forEach(([freq, lvl, dt]) => {
      const o = track(ctx.createOscillator())
      const g = ctx.createGain()
      o.type = 'triangle'; o.frequency.value = freq; o.detune.value = dt
      g.gain.value = lvl
      o.connect(g); g.connect(padFilter); o.start()
      voiceGains.push(g)
    })
    voiceGainsRef.current = voiceGains
    padFilterRef.current  = padFilter

    // Vibrato on B4 for warmth (stays fixed — not mouse-morphed)
    const vibOsc = track(ctx.createOscillator())
    vibOsc.type = 'sine'; vibOsc.frequency.value = 3.6
    const vibMod = ctx.createGain(); vibMod.gain.value = 3.5
    const vibNote = track(ctx.createOscillator())
    vibNote.type = 'triangle'; vibNote.frequency.value = 493.9; vibNote.detune.value = -8
    const vibNoteG = ctx.createGain(); vibNoteG.gain.value = 0.08
    vibOsc.connect(vibMod); vibMod.connect(vibNote.frequency)
    vibNote.connect(vibNoteG); vibNoteG.connect(padFilter)
    vibOsc.start(); vibNote.start()

    padFilter.connect(padGain)
    padGain.connect(master); padGain.connect(reverb)
    padGainRef.current = padGain

    // ── SEA WAVES ────────────────────────────────────────────────────────────
    const seaGain = ctx.createGain(); seaGain.gain.value = 0
    seaGainRef.current = seaGain

    const rumble = track(makePinkNoise(ctx, 7))
    const rumbleLP = ctx.createBiquadFilter()
    rumbleLP.type = 'lowpass'; rumbleLP.frequency.value = 320; rumbleLP.Q.value = 0.7
    const rumbleG = ctx.createGain(); rumbleG.gain.value = 0.55
    rumble.connect(rumbleLP); rumbleLP.connect(rumbleG); rumbleG.connect(seaGain)
    rumble.start()

    const wash = track(makePinkNoise(ctx, 6))
    const washBP = ctx.createBiquadFilter()
    washBP.type = 'bandpass'; washBP.frequency.value = 700; washBP.Q.value = 0.45
    const washG = ctx.createGain(); washG.gain.value = 0.45
    wash.connect(washBP); washBP.connect(washG); washG.connect(seaGain)
    wash.start()

    const spray = track(makePinkNoise(ctx, 5))
    const sprayBP = ctx.createBiquadFilter()
    sprayBP.type = 'bandpass'; sprayBP.frequency.value = 3200; sprayBP.Q.value = 0.6
    const sprayG = ctx.createGain(); sprayG.gain.value = 0.18
    spray.connect(sprayBP); sprayBP.connect(sprayG); sprayG.connect(seaGain)
    spray.start()

    const waveLFOs: [number, number][] = [
      [0.11, 0.38],
      [0.07, 0.20],
      [0.19, 0.12],
    ]
    waveLFOs.forEach(([rate, depth]) => {
      const lfo = track(ctx.createOscillator())
      lfo.type = 'sine'; lfo.frequency.value = rate
      const mod = ctx.createGain(); mod.gain.value = depth
      lfo.connect(mod); mod.connect(seaGain.gain)
      lfo.start()
    })

    seaGain.connect(reverb); seaGain.connect(master)

    // ── RAF loop ─────────────────────────────────────────────────────────────
    // Handles both scroll-reactive pad fade AND mouse-reactive timbre morphing.
    const tick = () => {
      if (ctx.state !== 'closed') {

        // 1. Scroll fade: pad gain 1→0 as intro progresses
        if (padGainRef.current) {
          const p      = Math.min(1, Math.max(0, scrollProgress.current))
          const target = Math.pow(1 - p, 1.6)
          const curr   = padGainRef.current.gain.value
          padGainRef.current.gain.value = curr + (target - curr) * 0.04
        }

        // 2. Mouse morphing: chord voicing + filter brightness
        //    τ ≈ 40 frames (~0.67 s at 60 fps) — slow enough to feel like breathing
        if (mousePosition) {
          const m  = mousePosition.current
          // Normalise to 0–1
          const nx = (m.x + 1) / 2   // 0=left, 1=right
          const ny = (m.y + 1) / 2   // 0=bottom, 1=top

          // Exponential smoothing (factor 0.025 ≈ τ of 40 frames)
          smoothNxRef.current += (nx - smoothNxRef.current) * 0.025
          smoothNyRef.current += (ny - smoothNyRef.current) * 0.025

          const snx = smoothNxRef.current
          const sny = smoothNyRef.current

          // Morph voice gains: X=0 → open 5th feel, X=1 → 9th bloom
          voiceGainsRef.current.forEach((g, i) => {
            const tgt = GAINS_LEFT[i] + (GAINS_RIGHT[i] - GAINS_LEFT[i]) * snx
            g.gain.value += (tgt - g.gain.value) * 0.025
          })

          // Filter brightness: Y=top → 7000 Hz (airy), Y=bottom → 1800 Hz (dark)
          if (padFilterRef.current) {
            const tgtHz = 1800 + sny * 5200
            padFilterRef.current.frequency.value +=
              (tgtHz - padFilterRef.current.frequency.value) * 0.03
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    setReady(true)
  }

  // ── Interaction listeners — kept alive until ctx is running ──────────────
  // This handles iOS/Safari where the first scroll doesn't count as a gesture:
  // scroll creates the context (suspended), click/touch then resumes it.
  useEffect(() => {
    const AudioCtx = (window.AudioContext ||
      (window as Window & {webkitAudioContext?: typeof AudioContext}).webkitAudioContext) as
      typeof AudioContext | undefined
    if (!AudioCtx) return

    let removeListeners: () => void

    const onInteract = () => {
      try {
        if (!ctxRef.current) {
          ctxRef.current = new AudioCtx()
        }
        const ctx = ctxRef.current

        if (ctx.state === 'suspended') ctx.resume()

        buildGraph(ctx)

        if (ctx.state === 'running') removeListeners()
      } catch (_) {}
    }

    removeListeners = () => {
      window.removeEventListener('scroll',     onInteract)
      window.removeEventListener('click',      onInteract)
      window.removeEventListener('touchstart', onInteract)
    }

    window.addEventListener('scroll',     onInteract, {passive: true})
    window.addEventListener('click',      onInteract, {passive: true})
    window.addEventListener('touchstart', onInteract, {passive: true})

    return () => {
      removeListeners()
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
      if (padGainRef.current) {
        padGainRef.current.gain.cancelScheduledValues(t)
        padGainRef.current.gain.linearRampToValueAtTime(0, t + 2)
      }
      master.gain.linearRampToValueAtTime(0.18, t + 4)
      seaG.gain.linearRampToValueAtTime(0.75, t + 8)
    } else {
      seaG.gain.linearRampToValueAtTime(0, t + 3)
    }
  }, [inContent])

  // ── Toggle mute ──────────────────────────────────────────────────────────
  const toggleMute = () => {
    const ctx    = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return
    // Click is always a user gesture — good moment to resume if still suspended
    if (ctx.state === 'suspended') ctx.resume()
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
