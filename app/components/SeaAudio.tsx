'use client'

import {useEffect, useRef, useState} from 'react'

// ─── SeaAudio ─────────────────────────────────────────────────────────────────
// Standalone calm-sea sound component for pages that always want ocean ambience.
// Starts on first user interaction (scroll / click / touch).
// Used on the /about page and any route outside the intro animation.

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
  src.buffer = buf; src.loop = true
  return src
}

export function SeaAudio() {
  const masterRef      = useRef<GainNode | null>(null)
  const ctxRef         = useRef<AudioContext | null>(null)
  const stopablesRef   = useRef<AudioScheduledSourceNode[]>([])
  const initializedRef = useRef(false)

  const [ready, setReady] = useState(false)
  const [muted, setMuted] = useState(false)

  const initAudio = () => {
    if (initializedRef.current) return
    initializedRef.current = true

    const AudioCtx = window.AudioContext ||
      (window as Window & {webkitAudioContext?: typeof AudioContext}).webkitAudioContext!
    const ctx = new AudioCtx()
    ctxRef.current = ctx
    if (ctx.state === 'suspended') ctx.resume()

    const track = <T extends AudioScheduledSourceNode>(n: T): T => {
      stopablesRef.current.push(n); return n
    }

    // ── Master (fades in gently) ─────────────────────────────────────────
    const master = ctx.createGain()
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.20, ctx.currentTime + 6)
    master.connect(ctx.destination)
    masterRef.current = master

    // ── Reverb ───────────────────────────────────────────────────────────
    const reverb = ctx.createConvolver()
    const rLen   = ctx.sampleRate * 7
    const rBuf   = ctx.createBuffer(2, rLen, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = rBuf.getChannelData(ch)
      for (let i = 0; i < rLen; i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/rLen, 1.4)
    }
    reverb.buffer = rBuf
    const rvG = ctx.createGain(); rvG.gain.value = 0.50
    reverb.connect(rvG); rvG.connect(master)

    // ── Sea gain (all layers routed here) ────────────────────────────────
    const seaGain = ctx.createGain()
    seaGain.gain.value = 0.80
    seaGain.connect(master); seaGain.connect(reverb)

    // 1. Deep ocean rumble
    const rumble   = track(makePinkNoise(ctx, 7))
    const rumbleLP = ctx.createBiquadFilter()
    rumbleLP.type = 'lowpass'; rumbleLP.frequency.value = 320; rumbleLP.Q.value = 0.7
    const rumbleG = ctx.createGain(); rumbleG.gain.value = 0.55
    rumble.connect(rumbleLP); rumbleLP.connect(rumbleG); rumbleG.connect(seaGain)
    rumble.start()

    // 2. Wave wash — mid
    const wash   = track(makePinkNoise(ctx, 6))
    const washBP = ctx.createBiquadFilter()
    washBP.type = 'bandpass'; washBP.frequency.value = 700; washBP.Q.value = 0.45
    const washG = ctx.createGain(); washG.gain.value = 0.45
    wash.connect(washBP); washBP.connect(washG); washG.connect(seaGain)
    wash.start()

    // 3. Fine spray — high
    const spray   = track(makePinkNoise(ctx, 5))
    const sprayBP = ctx.createBiquadFilter()
    sprayBP.type = 'bandpass'; sprayBP.frequency.value = 3200; sprayBP.Q.value = 0.6
    const sprayG = ctx.createGain(); sprayG.gain.value = 0.18
    spray.connect(sprayBP); sprayBP.connect(sprayG); sprayG.connect(seaGain)
    spray.start()

    // Wave LFOs — three at different rates for irregular surf
    const waveLFOs: [number, number][] = [
      [0.11, 0.38],   // primary swell ~9 s
      [0.07, 0.20],   // secondary swell ~14 s
      [0.19, 0.12],   // small chop ~5 s
    ]
    waveLFOs.forEach(([rate, depth]) => {
      const lfo = track(ctx.createOscillator())
      lfo.type = 'sine'; lfo.frequency.value = rate
      const mod = ctx.createGain(); mod.gain.value = depth
      lfo.connect(mod); mod.connect(seaGain.gain)
      lfo.start()
    })

    setReady(true)
  }

  useEffect(() => {
    const opts = {once: true, passive: true} as const
    const go   = () => initAudio()

    window.addEventListener('scroll',     go, opts)
    window.addEventListener('click',      go, opts)
    window.addEventListener('touchstart', go, opts)

    // Try immediately in case context was already unlocked (e.g. navigated from home)
    try { initAudio() } catch(_) {}

    return () => {
      window.removeEventListener('scroll',     go)
      window.removeEventListener('click',      go)
      window.removeEventListener('touchstart', go)
      stopablesRef.current.forEach(n => { try { n.stop() } catch(_) {} })
      stopablesRef.current = []
      ctxRef.current?.close()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleMute = () => {
    const ctx    = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return
    master.gain.linearRampToValueAtTime(muted ? 0.20 : 0, ctx.currentTime + 0.6)
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
        border:        '1px solid rgba(90,76,62,0.18)',
        color:         'rgba(90,76,62,0.38)',
        padding:       '0.5rem 1.1rem',
        cursor:        'pointer',
        fontFamily:    'Georgia, serif',
        fontSize:      '0.62rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        zIndex:        200,
        transition:    'color 0.4s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(90,76,62,0.85)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(90,76,62,0.38)' }}
    >
      {muted ? 'sound on' : 'sound off'}
    </button>
  )
}
