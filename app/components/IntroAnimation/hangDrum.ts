// ─── Hang Drum (Handpan) — Web Audio synthesis ────────────────────────────────
//
//  A handpan has near-harmonic partials with slight stretch:
//    Fundamental × 1.0  · × 2.005 · × 3.012 · × 4.020
//
//  A brief FM burst on each partial adds the metallic "ting" on attack.
//  Strike: short highpass noise (2–6 kHz) = hand-on-steel impact.
//  Medium reverb (~4s) + warm decay = meditative resonance.
//
//  Fundamental: D3 = 146.83 Hz — deep, warm, unhurried.

export async function playHangDrum(): Promise<void> {
  const AudioCtx =
    window.AudioContext ||
    (window as Window & {webkitAudioContext?: typeof AudioContext}).webkitAudioContext!
  const ctx = new AudioCtx()
  const now = ctx.currentTime

  // ── Reverb ────────────────────────────────────────────────────────────────
  const reverbLen = ctx.sampleRate * 4
  const reverbBuf = ctx.createBuffer(2, reverbLen, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = reverbBuf.getChannelData(ch)
    for (let i = 0; i < reverbLen; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 1.8)
    }
  }
  const reverb     = ctx.createConvolver()
  reverb.buffer    = reverbBuf
  const reverbGain = ctx.createGain()
  reverbGain.gain.value = 0.42
  reverb.connect(reverbGain)

  // ── Master ────────────────────────────────────────────────────────────────
  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0, now)
  master.connect(ctx.destination)
  reverbGain.connect(master)

  // ── Hang drum partials ─────────────────────────────────────────────────────
  //  Near-harmonic stretch (~0.5%) gives the steel-shell character.
  const fundamental = 146.83   // D3
  const partials = [
    {ratio: 1.000, gain: 0.88, decayEnd: 5.8},   // fundamental — longest sustain
    {ratio: 2.005, gain: 0.52, decayEnd: 4.0},   // near-octave
    {ratio: 3.012, gain: 0.22, decayEnd: 2.8},   // near-fifth above octave
    {ratio: 4.020, gain: 0.10, decayEnd: 1.8},   // near-double octave
  ]

  partials.forEach(({ratio, gain, decayEnd}) => {
    const freq  = fundamental * ratio
    const osc   = ctx.createOscillator()
    const oGain = ctx.createGain()

    // FM modulator — decays in ~300ms, gives metallic attack shimmer
    const modOsc  = ctx.createOscillator()
    const modGain = ctx.createGain()
    modOsc.type            = 'sine'
    modOsc.frequency.value = freq * 1.414          // √2 ratio — slight inharmonic mod
    modGain.gain.setValueAtTime(freq * 0.07, now)  // FM depth proportional to freq
    modGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)
    modOsc.connect(modGain)
    modGain.connect(osc.frequency)
    modOsc.start(now)
    modOsc.stop(now + 0.32)

    osc.type            = 'sine'
    osc.frequency.value = freq

    // Percussive envelope: near-instant attack, long exponential tail
    oGain.gain.setValueAtTime(0, now)
    oGain.gain.linearRampToValueAtTime(gain, now + 0.006)
    oGain.gain.exponentialRampToValueAtTime(0.0001, now + decayEnd)

    osc.connect(oGain)
    oGain.connect(master)
    oGain.connect(reverb)

    osc.start(now)
    osc.stop(now + decayEnd + 0.1)
  })

  // ── Strike transient — hand-on-steel "ting" ───────────────────────────────
  const strikeLen = Math.floor(ctx.sampleRate * 0.035)
  const strikeBuf = ctx.createBuffer(1, strikeLen, ctx.sampleRate)
  const sd        = strikeBuf.getChannelData(0)
  for (let i = 0; i < strikeLen; i++) {
    sd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / strikeLen, 4)
  }
  const strike = ctx.createBufferSource()
  strike.buffer = strikeBuf

  const strikeHp = ctx.createBiquadFilter()
  strikeHp.type            = 'highpass'
  strikeHp.frequency.value = 2200

  const strikeLp = ctx.createBiquadFilter()
  strikeLp.type            = 'lowpass'
  strikeLp.frequency.value = 7000

  const strikeGain = ctx.createGain()
  strikeGain.gain.setValueAtTime(0.22, now)
  strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

  strike.connect(strikeHp)
  strikeHp.connect(strikeLp)
  strikeLp.connect(strikeGain)
  strikeGain.connect(master)
  strike.start(now)

  // ── Master envelope ────────────────────────────────────────────────────────
  master.gain.linearRampToValueAtTime(0.32, now + 0.01)   // near-instant attack
  master.gain.linearRampToValueAtTime(0.28, now + 1.5)
  master.gain.linearRampToValueAtTime(0.0,  now + 3.2)

  return new Promise(resolve => setTimeout(resolve, 2000))
}
