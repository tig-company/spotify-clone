import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Track, PlayerState } from '../types';

interface PlayerContextType {
  state: PlayerState;
  playTrack: (track: Track, queue?: Track[]) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setQueue: (queue: Track[], startIndex?: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

type PlayerAction =
  | { type: 'PLAY_TRACK'; payload: { track: Track; queue?: Track[] } }
  | { type: 'PAUSE_TRACK' }
  | { type: 'RESUME_TRACK' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'SET_QUEUE'; payload: { queue: Track[]; startIndex?: number } };

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  shuffle: false,
  repeat: 'none',
  queue: [],
  currentIndex: -1,
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PLAY_TRACK':
      const { track, queue } = action.payload;
      const newQueue = queue || (state.queue.length > 0 ? state.queue : [track]);
      const trackIndex = newQueue.findIndex(t => t.id === track.id);
      return {
        ...state,
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
        queue: newQueue,
        currentIndex: trackIndex >= 0 ? trackIndex : 0,
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
    case 'NEXT_TRACK':
      if (state.queue.length === 0) return state;
      
      let nextIdx = state.currentIndex + 1;
      
      // Handle repeat modes
      if (state.repeat === 'one') {
        nextIdx = state.currentIndex; // Stay on same track
      } else if (nextIdx >= state.queue.length) {
        if (state.repeat === 'all') {
          nextIdx = 0; // Loop back to beginning
        } else {
          return state; // Don't advance if at end and no repeat
        }
      }
      
      return {
        ...state,
        currentTrack: state.queue[nextIdx],
        currentIndex: nextIdx,
        currentTime: 0,
      };
    case 'PREVIOUS_TRACK':
      if (state.queue.length === 0) return state;
      
      let prevIdx = state.currentIndex - 1;
      
      // Handle repeat modes
      if (state.repeat === 'one') {
        prevIdx = state.currentIndex; // Stay on same track
      } else if (prevIdx < 0) {
        if (state.repeat === 'all') {
          prevIdx = state.queue.length - 1; // Loop to end
        } else {
          return state; // Don't go back if at beginning and no repeat
        }
      }
      
      return {
        ...state,
        currentTrack: state.queue[prevIdx],
        currentIndex: prevIdx,
        currentTime: 0,
      };
    case 'SET_QUEUE':
      const { queue: queueTracks, startIndex = 0 } = action.payload;
      return {
        ...state,
        queue: queueTracks,
        currentIndex: startIndex,
        currentTrack: queueTracks[startIndex] || null,
        currentTime: 0,
      };
    default:
      return state;
  }
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  const contextValue: PlayerContextType = {
    state,
    playTrack: (track, queue) => dispatch({ type: 'PLAY_TRACK', payload: { track, queue } }),
    pauseTrack: () => dispatch({ type: 'PAUSE_TRACK' }),
    resumeTrack: () => dispatch({ type: 'RESUME_TRACK' }),
    setVolume: (volume) => dispatch({ type: 'SET_VOLUME', payload: volume }),
    setCurrentTime: (time) => dispatch({ type: 'SET_CURRENT_TIME', payload: time }),
    toggleShuffle: () => dispatch({ type: 'TOGGLE_SHUFFLE' }),
    toggleRepeat: () => dispatch({ type: 'TOGGLE_REPEAT' }),
    nextTrack: () => dispatch({ type: 'NEXT_TRACK' }),
    previousTrack: () => dispatch({ type: 'PREVIOUS_TRACK' }),
    setQueue: (queue, startIndex) => dispatch({ type: 'SET_QUEUE', payload: { queue, startIndex } }),
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