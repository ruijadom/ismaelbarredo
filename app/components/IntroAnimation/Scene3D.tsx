'use client'

// THREE.Clock was deprecated in r168 in favour of THREE.Timer.
// R3F still uses it internally — suppress until R3F ships the migration.
if (typeof window !== 'undefined') {
  const _warn = console.warn.bind(console)
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return
    _warn(...args)
  }
}

import {useMemo, useRef} from 'react'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {
  EffectComposer,
  ChromaticAberration,
  Noise,
  Vignette,
  Bloom,
} from '@react-three/postprocessing'
import {BlendFunction} from 'postprocessing'
import * as THREE from 'three'
import {ParticleSystem} from './ParticleSystem'
import {NeuronField}    from './NeuronField'

// ─── Constants ────────────────────────────────────────────────────────────────

const CAM_START_Z = 5
const CAM_END_Z   = -14

// Background tints per scroll zone (lerped smoothly between them)
// Zone 0 (0–0.30): deep blue-black emergence
// Zone 1 (0.30–0.55): darkest abyss (dark passage 1)
// Zone 2 (0.55–0.80): warm dark (mid cluster zone)
// Zone 3 (0.80–1.0): resolving space
const ZONE_BACKGROUNDS = [
  new THREE.Color('#020204'), // zone 0 – cool dark blue
  new THREE.Color('#010103'), // zone 1 – deepest black (purple)
  new THREE.Color('#0a0806'), // zone 2 – warm near-black
  new THREE.Color('#1e1a1a'), // zone 3 – soft warm light at resolution
]

function lerpZoneBg(scroll: number): THREE.Color {
  const t   = scroll * (ZONE_BACKGROUNDS.length - 1)
  const idx = Math.floor(t)
  const frac = t - idx
  const a = ZONE_BACKGROUNDS[Math.min(idx,     ZONE_BACKGROUNDS.length - 1)]
  const b = ZONE_BACKGROUNDS[Math.min(idx + 1, ZONE_BACKGROUNDS.length - 1)]
  return new THREE.Color().lerpColors(a, b, frac)
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Scene3DProps {
  mouseRef:       React.MutableRefObject<{x: number; y: number}>
  scrollProgress: React.MutableRefObject<number>
  emergence:      React.MutableRefObject<number>
}

// ─── Camera — long cinematic dive through the particle field ──────────────────

function CameraController({scrollProgress}: {scrollProgress: React.MutableRefObject<number>}) {
  const {camera, gl} = useThree()
  const targetPos  = useMemo(() => new THREE.Vector3(0, 0, CAM_START_Z), [])
  const bgColor    = useMemo(() => new THREE.Color('#020204'), [])

  useFrame(() => {
    const t      = performance.now() / 1000
    const scroll = scrollProgress.current

    // Camera Z: travels from CAM_START_Z to CAM_END_Z with eased scroll
    const scrollEased = scroll < 0.5
      ? 2 * scroll * scroll
      : 1 - Math.pow(-2 * scroll + 2, 2) / 2

    const targetZ = CAM_START_Z + (CAM_END_Z - CAM_START_Z) * scrollEased

    // Micro float — overlapping sine waves, imperceptibly slow
    targetPos.x = Math.sin(t * 0.037) * 0.08 + Math.sin(t * 0.019) * 0.04
    targetPos.y = Math.cos(t * 0.028) * 0.06 + Math.cos(t * 0.013) * 0.03
    targetPos.z = targetZ

    // Inertia — camera glides, never snaps
    camera.position.lerp(targetPos, 0.03)
    camera.lookAt(0, 0, camera.position.z - 5)

    // Background: lerp between zone tints
    bgColor.lerp(lerpZoneBg(scroll), 0.04)
    gl.setClearColor(bgColor, 1)
  })

  return null
}

function EndingLight({scrollProgress}: {scrollProgress: React.MutableRefObject<number>}) {
  const warmRef = useRef<THREE.PointLight>(null)
  const rimRef = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    const scroll = scrollProgress.current
    const calmMix = THREE.MathUtils.smoothstep(scroll, 0.82, 1.0)

    if (warmRef.current) {
      warmRef.current.intensity = 0.2 + calmMix * 1.8
      warmRef.current.position.set(0, 2.4 + calmMix * 1.8, 2.5 + calmMix * 2.5)
    }
    if (rimRef.current) {
      rimRef.current.intensity = 0.12 + calmMix * 0.55
      rimRef.current.color.lerp(new THREE.Color('#f6ead8'), 0.03 + calmMix * 0.05)
    }
  })

  return (
    <>
      <ambientLight intensity={0.16} color="#b7c4de" />
      <pointLight ref={warmRef} color="#ffe2b8" intensity={0.2} distance={18} decay={1.2} />
      <directionalLight ref={rimRef} color="#d9d3ff" intensity={0.12} position={[2, 1, 3]} />
    </>
  )
}

