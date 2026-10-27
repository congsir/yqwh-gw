import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Ink ribbon — elegant flowing ribbon with autumn gold accents */
function InkRibbon({ count = 3 }) {
  const group = useRef()
  const ribbons = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const points = []
      const segments = 64
      const phase = (i / count) * Math.PI * 2
      const radius = 1.6 + i * 0.35
      for (let j = 0; j <= segments; j++) {
        const t = j / segments
        const angle = t * Math.PI * 2.4 + phase
        const y = (t - 0.5) * 3.2
        const x = Math.cos(angle) * radius * (0.55 + 0.45 * Math.sin(t * Math.PI))
        const z = Math.sin(angle) * radius * 0.85
        points.push(new THREE.Vector3(x, y, z))
      }
      const curve = new THREE.CatmullRomCurve3(points)
      curve.curveType = 'centripetal'
      const tube = new THREE.TubeGeometry(curve, 120, 0.035 + i * 0.012, 8, false)
      return { tube, i }
    })
  }, [count])

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.rotation.y = t * 0.12
    group.current.rotation.x = Math.sin(t * 0.2) * 0.08
  })

  return (
    <group ref={group}>
      {ribbons.map(({ tube, i }) => (
        <mesh key={i} geometry={tube}>
          <meshStandardMaterial
            color={i === 1 ? '#C4A574' : i === 0 ? '#E8D5A8' : '#8B6B3D'}
            metalness={0.65}
            roughness={0.28}
            emissive={i === 1 ? '#C4A574' : '#000000'}
            emissiveIntensity={i === 1 ? 0.15 : 0}
            transparent
            opacity={0.88 - i * 0.12}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Floating ink particles */
function Particles({ count = 180 }) {
  const ref = useRef()
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      speeds[i] = 0.15 + Math.random() * 0.35
    }
    return { positions, speeds }
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t * speeds[i] + i) * 0.0015
      pos[i * 3] += Math.cos(t * speeds[i] * 0.7 + i) * 0.001
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.rotation.y = t * 0.03
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#C4A574"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/** Soft glowing orb — ink droplet core */
function InkCore() {
  const mesh = useRef()
  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    const s = 1 + Math.sin(t * 0.8) * 0.04
    mesh.current.scale.setScalar(s)
  })
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.55, 48, 48]} />
      <meshStandardMaterial
        color="#1C222C"
        metalness={0.8}
        roughness={0.35}
        emissive="#C4A574"
        emissiveIntensity={0.18}
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} color="#F5F0E8" />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#C4A574" />
      <pointLight position={[2, 1, -3]} intensity={0.35} color="#A85A4A" />
      <InkCore />
      <InkRibbon />
      <Particles />
      <fog attach="fog" args={['#0B0D10', 4.5, 12]} />
    </>
  )
}

export default function HeroScene() {
  return (
    <div className="hero-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.2, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
        fallback={null}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="hero-canvas__fallback" />
    </div>
  )
}
