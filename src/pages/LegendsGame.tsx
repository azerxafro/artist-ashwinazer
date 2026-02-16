import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useGameStore } from '../components/game/store';
import AudioManager from '../components/game/AudioManager';
import World from '../components/game/World';
import Player from '../components/game/Player';
import ObstaclesManager from '../components/game/ObstaclesManager';
import '../components/game/game.css';

const GameScene: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const { phase } = useGameStore();
  const phaseColor = phase === 'legend' ? '#D4AF37' : '#ff0055';

  return (
    <>
      <ambientLight intensity={isMobile ? 0.25 : 0.15} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#ffffff" />
      {/* Colored rim lights — fewer on mobile */}
      <pointLight position={[-8, 4, -10]} color={phaseColor} intensity={1.5} distance={40} />
      <pointLight position={[8, 4, -10]} color={phaseColor} intensity={1.5} distance={40} />
      {!isMobile && (
        <pointLight position={[0, 6, -30]} color={phaseColor} intensity={2} distance={50} />
      )}
      <Stars
        radius={80}
        depth={60}
        count={isMobile ? 800 : 3000}
        factor={3}
        saturation={0.2}
        fade
        speed={0.5}
      />
      <World isMobile={isMobile} />
      <Player />
      <ObstaclesManager />
    </>
  );
};

const LegendsGame: React.FC = () => {
  const { isPremierePlaying, togglePremiere, phase, setPhase, isPlaying, startGame, score, gameOver } = useGameStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Space-to-start is handled by Player.tsx (with SFX)

  // Handle tap-to-start on start screen
  const handleStartTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!isPlaying && !gameOver) {
      startGame();
    }
  };

  // Handle tap-to-retry on game over screen
  const handleRetryTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    startGame();
  };

  const phaseLabel = phase === 'legend' ? 'LEGEND' : 'LOVER';
  const paddedScore = score.toString().padStart(6, '0');

  return (
    <div className="legends-game">
      <AudioManager />

      {/* 3D Scene */}
      <Canvas
        camera={{ position: isMobile ? [0, 3, 8] : [0, 2, 6], fov: isMobile ? 65 : 60 }}
        style={{ touchAction: 'none' }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <GameScene isMobile={isMobile} />
          <EffectComposer>
            <Bloom
              luminanceThreshold={isMobile ? 0.3 : 0.1}
              luminanceSmoothing={0.8}
              height={isMobile ? 200 : 400}
              intensity={isMobile ? 1.5 : 2.5}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Vignette effect — cinematic edge darkening */}
      <div className="game-vignette" />

      {/* UI Overlay */}
      <div className="game-overlay">

        {/* Header */}
        <div className="game-header">
          <div>
            <h1 className="game-title">
              Legends <span className="game-title-amp">&</span> Lovers
            </h1>
            <div className="game-score-wrapper">
              <p className="game-score">
                SCORE <span className="game-score-value">{paddedScore}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setPhase(phase === 'legend' ? 'lover' : 'legend')}
            className="game-phase-btn"
          >
            {isMobile ? phaseLabel : `MOOD · ${phaseLabel}`}
          </button>
        </div>

        {/* Start Screen */}
        {!isPlaying && !gameOver && (
          <div
            className="game-start-screen"
            onClick={handleStartTap}
          >
            <h2 className="game-ready-text">READY?</h2>
            <div className="game-start-pill">
              <p className="game-start-label">
                {isMobile ? 'TAP TO START' : 'PRESS SPACE TO START'}
              </p>
            </div>
            <div className="game-controls-hint">
              {isMobile ? 'SWIPE LEFT / RIGHT TO MOVE' : 'USE ARROW KEYS TO MOVE'}
            </div>
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div className="game-over-screen">
            <h2 className="game-over-title">GAME OVER</h2>
            <p className="game-over-score">SCORE: {paddedScore}</p>
            <button
              onClick={handleRetryTap}
              className="game-retry-btn"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Premiere Controls */}
        <div className="game-premiere-controls">
          {isPremierePlaying && !isMobile ? (
            <div className="game-premiere-info">
              <p className="game-premiere-label">EXCLUSIVE PREMIERE</p>
              <h2 className="game-premiere-title">THAPPU PANNITEN</h2>
            </div>
          ) : null}

          <button
            onClick={(e) => { e.stopPropagation(); togglePremiere(); }}
            onTouchEnd={(e) => { e.stopPropagation(); }}
            className={`game-premiere-btn ${isPremierePlaying ? 'active' : ''}`}
          >
            {isPremierePlaying ? '⏸ PAUSE' : '🎵 EXCLUSIVE'}
          </button>
        </div>

        {/* Footer */}
        <div className="game-footer">
          <a href="/" className="game-exit-link">EXIT TO HOME</a>
        </div>
      </div>

      {/* CRT Effects */}
      <div className="game-noise" />
      {!isMobile && <div className="game-scanlines" />}
    </div>
  );
};

export default LegendsGame;
