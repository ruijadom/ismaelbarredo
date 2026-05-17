'use client'

import {useRef, useMemo} from 'react'
import {useFrame} from '@react-three/fiber'
import * as THREE from 'three'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NeuronFieldProps {
  scrollProgress: React.MutableRefObject<number>
  emergence:      React.MutableRefObject<number>
}

// ─── Neuron geometry builder ──────────────────────────────────────────────────
//
//  Each neuron is a recursive branching tree:
//    • Soma (starting point)
//    • Main axon + 2–4 dendrite arms from soma
//    • Each arm branches recursively (depth 2–4)
//    • Branching ratio = 0.62 (gentle taper)
//
//  Per-vertex attributes:
//    aProgress   — 0 at soma, 1 at terminal tip (drives signal pulse)
//    aPhase      — per-neuron random phase (staggers all signals)
//    aZoneColor  — 0=cool-blue, 0.5=warm-amber, 1=crystal-white

interface Seg {
  positions: number[]
  progress:  number[]
  phase:     number[]
  zoneColor: number[]
}

function branch(
  pos:       THREE.Vector3,
  dir:       THREE.Vector3,
  len:       number,
  depth:     number,
  maxDepth:  number,
  phase:     number,
  col:       number,
  distSoma:  number,
  totalLen:  number,
  out:       Seg,
) {
  if (depth > maxDepth || len < 0.05) return

  const end = pos.clone().addScaledVector(dir.clone().normalize(), len)
  const p0  = Math.min(1, distSoma / totalLen)
  const p1  = Math.min(1, (distSoma + len) / totalLen)

  // Each segment = 2 vertices (LineSegments pair)
  out.positions.push(pos.x, pos.y, pos.z, end.x, end.y, end.z)
  out.progress.push(p0, p1)
  out.phase.push(phase, phase)
  out.zoneColor.push(col, col)

  // Number of sub-branches decreases with depth
  const numB = depth === 0 ? 1 : depth < 2 ? 3 : 2
  for (let i = 0; i < numB; i++) {
    const spread = 1.1 - depth * 0.22
    const jitter = new THREE.Vector3(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread * 0.35,
    )
    branch(end, dir.clone().add(jitter).normalize(), len * 0.62,
           depth + 1, maxDepth, phase, col, distSoma + len, totalLen, out)
  }
}

function buildNeurons(): Seg {
  const out: Seg = {positions: [], progress: [], phase: [], zoneColor: []}
  const rand = Math.random.bind(Math)

  const gauss = () => {
    const u = 1 - rand(); const v = rand()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }

  // Zone config: [count, zMin, zMax, spreadXY, zoneColor, maxDepth, initLen, dendrites]
  const zones = [
    {n: 10, zMin:  1, zMax:  5,  sXY: 4.0, col: 0.0, d: 3, len: 0.50, arms: 3},  // cool
    {n:  3, zMin: -3, zMax:  1,  sXY: 6.0, col: 0.3, d: 2, len: 0.35, arms: 2},  // sparse
    {n: 12, zMin: -8, zMax: -3,  sXY: 3.5, col: 0.6, d: 3, len: 0.52, arms: 3},  // warm
    {n: 20, zMin:-14, zMax: -8,  sXY: 5.0, col: 1.0, d: 4, len: 0.65, arms: 4},  // crystal (densest)
  ]

  for (const z of zones) {
    for (let n = 0; n < z.n; n++) {
      const soma  = new THREE.Vector3(
        gauss() * z.sXY * 0.45,
        gauss() * z.sXY * 0.35,
        z.zMin + rand() * (z.zMax - z.zMin),
      )
      const phase    = rand()
      const totalLen = z.len * 3.2   // geometric series estimate for normalisation

      // Main axon
      const axonDir = new THREE.Vector3(rand()-0.5, rand()-0.5, (rand()-0.5)*0.25).normalize()
      branch(soma, axonDir, z.len, 0, z.d, phase, z.col, 0, totalLen, out)

      // Dendrite arms radiating from soma
      for (let a = 0; a < z.arms; a++) {
        const armDir = new THREE.Vector3(rand()-0.5, rand()-0.5, (rand()-0.5)*0.25).normalize()
        branch(soma, armDir, z.len * 0.72, 1, z.d, phase, z.col, 0, totalLen, out)
      }
    }
  }

  return out
}

