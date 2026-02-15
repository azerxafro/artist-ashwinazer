import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import * as THREE from 'three';

/** Floating particles along the track */
const TrackParticles: React.FC = () => {
  const count = 200;
  const { phase, speed, isPlaying } = useGameStore();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 40,
      y: Math.random() * 8 - 1,
      z: Math.random() * -80,
      speed: 0.3 + Math.random() * 0.7,
      scale: 0.02 + Math.random() * 0.06,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const moveSpeed = isPlaying ? speed * delta * 0.3 : delta * 2;

    particles.forEach((p, i) => {
      p.z += moveSpeed * p.speed;
      if (p.z > 10) {
        p.z = -80;
        p.x = (Math.random() - 0.5) * 40;
        p.y = Math.random() * 8 - 1;
      }
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const color = phase === 'legend' ? '#D4AF37' : '#ff0055';

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </instancedMesh>
  );
};

/** Ground plane with reflective dark surface */
const Ground: React.FC = () => {
  const { phase } = useGameStore();
  const color = phase === 'legend' ? '#D4AF37' : '#ff0055';

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -20]}>
      <planeGeometry args={[60, 120]} />
      <meshStandardMaterial
        color="#050505"
        metalness={0.9}
        roughness={0.15}
        emissive={color}
        emissiveIntensity={0.01}
      />
    </mesh>
  );
};

/** Lane markers — three glowing lines */
const LaneMarkers: React.FC = () => {
  const { phase } = useGameStore();
  const color = phase === 'legend' ? '#D4AF37' : '#ff0055';

  return (
    <group>
      {[-2, 0, 2].map((x, i) => (
        <mesh key={i} position={[x, -1.98, -20]}>
          <planeGeometry args={[0.02, 100]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
};

const World: React.FC = () => {
  const { speed, phase } = useGameStore();
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((_, delta) => {
    if (gridRef.current) {
      gridRef.current.position.z += speed * delta;
      if (gridRef.current.position.z > 10) {
        gridRef.current.position.z = 0;
      }
    }
  });

  const color = phase === 'legend' ? '#D4AF37' : '#ff0055';

  return (
    <group>
      {/* Subtle Grid */}
      <gridHelper
        ref={gridRef}
        args={[200, 80, `${color}20`, '#111111']}
        position={[0, -2, 0]}
      />

      {/* Ground plane with reflection */}
      <Ground />

      {/* Lane markers */}
      <LaneMarkers />

      {/* Atmospheric particles */}
      <TrackParticles />

      {/* Fog */}
      <fog attach="fog" args={['#000000', 8, 55]} />

      {/* Atmospheric lighting */}
      <pointLight position={[0, 5, -30]} color={color} intensity={2} distance={60} />
      <pointLight position={[-10, 3, -15]} color={color} intensity={0.5} distance={30} />
      <pointLight position={[10, 3, -15]} color={color} intensity={0.5} distance={30} />
    </group>
  );
};

export default World;
