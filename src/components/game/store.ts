import { create } from 'zustand';

interface GameState {
  isPlaying: boolean;
  score: number;
  phase: 'legend' | 'lover';
  speed: number;
  gameOver: boolean;
  
  // Player State
  lane: number; // 0: Left, 1: Center, 2: Right
  setLane: (lane: number) => void;
  moveLeft: () => void;
  moveRight: () => void;

  // Audio State
  isPremierePlaying: boolean;
  togglePremiere: () => void;
  setPremiere: (playing: boolean) => void;

  // Actions
  startGame: () => void;
  endGame: () => void;
  incrementScore: (amount: number) => void;
  setPhase: (phase: 'legend' | 'lover') => void;
}

export const useGameStore = create<GameState>((set) => ({
  isPlaying: false,
  score: 0,
  phase: 'legend',
  speed: 10,
  gameOver: false,
  lane: 1, // Start in center
  
  isPremierePlaying: false,

  setLane: (lane) => set({ lane }),
  moveLeft: () => set((state) => ({ lane: Math.max(0, state.lane - 1) })),
  moveRight: () => set((state) => ({ lane: Math.min(2, state.lane + 1) })),

  togglePremiere: () => set((state) => ({ isPremierePlaying: !state.isPremierePlaying })),
  setPremiere: (playing) => set({ isPremierePlaying: playing }),

  startGame: () => set({ isPlaying: true, gameOver: false, score: 0, speed: 10 }),
  endGame: () => set({ isPlaying: false, gameOver: true }),
  incrementScore: (amount) => set((state) => ({ score: state.score + amount })),
  setPhase: (phase) => set({ phase }),
}));
