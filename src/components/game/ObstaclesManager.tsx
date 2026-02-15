import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import * as THREE from 'three';

const LANE_WIDTH = 2;
const SPAWN_RATE = 1.5;
const SPEED_MULTIPLIER = 1.0;

interface ObstacleData {
  id: number;
  lane: number;
  z: number;
  type: 'obstacle' | 'collectible';
}

/** Rotating collectible with glow */
const Collectible: React.FC<{ position: [number, number, number]; phase: string }> = ({ position, phase }) => {
  const ref = useRef<THREE.Mesh>(null);
  const color = phase === 'legend' ? '#FFD700' : '#ff66aa';

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 3;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.3;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.15;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          metalness={1}
          roughness={0}
        />
      </mesh>
      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>
      {/* Point light on collectible */}
      <pointLight color={color} intensity={1} distance={5} />
    </group>
  );
};

/** Obstacle with angular aggressive geometry */
const Obstacle: React.FC<{ position: [number, number, number]; phase: string }> = ({ position, phase }) => {
  const ref = useRef<THREE.Group>(null);
  const dangerColor = phase === 'legend' ? '#8B0000' : '#660033';

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[0.7, 1.2, 0.7]} />
        <meshStandardMaterial
          color={dangerColor}
          emissive={dangerColor}
          emissiveIntensity={0.8}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Top spike */}
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.3, 0.5, 4]} />
        <meshStandardMaterial
          color="#ff1111"
          emissive="#ff0000"
          emissiveIntensity={1.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Danger glow */}
      <pointLight color="#ff0000" intensity={0.5} distance={4} />
    </group>
  );
};

const ObstaclesManager: React.FC = () => {
  const { speed, isPlaying, gameOver, lane: playerLane, endGame, incrementScore, phase } = useGameStore();
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const lastSpawnTime = useRef(0);

  useFrame((state, delta) => {
    if (!isPlaying || gameOver) return;

    const time = state.clock.elapsedTime;

    // Spawning
    if (time - lastSpawnTime.current > (SPAWN_RATE / (speed * 0.1))) {
      const newLane = Math.floor(Math.random() * 3);
      const isCollectible = Math.random() > 0.75;

      setObstacles(prev => [
        ...prev,
        {
          id: Math.random(),
          lane: newLane,
          z: -50,
          type: isCollectible ? 'collectible' : 'obstacle'
        }
      ]);
      lastSpawnTime.current = time;
    }

    // Movement & Collision
    setObstacles(prev => {
      const next: ObstacleData[] = [];

      prev.forEach(obs => {
        obs.z += speed * delta * SPEED_MULTIPLIER;

        // Collision window
        if (obs.z > 2.5 && obs.z < 3.5) {
          if (obs.lane === playerLane) {
            if (obs.type === 'obstacle') {
              endGame();
            } else {
              incrementScore(100);
              return;
            }
          }
        }

        if (obs.z < 10) {
          next.push(obs);
        } else {
          if (obs.type === 'obstacle') incrementScore(10);
        }
      });

      return next;
    });
  });

  return (
    <>
      {obstacles.map(obs => {
        const pos: [number, number, number] = [(obs.lane - 1) * LANE_WIDTH, -0.5, obs.z];
        return obs.type === 'collectible' 
          ? <Collectible key={obs.id} position={pos} phase={phase} />
          : <Obstacle key={obs.id} position={pos} phase={phase} />;
      })}
    </>
  );
};

export default ObstaclesManager;
