import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { PlayerProvider, usePlayer } from './PlayerContext';
import { Track } from '../types';

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

const mockQueue = [mockTrack1, mockTrack2, mockTrack3];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PlayerProvider>{children}</PlayerProvider>
);

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
    it('should play a track without queue', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.playTrack(mockTrack1);
      });

      expect(result.current.state.currentTrack).toEqual(mockTrack1);
      expect(result.current.state.isPlaying).toBe(true);
      expect(result.current.state.currentTime).toBe(0);
      expect(result.current.state.queue).toEqual([mockTrack1]);
      expect(result.current.state.currentIndex).toBe(0);
    });

    it('should play a track with queue', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.playTrack(mockTrack2, mockQueue);
      });

      expect(result.current.state.currentTrack).toEqual(mockTrack2);
      expect(result.current.state.isPlaying).toBe(true);
      expect(result.current.state.queue).toEqual(mockQueue);
      expect(result.current.state.currentIndex).toBe(1); // mockTrack2 is at index 1
    });
  });

  describe('nextTrack', () => {
    it('should advance to next track in queue', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.setQueue(mockQueue, 0);
      });

      act(() => {
        result.current.nextTrack();
      });

      expect(result.current.state.currentTrack).toEqual(mockTrack2);
      expect(result.current.state.currentIndex).toBe(1);
      expect(result.current.state.currentTime).toBe(0);
    });

    it('should not advance beyond queue end when repeat is none', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.setQueue(mockQueue, 2); // Start at last track
      });

      act(() => {
        result.current.nextTrack();
      });

      // Should stay on the same track
      expect(result.current.state.currentTrack).toEqual(mockTrack3);
      expect(result.current.state.currentIndex).toBe(2);
    });

    it('should loop to beginning when repeat is all', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.setQueue(mockQueue, 2); // Start at last track
        result.current.toggleRepeat(); // Set to 'one'
        result.current.toggleRepeat(); // Set to 'all'
      });

      act(() => {
        result.current.nextTrack();
      });

      expect(result.current.state.currentTrack).toEqual(mockTrack1);
      expect(result.current.state.currentIndex).toBe(0);
    });

    it('should stay on same track when repeat is one', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.setQueue(mockQueue, 1);
        result.current.toggleRepeat(); // Set to 'one'
      });

      act(() => {
        result.current.nextTrack();
      });

      expect(result.current.state.currentTrack).toEqual(mockTrack2);
      expect(result.current.state.currentIndex).toBe(1);
    });
  });

  describe('previousTrack', () => {
    it('should go to previous track in queue', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.setQueue(mockQueue, 1);
      });

      act(() => {
        result.current.previousTrack();
      });

      expect(result.current.state.currentTrack).toEqual(mockTrack1);
      expect(result.current.state.currentIndex).toBe(0);
      expect(result.current.state.currentTime).toBe(0);
    });

    it('should not go before queue start when repeat is none', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.setQueue(mockQueue, 0); // Start at first track
      });

      act(() => {
        result.current.previousTrack();
      });

      // Should stay on the same track
      expect(result.current.state.currentTrack).toEqual(mockTrack1);
      expect(result.current.state.currentIndex).toBe(0);
    });

    it('should loop to end when repeat is all', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.setQueue(mockQueue, 0); // Start at first track
        result.current.toggleRepeat(); // Set to 'one'
        result.current.toggleRepeat(); // Set to 'all'
      });

      act(() => {
        result.current.previousTrack();
      });

      expect(result.current.state.currentTrack).toEqual(mockTrack3);
      expect(result.current.state.currentIndex).toBe(2);
    });
  });

  describe('setQueue', () => {
    it('should set queue and start at specified index', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.setQueue(mockQueue, 1);
      });

      expect(result.current.state.queue).toEqual(mockQueue);
      expect(result.current.state.currentIndex).toBe(1);
      expect(result.current.state.currentTrack).toEqual(mockTrack2);
      expect(result.current.state.currentTime).toBe(0);
    });

    it('should default to index 0 if not specified', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.setQueue(mockQueue);
      });

      expect(result.current.state.currentIndex).toBe(0);
      expect(result.current.state.currentTrack).toEqual(mockTrack1);
    });
  });

  describe('playback controls', () => {
    it('should pause and resume track', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.playTrack(mockTrack1);
      });

      expect(result.current.state.isPlaying).toBe(true);

      act(() => {
        result.current.pauseTrack();
      });

      expect(result.current.state.isPlaying).toBe(false);

      act(() => {
        result.current.resumeTrack();
      });

      expect(result.current.state.isPlaying).toBe(true);
    });

    it('should set volume', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      act(() => {
        result.current.setVolume(0.5);
      });

      expect(result.current.state.volume).toBe(0.5);
    });

    it('should toggle shuffle', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      expect(result.current.state.shuffle).toBe(false);

      act(() => {
        result.current.toggleShuffle();
      });

      expect(result.current.state.shuffle).toBe(true);
    });

    it('should cycle through repeat modes', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      expect(result.current.state.repeat).toBe('none');

      act(() => {
        result.current.toggleRepeat();
      });

      expect(result.current.state.repeat).toBe('one');

      act(() => {
        result.current.toggleRepeat();
      });

      expect(result.current.state.repeat).toBe('all');

      act(() => {
        result.current.toggleRepeat();
      });

      expect(result.current.state.repeat).toBe('none');
    });
  });
});