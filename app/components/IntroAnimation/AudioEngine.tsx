'use client'

import {useEffect, useRef, useState} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AudioEngineProps {
  started:          boolean
  scrollProgress:   React.MutableRefObject<number>
  /** Called once the audio graph is ready — registers a fade-out function
   *  that index.tsx can invoke before Tibetan bowl navigation. */
  onRegisterFade?: (fadeOut: () => void) => void
}

// ─── Audio zones — 4 chapters of the invisible illness journey ─────────────────
//
//  Zone 0 (0–0.28):   Surface / Emergence
//    → Low drone, slow breathing, distant. Things are hidden.
//
//  Zone 1 (0.28–0.55): Dark Passage / Descent
//    → Drone drops, dissonance creeps in. Heartbeat intensifies.
//    → Breath tightens. Something is wrong but unseen.
//
//  Zone 2 (0.55–0.82): Interior / The Warmth of Pain
//    → Warm harmonics. Breath opens. Fragile peace.
//
//  Zone 3 (0.82–1.0):  Resolution / Light
//    → All eerie sounds fade. A soft A-major pad rises slowly.
//    → Warmth. Stillness. Understanding.

const ZONES = [
  {filterHz: 350, breathRate: 0.11, breathDepth: 280, lfoRate: 0.11, detune: 0,   noiseGain: 0.018},
  {filterHz: 180, breathRate: 0.22, breathDepth: 200, lfoRate: 0.22, detune: 25,  noiseGain: 0.032},
  {filterHz: 500, breathRate: 0.08, breathDepth: 350, lfoRate: 0.08, detune: -10, noiseGain: 0.014},
  {filterHz: 250, breathRate: 0.04, breathDepth: 100, lfoRate: 0.04, detune: 0,   noiseGain: 0.001},
]

// ─── AudioEngine ──────────────────────────────────────────────────────────────

