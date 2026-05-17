'use client'

import {useRef, useMemo} from 'react'
import {useFrame, useThree} from '@react-three/fiber'
import * as THREE from 'three'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParticleSystemProps {
  mouseRef: React.MutableRefObject<{x: number; y: number}>
  scrollProgress: React.MutableRefObject<number>
  emergence: React.MutableRefObject<number>
}

interface ParticleUniforms {
  uTime:       THREE.IUniform<number>
  uMouseWorld: THREE.IUniform<THREE.Vector3>
  uScroll:     THREE.IUniform<number>
  uEmergence:  THREE.IUniform<number>
  uCameraZ:    THREE.IUniform<number>
  uColorCore:  THREE.IUniform<THREE.Color>
  uColorEdge:  THREE.IUniform<THREE.Color>
  uColorWarm:  THREE.IUniform<THREE.Color>
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Camera Z travel: 5 (start) → -14 (end)
const PARTICLE_COUNT = 7500

// ─── Vertex Shader ────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uMouseWorld;
  uniform float uScroll;
  uniform float uEmergence;
  uniform float uCameraZ;

  attribute float aPhase;
  attribute float aSize;
  attribute float aZoneId;

  varying float vAlpha;
  varying vec3  vColor;

  float hash2(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a  = hash2(i.xy + i.z * 17.0);
    float b  = hash2(i.xy + vec2(1.0,0.0) + i.z * 17.0);
    float c  = hash2(i.xy + vec2(0.0,1.0) + i.z * 17.0);
    float d  = hash2(i.xy + vec2(1.0,1.0) + i.z * 17.0);
    float e  = hash2(i.xy + (i.z+1.0)*17.0);
    float f2 = hash2(i.xy + vec2(1.0,0.0) + (i.z+1.0)*17.0);
    float g  = hash2(i.xy + vec2(0.0,1.0) + (i.z+1.0)*17.0);
    float h  = hash2(i.xy + vec2(1.0,1.0) + (i.z+1.0)*17.0);
    return mix(
      mix(mix(a,b,f.x),mix(c,d,f.x),f.y),
      mix(mix(e,f2,f.x),mix(g,h,f.x),f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v=0.0; float a=0.5; vec3 s=vec3(100.0);
    for(int i=0;i<4;i++){v+=a*vnoise(p);p=p*2.0+s;a*=0.5;}
    return v;
  }

  void main() {
    vec3 pos = position;

    // ── Organic drift ──────────────────────────────────────────────────────
    float t  = uTime * 0.16 + aPhase * 6.2832;
    vec3 nc  = pos * 0.3 + vec3(t*0.05, t*0.04, t*0.06);
    float nx = (fbm(nc)                     - 0.5) * 2.0;
    float ny = (fbm(nc + vec3(3.7,0.0,0.0)) - 0.5) * 2.0;
    float nz = (fbm(nc + vec3(0.0,4.3,0.0)) - 0.5) * 0.8;

    pos.x += nx * 0.55;
    pos.y += ny * 0.55;
    pos.z += nz * 0.25;

    // ── Mouse repulsion ────────────────────────────────────────────────────
    vec3  toMouse = pos - uMouseWorld;
    float mDist   = length(toMouse);
    float mInfl   = 1.0 - smoothstep(0.0, 3.0, mDist);
    pos += normalize(toMouse + vec3(0.001)) * mInfl * 1.1;

    // ── Depth focal-plane brightness ──────────────────────────────────────
    float distZ      = pos.z - uCameraZ;
    float aheadFade  = 1.0 - smoothstep(0.5, 6.0, distZ);
    float behindFade = 1.0 - smoothstep(1.0, 8.0, -distZ);
    float focalAlpha = aheadFade * behindFade;

    // ── Emergence ─────────────────────────────────────────────────────────
    float emerge = smoothstep(aPhase*0.25, aPhase*0.25+0.75, uEmergence);

    // ── Flicker noise ─────────────────────────────────────────────────────
    float flicker = 0.25 + 0.75 * vnoise(nc * 1.4 + vec3(t*0.025));

    // ── Zone colour ───────────────────────────────────────────────────────
    // aZoneId: 0=front(cool), 0.5=mist, 1=dark1, 2=mid(warm), 3=resolution(crystal)
    float warmMix;
    float isZone3 = 0.0;

    if (aZoneId < 0.1) {
      warmMix = 0.0;        // zone 0: cool off-white
    } else if (aZoneId < 0.9) {
      warmMix = 0.12;       // atmospheric mist: barely warm
    } else if (aZoneId < 1.5) {
      warmMix = 0.38;       // zone 1 dark passage: slightly warm
    } else if (aZoneId < 2.5) {
      warmMix = 0.88;       // zone 2 warm cluster: amber
    } else {
      warmMix = 0.0;        // zone 3: cool again → crystal white
      isZone3 = 1.0;
    }

    vAlpha = emerge * flicker * focalAlpha;
    vColor = vec3(warmMix, isZone3, 0.0);

    vec4 mvPos   = modelViewMatrix * vec4(pos, 1.0);
    gl_Position  = projectionMatrix * mvPos;

    // ── Point size — reduced scale to prevent blobs ───────────────────────
    float sz     = aSize * (1.0 + mInfl * 0.6);
    gl_PointSize = sz * (65.0 / max(0.1, -mvPos.z));
  }
`

// ─── Fragment Shader ──────────────────────────────────────────────────────────

const fragmentShader = /* glsl */ `
  uniform vec3 uColorCore;
  uniform vec3 uColorEdge;
  uniform vec3 uColorWarm;

  varying float vAlpha;
  varying vec3  vColor;   // x = warmMix, y = isZone3

  void main() {
    vec2  uv   = gl_PointCoord - 0.5;
    float dist = length(uv);
    float mask = 1.0 - smoothstep(0.28, 0.5, dist);
    if (mask < 0.01) discard;

    float warmMix = vColor.x;
    float isZone3 = vColor.y;

    // Cool palette: off-white core → slate-blue edge
    vec3 cool = mix(uColorCore, uColorEdge, clamp(dist*2.2, 0.0, 1.0));
    // Warm palette: amber core → deep warm edge
    vec3 warm = mix(uColorWarm, vec3(0.55, 0.38, 0.28), clamp(dist*2.2, 0.0, 1.0));
    // Crystal palette: bright silver-white (zone 3 — peace / light)
    vec3 crystal = mix(vec3(0.96, 0.97, 1.0), vec3(0.72, 0.80, 0.92), clamp(dist*2.2, 0.0, 1.0));

    vec3 baseColor  = mix(cool, warm, warmMix);
    vec3 finalColor = mix(baseColor, crystal, isZone3);

    gl_FragColor = vec4(finalColor, mask * clamp(vAlpha, 0.0, 1.0));
  }
`

// ─── Geometry builder ─────────────────────────────────────────────────────────
//
//  Particle distribution across camera journey (z: 5 → -14):
//
//  Zone 0  — Front cluster     z:  1 →  5  (cool, bright)   25%
//  Zone 1  — Dark passage 1    z: -3 →  1  (sparse)          4%
//  Zone 2  — Mid cluster       z: -8 → -3  (warm amber)      23%
//  Zone 3  — Resolution/light  z:-14 → -8  (crystal white)   18%
//  Mist    — Full journey      z:-14 →  5  (atmospheric)     30%
//
//  Size distribution — bimodal:
//    75% micro-dust  (0.08–0.36)  — star-field grain
//    25% accent node (0.28–0.73)  — brighter focal points

function buildGeometry() {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const phases    = new Float32Array(PARTICLE_COUNT)
  const sizes     = new Float32Array(PARTICLE_COUNT)
  const zoneIds   = new Float32Array(PARTICLE_COUNT)

  const rand  = () => Math.random()
  const gauss = () => {
    const u = 1 - rand(); const v = rand()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }

  const zones = [
    {id: 0,   weight: 0.25, zMin:  1, zMax:  5,  spread: 4.0, mist: false},
    {id: 1,   weight: 0.04, zMin: -3, zMax:  1,  spread: 6.5, mist: false},
    {id: 2,   weight: 0.23, zMin: -8, zMax: -3,  spread: 3.5, mist: false},
    {id: 3,   weight: 0.18, zMin:-14, zMax: -8,  spread: 5.0, mist: false},
    // Atmospheric mist fills the dark passages and gives depth
    {id: 0.5, weight: 0.30, zMin:-14, zMax:  5,  spread: 9.5, mist: true},
  ]

  let idx = 0
  zones.forEach(zone => {
    const count = Math.floor(PARTICLE_COUNT * zone.weight)
    for (let i = 0; i < count && idx < PARTICLE_COUNT; i++, idx++) {
      const t = rand()
      positions[idx*3]   = gauss() * zone.spread * 0.5
      positions[idx*3+1] = gauss() * zone.spread * 0.4
      positions[idx*3+2] = zone.zMin + t * (zone.zMax - zone.zMin)

      phases[idx]  = rand()
      zoneIds[idx] = zone.id

      if (zone.mist) {
        // Mist: always ultra-tiny for subtle atmosphere
        sizes[idx] = rand() * 0.16 + 0.04
      } else {
        // Bimodal: 75% micro-dust, 25% accent
        sizes[idx] = rand() < 0.75
          ? rand() * 0.28 + 0.08   // micro-dust:  0.08–0.36
          : rand() * 0.45 + 0.28   // accent node: 0.28–0.73
      }
    }
  })

  return {positions, phases, sizes, zoneIds}
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ParticleSystem({mouseRef, scrollProgress, emergence}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const {camera} = useThree()

  const {positions, phases, sizes, zoneIds} = useMemo(buildGeometry, [])

  const uniforms = useMemo<ParticleUniforms>(() => ({
    uTime:       {value: 0},
    uMouseWorld: {value: new THREE.Vector3()},
    uScroll:     {value: 0},
    uEmergence:  {value: 0},
    uCameraZ:    {value: 5},
    uColorCore:  {value: new THREE.Color('#dedad4')},   // warm off-white
    uColorEdge:  {value: new THREE.Color('#7888a8')},   // muted slate blue
    uColorWarm:  {value: new THREE.Color('#c8a882')},   // warm amber (zone 2)
  }), [])

  const rayPlane  = useMemo(() => new THREE.Plane(new THREE.Vector3(0,0,1), 0), [])
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const worldPt   = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const mat = pointsRef.current?.material as THREE.ShaderMaterial | undefined
    if (!mat) return

    mat.uniforms.uTime.value      = performance.now() / 1000
    mat.uniforms.uScroll.value    = scrollProgress.current
    mat.uniforms.uEmergence.value = emergence.current
    mat.uniforms.uCameraZ.value   = camera.position.z

    raycaster.setFromCamera(mouseRef.current, camera)
    raycaster.ray.intersectPlane(rayPlane, worldPt)
    ;(mat.uniforms.uMouseWorld.value as THREE.Vector3).lerp(worldPt, 0.06)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase"   args={[phases,    1]} />
        <bufferAttribute attach="attributes-aSize"    args={[sizes,     1]} />
        <bufferAttribute attach="attributes-aZoneId"  args={[zoneIds,   1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms as unknown as {[k: string]: THREE.IUniform}}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
