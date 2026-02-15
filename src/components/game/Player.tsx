import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import * as THREE from 'three';

const LANE_WIDTH = 2; // Distance between lanes

const Player: React.FC = () => {
  const { lane, phase, isPlaying } = useGameStore();
  const playerRef = useRef<THREE.Mesh>(null);
  
  // Smoothly interpolate position
  useFrame((state, delta) => {
    if (playerRef.current) {
      const targetX = (lane - 1) * LANE_WIDTH;
      // Simple lerp for smoothness
      playerRef.current.position.x = THREE.MathUtils.lerp(playerRef.current.position.x, targetX, delta * 10);
      
      // Add a slight bobbing motion
      if (isPlaying) {
         playerRef.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      }
    }
  });

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        useGameStore.getState().moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        useGameStore.getState().moveRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const color = phase === 'legend' ? '#D4AF37' : '#ff0055';

  return (
    <mesh ref={playerRef} position={[0, -0.5, 3]}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
      {/* Trail/Glow effect could go here */}
      <pointLight distance={3} intensity={2} color={color} />
    </mesh>
  );
};

export default Player;
