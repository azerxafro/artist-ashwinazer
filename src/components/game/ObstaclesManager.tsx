import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';

const LANE_WIDTH = 2;
const SPAWN_RATE = 1.5; // Seconds between spawns
const SPEED_MULTIPLIER = 1.0;

interface ObstacleData {
  id: number;
  lane: number; // 0, 1, 2
  z: number;
  type: 'obstacle' | 'collectible';
}

const ObstaclesManager: React.FC = () => {
  const { speed, isPlaying, gameOver, lane: playerLane, endGame, incrementScore } = useGameStore();
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const lastSpawnTime = useRef(0);
  
  useFrame((state, delta) => {
    if (!isPlaying || gameOver) return;

    const time = state.clock.elapsedTime;
    
    // Spawning logic
    if (time - lastSpawnTime.current > (SPAWN_RATE / (speed * 0.1))) {
      const newLane = Math.floor(Math.random() * 3);
      const isCollectible = Math.random() > 0.8; // 20% chance for collectible
      
      setObstacles(prev => [
        ...prev,
        {
          id: Math.random(),
          lane: newLane,
          z: -50, // Spawn far ahead
          type: isCollectible ? 'collectible' : 'obstacle'
        }
      ]);
      lastSpawnTime.current = time;
    }

    // Movement & Collision Logic
    setObstacles(prev => {
      const next: ObstacleData[] = [];
      
      prev.forEach(obs => {
        // Move towards player (positive Z)
        obs.z += speed * delta * SPEED_MULTIPLIER;
        
        // Collision Detection
        // Player is at z=3. Obstacle roughly width=1 depth=1.
        if (obs.z > 2.5 && obs.z < 3.5) {
             if (obs.lane === playerLane) {
                 if (obs.type === 'obstacle') {
                     endGame();
                 } else {
                     incrementScore(100);
                     return; // Collectible consumed
                 }
             }
        }
        
        // Remove if passed player
        if (obs.z < 10) {
            next.push(obs);
        } else {
            // Passed without collision (if obstacle)
            if (obs.type === 'obstacle') incrementScore(10);
        }
      });
      
      return next;
    });
  });

  return (
    <>
      {obstacles.map(obs => (
        <mesh key={obs.id} position={[(obs.lane - 1) * LANE_WIDTH, -0.5, obs.z]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial 
            color={obs.type === 'obstacle' ? '#444' : '#ffffff'} 
            emissive={obs.type === 'collectible' ? '#ffffff' : '#000000'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </>
  );
};

export default ObstaclesManager;
