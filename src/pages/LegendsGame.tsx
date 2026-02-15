import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useGameStore } from '../components/game/store';
import AudioManager from '../components/game/AudioManager';
import World from '../components/game/World';
import Player from '../components/game/Player';
import ObstaclesManager from '../components/game/ObstaclesManager';
import '../components/game/game.css';

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
    <div className="legends-game">
      <AudioManager />

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 2, 6], fov: 60 }} style={{ touchAction: 'none' }}>
        <Suspense fallback={null}>
          <GameScene />
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="game-overlay">
        
        {/* Header */}
        <div className="game-header">
          <div>
            <h1 className="game-title">
              Legends <span className="game-title-amp">&</span> Lovers
            </h1>
            <p className="game-score">SCORE: {score.toString().padStart(6, '0')}</p>
          </div>
          
          <button 
            onClick={() => setPhase(phase === 'legend' ? 'lover' : 'legend')}
            className="game-phase-btn"
          >
            Switch Mood: {phase}
          </button>
        </div>

        {/* Game State Messages */}
        {!isPlaying && !gameOver && (
          <div className="game-start-screen">
            <h2 className="game-ready-text">READY?</h2>
            <div className="game-start-pill">
              <p className="game-start-label">TAP OR PRESS SPACE TO START</p>
            </div>
            <div className="game-controls-hint">
              SWIPE OR USE ARROW KEYS TO MOVE
            </div>
          </div>
        )}

        {gameOver && (
          <div className="game-over-screen">
            <h2 className="game-over-title">GAME OVER</h2>
            <p className="game-over-score">SCORE: {score}</p>
            <button onClick={startGame} className="game-retry-btn">
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Exclusive Player Controls */}
        <div className="game-premiere-controls">
          {isPremierePlaying ? (
            <div className="game-premiere-info">
              <p className="game-premiere-label">EXCLUSIVE PREMIERE</p>
              <h2 className="game-premiere-title">THAPPU PANNITEN</h2>
            </div>
          ) : null}

          <button
            onClick={togglePremiere}
            className={`game-premiere-btn ${isPremierePlaying ? 'active' : ''}`}
          >
            {isPremierePlaying ? 'PAUSE PREMIERE' : 'LISTEN TO EXCLUSIVE'}
          </button>
        </div>

        {/* Footer */}
        <div className="game-footer">
          <a href="/" className="game-exit-link">EXIT TO HOME</a>
        </div>
      </div>
      
      {/* CRT Scanline Effect */}
      <div className="game-noise" />
      <div className="game-scanlines" />
    </div>
  );
};

export default LegendsGame;