// ─── Shaders ──────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  attribute float aProgress;
  attribute float aPhase;
  attribute float aZoneColor;

  uniform float uTime;
  uniform float uEmergence;
  uniform float uCameraZ;

  varying float vSignal;
  varying float vAlpha;
  varying float vZoneColor;

  void main() {
    // ── Focal-plane brightness (same logic as ParticleSystem) ──────────────
    float distZ      = position.z - uCameraZ;
    float aheadFade  = 1.0 - smoothstep(0.5, 8.0, distZ);
    float behindFade = 1.0 - smoothstep(1.5, 10.0, -distZ);
    float focal      = aheadFade * behindFade;

    // ── Staggered emergence ────────────────────────────────────────────────
    float emerge = smoothstep(aPhase * 0.3, aPhase * 0.3 + 0.7, uEmergence);

    // ── Traveling signal pulse ─────────────────────────────────────────────
    //  Each neuron fires at its own phase. The pulse travels from soma (0)
    //  to tips (1) along aProgress.
    float wave   = fract(uTime * 0.25 + aPhase);
    float signal = 1.0 - smoothstep(0.0, 0.15, abs(wave - aProgress));
    vSignal = signal;

    vAlpha     = focal * emerge;
    vZoneColor = aZoneColor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorCool;
  uniform vec3 uColorWarm;
  uniform vec3 uColorCrystal;

  varying float vSignal;
  varying float vAlpha;
  varying float vZoneColor;

  void main() {
    // Blend between zone color palettes
    vec3 col;
    if (vZoneColor < 0.5) {
      col = mix(uColorCool, uColorWarm, vZoneColor * 2.0);
    } else {
      col = mix(uColorWarm, uColorCrystal, (vZoneColor - 0.5) * 2.0);
    }

    // Base line is dim; signal pulse is bright
    float brightness = 0.15 + vSignal * 0.85;
    col *= brightness;

    // Alpha: subtle base + strong on signal
    float alpha = vAlpha * (0.28 + vSignal * 0.52);

    gl_FragColor = vec4(col, alpha);
  }
`

// ─── Component ────────────────────────────────────────────────────────────────

export function NeuronField({scrollProgress, emergence}: NeuronFieldProps) {
  const linesRef = useRef<THREE.LineSegments>(null)

  // Build geometry once (memoised)
  const seg = useMemo(buildNeurons, [])

  const posArr      = useMemo(() => new Float32Array(seg.positions), [seg])
  const progressArr = useMemo(() => new Float32Array(seg.progress),  [seg])
  const phaseArr    = useMemo(() => new Float32Array(seg.phase),     [seg])
  const zoneArr     = useMemo(() => new Float32Array(seg.zoneColor), [seg])

  const uniforms = useMemo(() => ({
    uTime:         {value: 0},
    uEmergence:    {value: 0},
    uCameraZ:      {value: 5},
    // Cool blue-white (zones 0–1)
    uColorCool:    {value: new THREE.Color('#90b8f8')},
    // Warm amber (zone 2)
    uColorWarm:    {value: new THREE.Color('#d4a86a')},
    // Crystal white (zone 3 — light / resolution)
    uColorCrystal: {value: new THREE.Color('#e8f0ff')},
  }), [])

  useFrame(({camera}) => {
    const mat = linesRef.current?.material as THREE.ShaderMaterial | undefined
    if (!mat) return
    mat.uniforms.uTime.value      = performance.now() / 1000
    mat.uniforms.uEmergence.value = emergence.current
    mat.uniforms.uCameraZ.value   = camera.position.z
    // Suppress unused warning — scrollProgress available if needed later
    void scrollProgress.current
  })

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position"   args={[posArr,      3]} />
        <bufferAttribute attach="attributes-aProgress"  args={[progressArr, 1]} />
        <bufferAttribute attach="attributes-aPhase"     args={[phaseArr,    1]} />
        <bufferAttribute attach="attributes-aZoneColor" args={[zoneArr,     1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}
