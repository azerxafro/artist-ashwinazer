import React, { useEffect, useRef } from 'react';
import { useGameStore } from './store';

const AudioManager: React.FC = () => {
  const { isPremierePlaying, setPremiere } = useGameStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPremierePlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPremierePlaying]);

  const handleEnded = () => {
    setPremiere(false);
  };

  return (
    <div className="hidden">
      {/* Exclusive Track - "Thappu Panniten" */}
      {/* Security: Context Menu disabled on player to discourage download */}
      <audio
        ref={audioRef}
        src="/music/thappu-panniten.m4a"
        onEnded={handleEnded}
        onPause={() => setPremiere(false)}
        onPlay={() => setPremiere(true)}
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default AudioManager;