export function AudioEngine({started, scrollProgress, onRegisterFade}: AudioEngineProps) {
  const ctxRef          = useRef<AudioContext | null>(null)
  const masterRef       = useRef<GainNode | null>(null)
  const droneFiltersRef = useRef<BiquadFilterNode[]>([])
  const breathBPRef     = useRef<BiquadFilterNode | null>(null)
  const breathGainRef   = useRef<GainNode | null>(null)
  const lfoRef          = useRef<OscillatorNode | null>(null)
  const lfoGainRef      = useRef<GainNode | null>(null)
  const oscsRef         = useRef<OscillatorNode[]>([])
  const pulseTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const zoneIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentZoneRef  = useRef<number>(-1)
  const reverbRef       = useRef<ConvolverNode | null>(null)
  const padGainRef      = useRef<GainNode | null>(null)
  const padOscsRef      = useRef<OscillatorNode[]>([])

  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (!started) return

    const AudioCtx = window.AudioContext || (window as Window & {webkitAudioContext?: typeof AudioContext}).webkitAudioContext!
    const ctx = new AudioCtx()
    ctxRef.current = ctx
    const now = ctx.currentTime

    // ── Master gain ───────────────────────────────────────────────────────
    const master = ctx.createGain()
    master.gain.setValueAtTime(0, now)
    master.gain.linearRampToValueAtTime(0.13, now + 5)
    master.connect(ctx.destination)
    masterRef.current = master

    // Register fade-out function for Tibetan bowl navigation transition
    onRegisterFade?.(() => {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.0)
    })

    // ── Convolution reverb ────────────────────────────────────────────────
    const makeReverb = (): ConvolverNode => {
      const conv = ctx.createConvolver()
      const len  = ctx.sampleRate * 6
      const buf  = ctx.createBuffer(2, len, ctx.sampleRate)
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch)
        for (let i = 0; i < len; i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/len, 1.6)
      }
      conv.buffer = buf
      return conv
    }

    const reverb     = makeReverb()
    const reverbGain = ctx.createGain()
    reverbGain.gain.value = 0.40
    reverb.connect(reverbGain)
    reverbGain.connect(master)
    reverbRef.current = reverb

    // ── Drone — layered oscillators ────────────────────────────────────────
    const makeDrone = (freq: number, gainVal: number, detune = 0): [OscillatorNode, BiquadFilterNode] => {
      const osc  = ctx.createOscillator()
      const lp   = ctx.createBiquadFilter()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.detune.value    = detune
      lp.type = 'lowpass'
      lp.frequency.value = ZONES[0].filterHz
      lp.Q.value = 1.2
      gain.gain.value = gainVal
      osc.connect(lp); lp.connect(gain)
      gain.connect(master); gain.connect(reverb)
      osc.start()
      return [osc, lp]
    }

    const drones: [OscillatorNode, BiquadFilterNode][] = [
      makeDrone(27.5,  0.48),
      makeDrone(55,    0.32),
      makeDrone(82.4,  0.20,  6),
      makeDrone(110,   0.14, -9),
      makeDrone(164.8, 0.07,  3),
    ]
    oscsRef.current         = drones.map(d => d[0])
    droneFiltersRef.current = drones.map(d => d[1])

    // ── Breathing texture ─────────────────────────────────────────────────
    const noiseLen = ctx.sampleRate * 4
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate)
    const nd       = noiseBuf.getChannelData(0)
    for (let i = 0; i < noiseLen; i++) nd[i] = Math.random()*2-1

    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuf
    noise.loop   = true

    const breathBP = ctx.createBiquadFilter()
    breathBP.type            = 'bandpass'
    breathBP.frequency.value = 700
    breathBP.Q.value         = ZONES[0].breathDepth / 50

    const breathGain = ctx.createGain()
    breathGain.gain.value = ZONES[0].noiseGain

    const lfo     = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.type = 'sine'
    lfo.frequency.value = ZONES[0].lfoRate
    lfoGain.gain.value  = ZONES[0].breathDepth

    lfo.connect(lfoGain)
    lfoGain.connect(breathBP.frequency)
    noise.connect(breathBP)
    breathBP.connect(breathGain)
    breathGain.connect(master)
    breathGain.connect(reverb)
    lfo.start(); noise.start()

    breathBPRef.current   = breathBP
    breathGainRef.current = breathGain
    lfoRef.current        = lfo
    lfoGainRef.current    = lfoGain

    // ── Peaceful pad — A major open voicing (silent until zone 3) ─────────
    //
    //  A2 · E3 · A3 · C#4 · E4
    //  Gentle lowpass + thick reverb → soft ambient wash
    //
    const padFreqs   = [110, 164.8, 220, 277.2, 329.6]
    const padLevels  = [0.30, 0.20, 0.28, 0.15, 0.10]
    const padDetunes = [0, 4, -3, 5, -2]  // subtle shimmer between oscillators

    const padGain = ctx.createGain()
    padGain.gain.value = 0

    const padFilter = ctx.createBiquadFilter()
    padFilter.type            = 'lowpass'
    padFilter.frequency.value = 1200
    padFilter.Q.value         = 0.6

    padFreqs.forEach((freq, i) => {
      const osc   = ctx.createOscillator()
      const oGain = ctx.createGain()
      osc.type            = 'sine'
      osc.frequency.value = freq
      osc.detune.value    = padDetunes[i]
      oGain.gain.value    = padLevels[i]
      osc.connect(oGain)
      oGain.connect(padFilter)
      osc.start()
      padOscsRef.current.push(osc)
    })

    padFilter.connect(padGain)
    padGain.connect(reverb)   // deep reverb for spaciousness
    padGain.connect(master)
    padGainRef.current = padGain

    // ── Heartbeat — zone-reactive scheduling ──────────────────────────────
    const scheduleHeartbeat = (interval: number) => {
      // Never beat in zone 3 (resolution)
      if (currentZoneRef.current === 3) return

      const bg  = ctx.createGain()
      const bo  = ctx.createOscillator()
      const bg2 = ctx.createGain()
      const bo2 = ctx.createOscillator()

      bo.frequency.value = 42; bo.type = 'sine'
      bg.gain.setValueAtTime(0, ctx.currentTime)
      bg.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.06)
      bg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7)

      bo2.frequency.value = 38; bo2.type = 'sine'
      bg2.gain.setValueAtTime(0, ctx.currentTime + 0.25)
      bg2.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.31)
      bg2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9)

      bo.connect(bg);   bg.connect(master)
      bo2.connect(bg2); bg2.connect(master)
      bo.start(); bo.stop(ctx.currentTime + 1.2)
      bo2.start(); bo2.stop(ctx.currentTime + 1.4)

      pulseTimerRef.current = setTimeout(
        () => scheduleHeartbeat(interval),
        interval + Math.random() * 2000
      )
    }
    pulseTimerRef.current = setTimeout(() => scheduleHeartbeat(7000), 10000)

    // ── Zone transitions ──────────────────────────────────────────────────
    const transitionTo = (zone: number) => {
      const now = ctx.currentTime

      if (zone === 3) {
        // ── Resolution: eerie sounds dissolve, peaceful pad rises ─────────

        // Stop heartbeat permanently
        if (pulseTimerRef.current) {
          clearTimeout(pulseTimerRef.current)
          pulseTimerRef.current = null
        }

        // Dissolve breathing texture over 8s
        breathGainRef.current?.gain.linearRampToValueAtTime(0.0001, now + 8.0)
        lfoRef.current?.frequency.linearRampToValueAtTime(0.02, now + 6.0)
        lfoGainRef.current?.gain.linearRampToValueAtTime(20, now + 6.0)

        // Very gently fade drone (don't cut it — let it blend with the pad)
        droneFiltersRef.current.forEach(f => {
          f.frequency.linearRampToValueAtTime(160, now + 8.0)
        })
        oscsRef.current.forEach(osc => {
          osc.detune.linearRampToValueAtTime(0, now + 5.0)
        })

        // Lower master slightly (pad adds its own level)
        master.gain.linearRampToValueAtTime(0.06, now + 6.0)

        // Peaceful pad rises over 9 seconds
        padGainRef.current?.gain.linearRampToValueAtTime(0.24, now + 9.0)

      } else {
        const z = ZONES[zone]

        // Fade pad back to silence if user scrolls back
        padGainRef.current?.gain.linearRampToValueAtTime(0, now + 4.0)

        // Drone filters
        droneFiltersRef.current.forEach((f, i) => {
          f.frequency.linearRampToValueAtTime(z.filterHz, now + 2.5)
          if (i < oscsRef.current.length) {
            oscsRef.current[i].detune.linearRampToValueAtTime(
              i === 0 ? 0 : z.detune * (i * 0.8), now + 3.0
            )
          }
        })

        // Breathing
        lfoRef.current?.frequency.linearRampToValueAtTime(z.lfoRate, now + 4.0)
        lfoGainRef.current?.gain.linearRampToValueAtTime(z.breathDepth, now + 4.0)
        breathGainRef.current?.gain.linearRampToValueAtTime(z.noiseGain, now + 3.0)

        // Master volume
        if (zone === 2) {
          master.gain.linearRampToValueAtTime(0.15, now + 4.0)
        } else if (zone === 1) {
          master.gain.linearRampToValueAtTime(0.11, now + 3.0)
        } else if (zone === 0 && currentZoneRef.current > 0) {
          master.gain.linearRampToValueAtTime(0.13, now + 3.0)
        }

        // Reschedule heartbeat
        if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current)
        const hbInterval = zone === 0 ? 7000 : zone === 1 ? 3500 : 5500
        if (!muted) scheduleHeartbeat(hbInterval)
      }
    }

    zoneIntervalRef.current = setInterval(() => {
      const scroll = scrollProgress.current
      const zone   = scroll < 0.28 ? 0 : scroll < 0.55 ? 1 : scroll < 0.82 ? 2 : 3
      if (zone !== currentZoneRef.current) {
        currentZoneRef.current = zone
        transitionTo(zone)
      }
    }, 300)

    return () => {
      if (pulseTimerRef.current)   clearTimeout(pulseTimerRef.current)
      if (zoneIntervalRef.current) clearInterval(zoneIntervalRef.current)
      oscsRef.current.forEach(o   => { try { o.stop() } catch(_) {} })
      padOscsRef.current.forEach(o => { try { o.stop() } catch(_) {} })
      try { lfoRef.current?.stop(); noise.stop() } catch(_) {}
      ctx.close()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started])

  const toggleMute = () => {
    const ctx    = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return
    const targetGain = currentZoneRef.current === 3 ? 0.06 : 0.13
    if (muted) {
      master.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.6)
    } else {
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
    }
    setMuted(m => !m)
  }

  if (!started) return null

  return (
    <button
      onClick={toggleMute}
      aria-label={muted ? 'Enable sound' : 'Mute sound'}
      style={{
        position:      'fixed',
        bottom:        '2rem',
        right:         '2rem',
        background:    'transparent',
        border:        '1px solid rgba(255,255,255,0.13)',
        color:         'rgba(200,196,215,0.45)',
        padding:       '0.5rem 1.1rem',
        cursor:        'pointer',
        fontFamily:    'Georgia, serif',
        fontSize:      '0.62rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        zIndex:        200,
        transition:    'color 0.4s ease',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(200,196,215,0.9)')}
      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(200,196,215,0.45)')}
    >
      {muted ? 'sound on' : 'sound off'}
    </button>
  )
}
