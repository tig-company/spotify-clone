import React from 'react';
import { renderHook, act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerProvider, usePlayer } from './PlayerContext';
import { Track } from '../types';
import { Player } from '../components/Player';

const mockTrack1: Track = {
  id: '1',
  title: 'Test Track 1',
  artist: 'Test Artist 1',
  album: 'Test Album 1',
  duration: 180,
  cover: 'https://example.com/cover1.jpg',
  audioUrl: 'https://example.com/audio1.mp3'
};

const mockTrack2: Track = {
  id: '2',
  title: 'Test Track 2',  
  artist: 'Test Artist 2',
  album: 'Test Album 2',
  duration: 200,
  cover: 'https://example.com/cover2.jpg',
  audioUrl: 'https://example.com/audio2.mp3'
};

const mockTrack3: Track = {
  id: '3',
  title: 'Test Track 3',
  artist: 'Test Artist 3',
  album: 'Test Album 3',
  duration: 220,
  cover: 'https://example.com/cover3.jpg',
  audioUrl: 'https://example.com/audio3.mp3'
};

// Additional test helpers
const createMockTrack = (id: string, title: string, artist: string): Track => ({
  id,
  title,
  artist,
  album: `Album ${id}`,
  duration: 180 + parseInt(id) * 10,
  cover: `https://example.com/cover${id}.jpg`,
  audioUrl: `https://example.com/audio${id}.mp3`
});

const mockQueue = [mockTrack1, mockTrack2, mockTrack3];

// Extended test data
const mockTrack4 = createMockTrack('4', 'Test Track 4', 'Test Artist 4');
const mockTrack5 = createMockTrack('5', 'Test Track 5', 'Test Artist 5');
const extendedMockQueue = [mockTrack1, mockTrack2, mockTrack3, mockTrack4, mockTrack5];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PlayerProvider>{children}</PlayerProvider>
);

// Mock HTMLAudioElement for tests
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: jest.fn(),
});

describe('PlayerContext', () => {
  describe('initial state', () => {
    it('should have correct initial values', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      
      expect(result.current.state.currentTrack).toBeNull();
      expect(result.current.state.isPlaying).toBe(false);
      expect(result.current.state.volume).toBe(1);
      expect(result.current.state.currentTime).toBe(0);
      expect(result.current.state.duration).toBe(0);
      expect(result.current.state.shuffle).toBe(false);
      expect(result.current.state.repeat).toBe('none');
      expect(result.current.state.queue).toEqual([]);
      expect(result.current.state.currentIndex).toBe(-1);
    });
  });

  describe('playTrack', () => {
    it('should start playing a track', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      
      act(() => {
        result.current.playTrack(mockTrack1);
      });
      
      expect(result.current.state.currentTrack).toEqual(mockTrack1);
      expect(result.current.state.isPlaying).toBe(true);
      expect(result.current.state.queue).toEqual([mockTrack1]);
      expect(result.current.state.currentIndex).toBe(0);
    });

    it('should set queue when provided', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      
      act(() => {
        result.current.playTrack(mockTrack2, mockQueue);
      });
      
      expect(result.current.state.currentTrack).toEqual(mockTrack2);
      expect(result.current.state.queue).toEqual(mockQueue);
      expect(result.current.state.currentIndex).toBe(1);
    });
  });

  describe('navigation', () => {
    it('should navigate to next track', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      
      act(() => {
        result.current.setQueue(mockQueue, 0);
        result.current.nextTrack();
      });
      
      expect(result.current.state.currentIndex).toBe(1);
      expect(result.current.state.currentTrack).toEqual(mockTrack2);
    });

    it('should navigate to previous track', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      
      act(() => {
        result.current.setQueue(mockQueue, 1);
        result.current.previousTrack();
      });
      
      expect(result.current.state.currentIndex).toBe(0);
      expect(result.current.state.currentTrack).toEqual(mockTrack1);
    });
  });

  describe('volume control', () => {
    it('should update volume', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      
      act(() => {
        result.current.setVolume(0.5);
      });
      
      expect(result.current.state.volume).toBe(0.5);
    });
  });

  describe('error handling', () => {
    it('should handle operations on empty state gracefully', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });
      
      // All operations should work even with empty state
      expect(() => {
        act(() => {
          result.current.pauseTrack();
          result.current.resumeTrack();
          result.current.nextTrack();
          result.current.previousTrack();
          result.current.toggleShuffle();
          result.current.toggleRepeat();
          result.current.setVolume(0.5);
          result.current.setCurrentTime(10);
        });
      }).not.toThrow();
    });
  });
});