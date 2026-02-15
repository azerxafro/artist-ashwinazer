import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GhostNumber {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  rotation: number;
}

/**
 * ThreeSixNine — Ambient floating "369" ghost numbers.
 * Like Juice WRLD's 999. Singularity & Oneness.
 * Ultra-low opacity, slow drift, never annoying.
 */
const ThreeSixNine: React.FC = () => {
  const [ghosts, setGhosts] = useState<GhostNumber[]>([]);
  const [counter, setCounter] = useState(0);

  const spawnGhost = useCallback(() => {
    const id = Date.now() + Math.random();
    const ghost: GhostNumber = {
      id,
      x: Math.random() * 90 + 5,
      y: Math.random() * 80 + 10,
      size: Math.random() * 40 + 20,
      opacity: Math.random() * 0.04 + 0.02, // 2-6% opacity
      duration: Math.random() * 8 + 12, // 12-20s drift
      delay: 0,
      rotation: Math.random() * 30 - 15,
    };
    setGhosts(prev => [...prev, ghost]);
    // Auto-remove after animation
    setTimeout(() => {
      setGhosts(prev => prev.filter(g => g.id !== id));
    }, ghost.duration * 1000);
  }, []);

  useEffect(() => {
    // Spawn first ghost after 3.69s
    const initial = setTimeout(() => {
      spawnGhost();
      setCounter(1);
    }, 3690);

    return () => clearTimeout(initial);
  }, [spawnGhost]);

  useEffect(() => {
    if (counter === 0) return;
    // Random interval between 6-15 seconds
    const interval = (Math.random() * 9 + 6) * 1000;
    const timer = setTimeout(() => {
      spawnGhost();
      setCounter(c => c + 1);
    }, interval);
    return () => clearTimeout(timer);
  }, [counter, spawnGhost]);

  const texts = ['3', '6', '9', '369', '3·6·9'];

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {ghosts.map((ghost) => (
          <motion.span
            key={ghost.id}
            className="absolute font-black select-none"
            style={{
              left: `${ghost.x}%`,
              top: `${ghost.y}%`,
              fontSize: `${ghost.size}px`,
              color: '#ff0055',
              opacity: 0,
              rotate: ghost.rotation,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{
              opacity: [0, ghost.opacity, ghost.opacity, 0],
              y: [20, 0, -30, -60],
              scale: [0.8, 1, 1, 0.9],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: ghost.duration,
              ease: 'linear',
              times: [0, 0.1, 0.8, 1],
            }}
          >
            {texts[Math.floor(Math.random() * texts.length)]}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ThreeSixNine;
