import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useGameStore } from '../components/game/store';
import AudioManager from '../components/game/AudioManager';

import World from '../components/game/World';

import Player from '../components/game/Player';
import ObstaclesManager from '../components/game/ObstaclesManager';

// Placeholder for actual game scene
const GameScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <World />
      <Player />
      <ObstaclesManager />
    </>
  );
};

const LegendsGame: React.FC = () => {
  const { isPremierePlaying, togglePremiere, phase, setPhase, isPlaying, startGame, score, gameOver } = useGameStore();

  // Handle Space to Start
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' && !isPlaying) {
            startGame();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, startGame]);

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden font-sans">
      <AudioManager />

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
        <Suspense fallback={null}>
          <GameScene />
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10">
        
        {/* Header */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">
              Legends <span className="text-white/50">&</span> Lovers
            </h1>
            <p className="text-[10px] tracking-[0.2em] text-white/60">SCORE: {score.toString().padStart(6, '0')}</p>
          </div>
          
          <button 
             onClick={() => setPhase(phase === 'legend' ? 'lover' : 'legend')}
             className="px-4 py-1 text-[10px] border border-white/20 rounded-full text-white/60 hover:bg-white/10 transition-colors uppercase"
          >
             Switch Mood: {phase}
          </button>
        </div>

        {/* Game State Messages */}
        {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center flex-col z-20 pointer-events-auto">
                <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0 mb-4 tracking-tighter">
                    READY?
                </h2>
                <div className="px-6 py-2 border border-white/20 rounded-full bg-black/50 backdrop-blur-md">
                    <p className="text-xs tracking-widest text-white/80 animate-pulse">PRESS SPACE TO START</p>
                </div>
                <div className="mt-4 text-[10px] text-white/40 tracking-widest">
                    USE ARROW KEYS OR WASD TO MOVE
                </div>
            </div>
        )}

        {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center flex-col z-20 pointer-events-auto bg-black/80 backdrop-blur-sm">
                <h2 className="text-5xl md:text-7xl font-black text-[#ff0055] mb-2 tracking-tighter">GAME OVER</h2>
                <p className="text-xl text-white mb-8 tracking-widest">SCORE: {score}</p>
                
                <button 
                    onClick={startGame}
                    className="px-8 py-3 bg-white text-black font-bold tracking-widest rounded-full hover:scale-110 transition-transform"
                >
                    TRY AGAIN
                </button>
            </div>
        )}

        {/* Exclusive Player Controls */}
        <div className="pointer-events-auto self-center text-center">
            {isPremierePlaying ? (
                 <div className="animate-pulse">
                     <p className="text-[10px] tracking-[0.3em] text-accent mb-2">EXCLUSIVE PREMIERE</p>
                     <h2 className="text-3xl font-black text-white mb-6">THAPPU PANNITEN</h2>
                 </div>
            ) : null}

            <button
              onClick={togglePremiere}
              className={`px-8 py-3 rounded-full font-bold tracking-widest text-xs transition-all duration-300 transform hover:scale-105 ${
                  isPremierePlaying 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'bg-transparent border border-white/30 text-white hover:border-white hover:bg-white/5'
              }`}
            >
              {isPremierePlaying ? 'PAUSE PREMIERE' : 'LISTEN TO EXCLUSIVE'}
            </button>
        </div>

        {/* Footer */}
        <div className="text-center pointer-events-auto">
           <a href="/" className="text-[10px] text-white/30 hover:text-white transition-colors tracking-widest">EXIT TO HOME</a>
        </div>
      </div>
      
      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
    </div>
  );
};

export default LegendsGame;
