import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import * as THREE from 'three';

const LANE_WIDTH = 2;
const SEGMENT_COUNT = 8;
const SEGMENT_SPACING = 0.45;
const SEGMENT_RADIUS = 0.22;

const Player: React.FC = () => {
  const { lane, phase, isPlaying, gameOver, moveLeft, moveRight, startGame } = useGameStore();
  const groupRef = useRef<THREE.Group>(null);
  const segmentRefs = useRef<THREE.Mesh[]>([]);
  const positionHistory = useRef<{ x: number; y: number }[]>([]);

  // Initialize position history
  useMemo(() => {
    positionHistory.current = Array.from({ length: SEGMENT_COUNT }, () => ({
      x: 0,
      y: -0.3,
    }));
  }, []);

  // Head material - emissive gold/pink
  const headMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      roughness: 0.15,
      metalness: 0.9,
    });
  }, []);

  // Body material
  const bodyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      roughness: 0.25,
      metalness: 0.7,
    });
  }, []);

  // Update colors reactively
  useEffect(() => {
    const headColor = phase === 'legend' ? '#D4AF37' : '#ff0055';
    const bodyColor = phase === 'legend' ? '#b8860b' : '#cc0044';
    headMaterial.color.set(headColor);
    headMaterial.emissive.set(headColor);
    headMaterial.emissiveIntensity = 0.6;
    bodyMaterial.color.set(bodyColor);
    bodyMaterial.emissive.set(bodyColor);
    bodyMaterial.emissiveIntensity = 0.3;
  }, [phase, headMaterial, bodyMaterial]);

  // Smooth movement + body trail
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const targetX = (lane - 1) * LANE_WIDTH;
    const headX = THREE.MathUtils.lerp(
      positionHistory.current[0].x,
      targetX,
      Math.min(delta * 12, 1)
    );
    const headY = isPlaying
      ? -0.3 + Math.sin(state.clock.elapsedTime * 8) * 0.08
      : -0.3;

    positionHistory.current[0] = { x: headX, y: headY };

    // Trail: each segment follows the previous one
    for (let i = 1; i < SEGMENT_COUNT; i++) {
      const prev = positionHistory.current[i - 1];
      const curr = positionHistory.current[i];
      curr.x = THREE.MathUtils.lerp(curr.x, prev.x, Math.min(delta * (10 - i), 1));
      curr.y = THREE.MathUtils.lerp(curr.y, prev.y - 0.02, Math.min(delta * 8, 1));
    }

    // Apply positions to segment meshes
    segmentRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pos = positionHistory.current[i];
      mesh.position.x = pos.x;
      mesh.position.y = pos.y;
      mesh.position.z = 3 + i * SEGMENT_SPACING;
      // Scale: head is biggest, tail tapers
      const scale = 1 - i * 0.08;
      mesh.scale.set(scale, scale, scale);
      // Undulation
      if (isPlaying) {
        mesh.position.y += Math.sin(state.clock.elapsedTime * 6 + i * 0.6) * 0.04;
      }
    });
  });

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isPlaying && !gameOver) {
        startGame();
        return;
      }
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        moveRight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, moveLeft, moveRight, startGame]);

  // Touch / Swipe controls — attached to .legends-game container, not window
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const gameContainer = document.querySelector('.legends-game');
    if (!gameContainer) return;

    const handleTouchStart = (e: Event) => {
      const te = e as TouchEvent;
      // Don't interfere with UI buttons
      const target = te.target as HTMLElement;
      if (target.closest('button, a, .game-premiere-controls')) return;

      startX = te.touches[0].clientX;
      startY = te.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e: Event) => {
      const te = e as TouchEvent;
      const target = te.target as HTMLElement;
      // Don't interfere with UI buttons
      if (target.closest('button, a, .game-premiere-controls')) return;

      const endX = te.changedTouches[0].clientX;
      const endY = te.changedTouches[0].clientY;
      const dx = endX - startX;
      const dy = endY - startY;
      const elapsed = Date.now() - startTime;

      const state = useGameStore.getState();

      // Tap detection: small movement + short duration
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20 && elapsed < 300) {
        if (!state.isPlaying && !state.gameOver) {
          state.startGame();
        }
        return;
      }

      // Swipe detection: enough horizontal distance and more horizontal than vertical
      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
        if (!state.isPlaying) return;
        if (dx > 0) {
          state.moveRight();
        } else {
          state.moveLeft();
        }
      }
    };

    gameContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    gameContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      gameContainer.removeEventListener('touchstart', handleTouchStart);
      gameContainer.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const color = phase === 'legend' ? '#D4AF37' : '#ff0055';

  return (
    <group ref={groupRef}>
      {/* Snake segments */}
      {Array.from({ length: SEGMENT_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) segmentRefs.current[i] = el; }}
          position={[0, -0.3, 3 + i * SEGMENT_SPACING]}
        >
          {i === 0 ? (
            <capsuleGeometry args={[SEGMENT_RADIUS * 1.2, SEGMENT_RADIUS * 0.8, 6, 12]} />
          ) : (
            <sphereGeometry args={[SEGMENT_RADIUS * (1 - i * 0.08), 12, 12]} />
          )}
          {i === 0 ? (
            <primitive object={headMaterial} attach="material" />
          ) : (
            <primitive object={bodyMaterial} attach="material" />
          )}
        </mesh>
      ))}

      {/* Eyes on the head */}
      <mesh position={[-0.12, -0.15, 2.78]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.12, -0.15, 2.78]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.8} />
      </mesh>

      {/* Glow light following the head */}
      <pointLight
        position={[positionHistory.current[0]?.x || 0, 0, 3]}
        distance={4}
        intensity={2}
        color={color}
      />
    </group>
  );
};

export default Player;
