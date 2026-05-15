'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSpeech } from '@/hooks/useSpeech'

const StarShape = () => {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    const innerRadius = 0.4
    const outerRadius = 1
    const points = 5
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (i * Math.PI) / points
      if (i === 0) s.moveTo(Math.sin(angle) * radius, Math.cos(angle) * radius)
      else s.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius)
    }
    return s
  }, [])

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    }),
    []
  )

  return (
    <mesh castShadow receiveShadow>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#FFD700" roughness={0.4} metalness={0.1} />
    </mesh>
  )
}

function Particles({ count = 8, emotion }: { count?: number; emotion: string }) {
  const groupRef = useRef<THREE.Group>(null)

  const stars = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const angle = (i / count) * Math.PI * 2
      const radius = 1.5
      return {
        position: new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0),
        color: new THREE.Color().setHSL(i / count, 1, 0.5),
        offset: Math.random() * Math.PI * 2,
      }
    })
  }, [count])

  const starShape = useMemo(() => {
    const s = new THREE.Shape()
    const innerRadius = 0.05
    const outerRadius = 0.1
    const points = 5
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (i * Math.PI) / points
      if (i === 0) s.moveTo(Math.sin(angle) * radius, Math.cos(angle) * radius)
      else s.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius)
    }
    return s
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current && emotion === 'celebrate') {
      groupRef.current.rotation.z -= delta * 2
      groupRef.current.children.forEach((child, i) => {
        child.rotation.z += delta * 5
        const s = stars[i]
        const bounce = Math.sin(state.clock.elapsedTime * 5 + s.offset) * 0.2
        const currentRadius = 1.5 + bounce
        const angle = (i / count) * Math.PI * 2
        child.position.x = Math.cos(angle) * currentRadius
        child.position.y = Math.sin(angle) * currentRadius
      })
    }
  })

  if (emotion !== 'celebrate') return null

  return (
    <group ref={groupRef}>
      {stars.map((s, i) => (
        <mesh key={i} position={s.position}>
          <shapeGeometry args={[starShape]} />
          <meshBasicMaterial color={s.color} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

function Character({ isSpeaking, emotion }: { isSpeaking: boolean; emotion: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const eyesGroupRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const mouthRef = useRef<THREE.Mesh>(null)

  const blinkTimer = useRef(0)
  const blinkDuration = useRef(0)
  const mouthTimer = useRef(0)
  const mouthTargetScale = useRef(0.2)

  const spinAngle = useRef(0)

  useFrame((state, delta) => {
    if (!groupRef.current || !headRef.current || !eyesGroupRef.current || !leftEyeRef.current || !rightEyeRef.current || !mouthRef.current) return

    // 1. Idle Bobbing & Base Position
    let targetY = 0
    if (emotion === 'happy' || emotion === 'celebrate') {
      targetY = Math.abs(Math.sin(state.clock.elapsedTime * 4)) * 0.3
    } else if (emotion === 'sad') {
      targetY = -0.2
    } else {
      targetY = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1)

    // 2. Eye Tracking (Mouse)
    const mx = (state.pointer.x * Math.PI) / 12 // max ~15 deg
    const my = (state.pointer.y * Math.PI) / 12
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mx, 0.1)
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -my, 0.1)

    // 3. Blinking
    blinkTimer.current += delta
    if (blinkTimer.current > 3.5) {
      blinkDuration.current += delta
      const progress = blinkDuration.current / 0.15
      let scaleY = 1
      if (progress < 0.5) {
        scaleY = 1 - progress * 2 * 0.9 // close
      } else if (progress < 1) {
        scaleY = 0.1 + (progress - 0.5) * 2 * 0.9 // open
      } else {
        blinkTimer.current = 0
        blinkDuration.current = 0
        scaleY = 1
      }

      if ((emotion === 'happy' || emotion === 'celebrate') && scaleY === 1) {
        scaleY = 0.4 // squint
      }

      leftEyeRef.current.scale.y = scaleY
      rightEyeRef.current.scale.y = scaleY
    } else {
      const targetScaleY = (emotion === 'happy' || emotion === 'celebrate') ? 0.4 : 1
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, targetScaleY, 0.1)
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, targetScaleY, 0.1)
    }

    // 4. Mouth Sync & Emotion
    if (isSpeaking) {
      mouthTimer.current += delta
      if (mouthTimer.current > 0.15) {
        mouthTimer.current = 0
        mouthTargetScale.current = 0.3 + Math.random() * 0.7
      }
      mouthRef.current.rotation.z = Math.PI
    } else {
      if (emotion === 'happy' || emotion === 'celebrate') {
        mouthTargetScale.current = 0.8
        mouthRef.current.rotation.z = Math.PI
      } else if (emotion === 'sad') {
        mouthTargetScale.current = 0.3
        mouthRef.current.rotation.z = 0
      } else {
        mouthTargetScale.current = 0.2
        mouthRef.current.rotation.z = Math.PI
      }
    }

    mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, mouthTargetScale.current, 0.2)
    const targetScaleX = isSpeaking ? 0.8 : 1
    mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, targetScaleX, 0.2)

    // Sad eyes droop
    const eyeY = emotion === 'sad' ? -0.05 : 0
    eyesGroupRef.current.position.y = THREE.MathUtils.lerp(eyesGroupRef.current.position.y, eyeY, 0.1)

    // 5. Celebrate Spin
    if (emotion === 'celebrate') {
      spinAngle.current += delta * 5
      groupRef.current.rotation.y = spinAngle.current
    } else {
      spinAngle.current = THREE.MathUtils.lerp(spinAngle.current, 0, 0.1)
      groupRef.current.rotation.y = spinAngle.current
    }
  })

  return (
    <group ref={groupRef}>
      <group ref={headRef}>
        <StarShape />

        {/* Face */}
        <group position={[0, 0, 0.21]}>
          <group ref={eyesGroupRef} position={[0, 0.15, 0]}>
            {/* Left Eye */}
            <group position={[-0.25, 0, 0]}>
              <mesh ref={leftEyeRef}>
                <sphereGeometry args={[0.12, 32, 32]} />
                <meshBasicMaterial color="white" />
              </mesh>
              <mesh position={[0.02, 0.02, 0.1]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="black" />
              </mesh>
            </group>

            {/* Right Eye */}
            <group position={[0.25, 0, 0]}>
              <mesh ref={rightEyeRef}>
                <sphereGeometry args={[0.12, 32, 32]} />
                <meshBasicMaterial color="white" />
              </mesh>
              <mesh position={[-0.02, 0.02, 0.1]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="black" />
              </mesh>
            </group>
          </group>

          {/* Mouth: using a half circle */}
          <mesh ref={mouthRef} position={[0, -0.2, 0.05]} rotation={[0, 0, Math.PI]}>
            <circleGeometry args={[0.15, 32, 0, Math.PI]} />
            <meshBasicMaterial color="black" side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Particles */}
        <Particles emotion={emotion} />
      </group>
    </group>
  )
}

export type PoppyEmotion = 'idle' | 'happy' | 'sad' | 'celebrate'

export interface TalkingPoppyProps {
  emotion?: PoppyEmotion
  isSpeaking?: boolean
}

export function TalkingPoppy({ emotion = 'idle', isSpeaking = false }: TalkingPoppyProps) {
  const { speak } = useSpeech()

  const phrases = [
    "You're doing great!",
    "Keep going!",
    "You're so smart!",
    "I believe in you!",
    "Fantastic job!"
  ]

  const handleClick = () => {
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]
    speak(randomPhrase)
  }

  return (
    <div
      className="fixed bottom-4 right-4 w-20 h-20 z-50 cursor-pointer drop-shadow-xl hover:scale-110 transition-transform"
      onClick={handleClick}
      role="button"
      aria-label="Talking Poppy Mascot"
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        dpr={typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio) : 1}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Character isSpeaking={isSpeaking} emotion={emotion} />
      </Canvas>
    </div>
  )
}
