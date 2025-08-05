import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Track, PlayerState } from '../types';

interface PlayerContextType {
  state: PlayerState;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

type PlayerAction =
  | { type: 'PLAY_TRACK'; payload: Track }
  | { type: 'PAUSE_TRACK' }
  | { type: 'RESUME_TRACK' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' };

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  shuffle: false,
  repeat: 'none',
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PLAY_TRACK':
      return {
        ...state,
        currentTrack: action.payload,
        isPlaying: true,
        currentTime: 0,
      };
    case 'PAUSE_TRACK':
      return { ...state, isPlaying: false };
    case 'RESUME_TRACK':
      return { ...state, isPlaying: true };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle };
    case 'TOGGLE_REPEAT':
      const repeatModes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
      const currentIndex = repeatModes.indexOf(state.repeat);
      const nextIndex = (currentIndex + 1) % repeatModes.length;
      return { ...state, repeat: repeatModes[nextIndex] };
    default:
      return state;
  }
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  const contextValue: PlayerContextType = {
    state,
    playTrack: (track) => dispatch({ type: 'PLAY_TRACK', payload: track }),
    pauseTrack: () => dispatch({ type: 'PAUSE_TRACK' }),
    resumeTrack: () => dispatch({ type: 'RESUME_TRACK' }),
    setVolume: (volume) => dispatch({ type: 'SET_VOLUME', payload: volume }),
    setCurrentTime: (time) => dispatch({ type: 'SET_CURRENT_TIME', payload: time }),
    toggleShuffle: () => dispatch({ type: 'TOGGLE_SHUFFLE' }),
    toggleRepeat: () => dispatch({ type: 'TOGGLE_REPEAT' }),
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}