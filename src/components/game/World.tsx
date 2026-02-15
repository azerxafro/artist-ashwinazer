import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import * as THREE from 'three';

const World: React.FC = () => {
  const { speed, phase } = useGameStore();
  const gridRef = useRef<THREE.GridHelper>(null);
  const floorRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (gridRef.current) {
      // Simulate infinite movement by moving texture or z-position
      gridRef.current.position.z += speed * delta;
      if (gridRef.current.position.z > 10) {
        gridRef.current.position.z = 0;
      }
    }
  });

  const color = phase === 'legend' ? '#D4AF37' : '#ff0055';

  return (
    <group>
        {/* Infinite Grid */}
        <gridHelper 
            ref={gridRef} 
            args={[200, 50, color, '#222222']} 
            position={[0, -2, 0]} 
        />
        
        {/* Fog for depth fading */}
        <fog attach="fog" args={['#000000', 10, 50]} />
        
        {/* Ambient Particles or Stars can go here */}
    </group>
  );
};

export default World;
