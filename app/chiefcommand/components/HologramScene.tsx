'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function BackgroundElements() {
  const groupRef = useRef<THREE.Group>(null)

  // Subtle hover animation
  useFrame(({ clock, mouse }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = mouse.x * 0.5
      groupRef.current.rotation.x = mouse.y * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      {/* Glowing grid floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30, 64, 64]} />
        <meshBasicMaterial
          wireframe
          color={'cyan'}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Floating light orb */}
      <Float speed={1.5} floatIntensity={2} rotationIntensity={1}>
        <mesh position={[0, 2, -3]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial emissive={'cyan'} color={'white'} />
        </mesh>
      </Float>
    </group>
  )
}

export default function HologramScene() {
  return (
    <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 3, 2]} intensity={1} color="cyan" />
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      <BackgroundElements />
      {/* Avatar will go here next */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}
