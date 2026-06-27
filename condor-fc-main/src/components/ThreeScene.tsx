"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function EagleComet({ initialPosition, speed, scale, color, offset }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const wing1Ref = useRef<THREE.Group>(null);
  const wing2Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Fly left to right
      groupRef.current.position.x += speed * delta;
      
      // Smooth vertical bobbing
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + offset) * 0.01;

      // Flapping wings
      if (wing1Ref.current && wing2Ref.current) {
        // Fast, intense flapping
        const flap = Math.sin(state.clock.elapsedTime * 15 + offset) * 0.6;
        wing1Ref.current.rotation.x = flap;
        wing2Ref.current.rotation.x = -flap;
      }

      // Loop back when off screen to the right
      if (groupRef.current.position.x > 30) {
        groupRef.current.position.x = -30 - Math.random() * 20;
        groupRef.current.position.y = (Math.random() - 0.5) * 20;
        groupRef.current.position.z = (Math.random() - 0.5) * 15 - 5;
      }
    }
  });

  return (
    <group ref={groupRef} position={initialPosition} scale={scale}>
      
      {/* Eagle Body (Glowing core) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Head / Beak (Points Right +X) */}
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.4, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Comet Tail 1 (Points Left -X) */}
      <mesh position={[-1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.15, 2, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      
      {/* Comet Tail 2 (Longer, fainter) */}
      <mesh position={[-2.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.2, 5, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>

      {/* Far Wing (Sweeping away into -Z) */}
      <group position={[0, 0, -0.05]} ref={wing1Ref}>
        <mesh position={[0, 0, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.3, 1.2, 3]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
      </group>

      {/* Near Wing (Sweeping towards +Z) */}
      <group position={[0, 0, 0.05]} ref={wing2Ref}>
        <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.3, 1.2, 3]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
      </group>

    </group>
  );
}

export default function ThreeScene() {
  const eagles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      pos: [
        -30 + Math.random() * 60, // Spread out widely across X
        (Math.random() - 0.5) * 20, // Spread vertically
        (Math.random() - 0.5) * 20 - 5 // Spread in depth
      ],
      speed: 15 + Math.random() * 25, // Super fast, comet-like speed
      scale: 0.3 + Math.random() * 0.7, // Variation in size
      offset: Math.random() * 100, // Random animation offset
      color: Math.random() > 0.2 ? '#e60000' : '#ffffff' // Mostly Condor Red, some glowing white
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 15] }}>
        <ambientLight intensity={1} />
        {/* Fast moving stars to add to the speed effect */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={3} />
        
        {eagles.map(eagle => (
          <EagleComet 
            key={eagle.id} 
            initialPosition={eagle.pos} 
            speed={eagle.speed} 
            scale={eagle.scale} 
            color={eagle.color}
            offset={eagle.offset}
          />
        ))}
        
      </Canvas>
    </div>
  );
}