// ─── Post-processing ──────────────────────────────────────────────────────────
// Aberration and bloom intensity react to scroll zones

function Effects({scrollProgress}: {scrollProgress: React.MutableRefObject<number>}) {
  const aberrationOffset = useMemo(() => new THREE.Vector2(0.0004, 0.0004), [])
  const bloomRef = useRef({intensity: 0.25})

  useFrame(() => {
    const t      = performance.now() / 1000
    const scroll = scrollProgress.current

    // Dark passage 1 (0.30–0.55): aberration spikes, bloom dims
    const inDarkZone1 = scroll > 0.28 && scroll < 0.58
    // Mid cluster (0.55–0.80): aberration calms, bloom warms
    const inMidCluster = scroll > 0.55 && scroll < 0.82

    const base    = inDarkZone1 ? 0.001 : 0.0004
    const wave    = Math.sin(t * 0.3) * 0.0003 + Math.sin(t * 0.17) * 0.0001
    const boost   = inDarkZone1 ? scroll * 0.008 : scroll * 0.002
    const glitch  = inDarkZone1 && Math.random() < 0.006
      ? Math.random() * 0.010 : 0

    aberrationOffset.x = base + wave + boost + glitch
    aberrationOffset.y = base + wave * 0.7 + boost + glitch * 0.4

    // Bloom: dim in dark passage, warm in mid cluster, high in zone 3 (crystal light)
    const inZone3     = scroll > 0.82
    const targetBloom = inDarkZone1 ? 0.06 : inZone3 ? 0.55 : inMidCluster ? 0.35 : 0.25
    bloomRef.current.intensity += (targetBloom - bloomRef.current.intensity) * 0.02

    // Aberration: calms to zero in zone 3
    if (inZone3) {
      aberrationOffset.x += (0.0001 - aberrationOffset.x) * 0.02
      aberrationOffset.y += (0.0001 - aberrationOffset.y) * 0.02
      return
    }
  })

  return (
    <EffectComposer>
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={aberrationOffset}
      />
      <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
      <Vignette offset={0.25} darkness={0.9} blendFunction={BlendFunction.NORMAL} />
      <Bloom luminanceThreshold={0.6} intensity={0.28} mipmapBlur />
    </EffectComposer>
  )
}

// ─── Main Canvas ──────────────────────────────────────────────────────────────

export function Scene3D({mouseRef, scrollProgress, emergence}: Scene3DProps) {
  return (
    <Canvas
      camera={{position: [0, 0, CAM_START_Z], fov: 60, near: 0.1, far: 80}}
      style={{position: 'fixed', inset: 0}}
      gl={{
        antialias:        true,
        alpha:            false,
        powerPreference:  'high-performance',
        stencil:          false,
        depth:            false,
      }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#020204']} />

      <ParticleSystem
        mouseRef={mouseRef}
        scrollProgress={scrollProgress}
        emergence={emergence}
      />

      <NeuronField
        scrollProgress={scrollProgress}
        emergence={emergence}
      />

      <CameraController scrollProgress={scrollProgress} />
      <EndingLight scrollProgress={scrollProgress} />
      <Effects scrollProgress={scrollProgress} />
    </Canvas>
  )
}
