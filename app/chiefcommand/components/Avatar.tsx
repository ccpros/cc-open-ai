'use client'

import { useGLTF, useAnimations } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function Avatar(props: any) {
  const group = useRef<THREE.Group | null>(null)
  const { scene, animations } = useGLTF('/models/avatar.glb')
  const { actions } = useAnimations(animations, group as React.MutableRefObject<THREE.Object3D>)

  useEffect(() => {
  const firstAnimation = Object.keys(actions)[0]
  const action = actions[firstAnimation]
  if (action) {
    action.reset().fadeIn(0.5).play()
  }
}, [actions])


  return <primitive ref={group} object={scene} {...props} />
}

useGLTF.preload('/models/avatar.glb')
