import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerProvider, usePlayer } from '../contexts/PlayerContext';
import { Player } from './Player';
import { Track } from '../types';

// Mock test data
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

// Test component to control player from tests
const TestController = ({ 
  onPlayerReady 
}: { 
  onPlayerReady?: (playerActions: any) => void 
}) => {
  const playerActions = usePlayer();
  
  React.useEffect(() => {
    if (onPlayerReady) {
      onPlayerReady(playerActions);
    }
  }, [onPlayerReady, playerActions]);
  
  return null;
};

const PlayerTestHarness = ({ 
  onPlayerReady 
}: { 
  onPlayerReady?: (playerActions: any) => void 
}) => (
  <PlayerProvider>
    <Player />
    {onPlayerReady && <TestController onPlayerReady={onPlayerReady} />}
  </PlayerProvider>
);

// Mock HTMLAudioElement
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

Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
});

Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
  writable: true,
  value: 0,
});

Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
  writable: true,
  value: 1,
});

describe('Player End-to-End Tests', () => {
  describe('Complete User Workflow: Playing a Single Track', () => {
    it('should handle complete single track playback workflow', async () => {
      let playerActions: any;
      const user = userEvent;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Initially, play button should be disabled
      expect(screen.getByLabelText('Play')).toBeDisabled();
      
      // Load a track
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        // Track info should be displayed
        expect(screen.getByText('Test Track 1')).toBeInTheDocument();
        expect(screen.getByText('Test Artist 1')).toBeInTheDocument();
        expect(screen.getByAltText('Test Track 1')).toBeInTheDocument();
        
        // Play button should show pause icon (track is playing)
        expect(screen.getByLabelText('Pause')).toBeInTheDocument();
      });
      
      // Pause the track
      const pauseButton = screen.getByLabelText('Pause');
      await user.click(pauseButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Play')).toBeInTheDocument();
        expect(playerActions.state.isPlaying).toBe(false);
      });
      
      // Resume the track
      const playButton = screen.getByLabelText('Play');
      await user.click(playButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Pause')).toBeInTheDocument();
        expect(playerActions.state.isPlaying).toBe(true);
      });
      
      // Test volume adjustment through player context
      const volumeSlider = screen.getByLabelText('Music player').querySelector('[role="slider"]') as HTMLElement;
      expect(volumeSlider).toBeInTheDocument();
      
      // Test volume adjustment through context instead of direct slider interaction
      act(() => {
        playerActions.setVolume(0.5);
      });
      
      await waitFor(() => {
        expect(playerActions.state.volume).toBe(0.5);
      });
    });
  });

  describe('Complete User Workflow: Queue Navigation', () => {
    it('should handle complete queue navigation workflow', async () => {
      let playerActions: any;
      const user = userEvent;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Set up a queue
      act(() => {
        act(() => {
        playerActions.setQueue(mockQueue, 1);
      }); // Start at middle track
      });
      
      await waitFor(() => {
        // Should show current track (Track 2)
        expect(screen.getByText('Test Track 2')).toBeInTheDocument();
        expect(screen.getByText('Test Artist 2')).toBeInTheDocument();
        
        // Both navigation buttons should be enabled
        expect(screen.getByLabelText('Previous track')).not.toBeDisabled();
        expect(screen.getByLabelText('Next track')).not.toBeDisabled();
      });
      
      // Navigate to next track
      const nextButton = screen.getByLabelText('Next track');
      await user.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test Track 3')).toBeInTheDocument();
        expect(screen.getByText('Test Artist 3')).toBeInTheDocument();
        expect(playerActions.state.currentIndex).toBe(2);
        
        // Next should be disabled (at end of queue)
        expect(screen.getByLabelText('Next track')).toBeDisabled();
      });
      
      // Navigate back to previous track
      const prevButton = screen.getByLabelText('Previous track');
      await user.click(prevButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test Track 2')).toBeInTheDocument();
        expect(screen.getByText('Test Artist 2')).toBeInTheDocument();
        expect(playerActions.state.currentIndex).toBe(1);
        
        // Both buttons should be enabled again
        expect(screen.getByLabelText('Previous track')).not.toBeDisabled();
        expect(screen.getByLabelText('Next track')).not.toBeDisabled();
      });
      
      // Navigate to first track
      await user.click(prevButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test Track 1')).toBeInTheDocument();
        expect(screen.getByText('Test Artist 1')).toBeInTheDocument();
        expect(playerActions.state.currentIndex).toBe(0);
        
        // Previous should be disabled (at start of queue)
        expect(screen.getByLabelText('Previous track')).toBeDisabled();
      });
    });
  });

  describe('Complete User Workflow: Repeat Modes', () => {
    it('should handle complete repeat mode workflow', async () => {
      let playerActions: any;
      const user = userEvent;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Set up queue at last position
      act(() => {
        playerActions.setQueue(mockQueue, mockQueue.length - 1);
      });
      
      await waitFor(() => {
        // Should be at last track
        expect(screen.getByText('Test Track 3')).toBeInTheDocument();
        expect(screen.getByLabelText('Next track')).toBeDisabled();
      });
      
      // Enable repeat all mode
      act(() => {
        playerActions.toggleRepeat(); // none -> one
        playerActions.toggleRepeat(); // one -> all
      });
      
      await waitFor(() => {
        // Next button should now be enabled
        expect(screen.getByLabelText('Next track')).not.toBeDisabled();
      });
      
      // Navigate to next (should loop to beginning)
      const nextButton = screen.getByLabelText('Next track');
      await user.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test Track 1')).toBeInTheDocument();
        expect(playerActions.state.currentIndex).toBe(0);
      });
      
      // Navigate to previous (should loop to end)
      const prevButton = screen.getByLabelText('Previous track');
      await user.click(prevButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test Track 3')).toBeInTheDocument();
        expect(playerActions.state.currentIndex).toBe(2);
      });
    });
  });

  describe('Complete User Workflow: Responsive Behavior', () => {
    it('should maintain functionality across screen size changes', async () => {
      let playerActions: any;
      const user = userEvent;
      
      // Mock different screen sizes
      const mockMatchMedia = (matches: boolean) => ({
        matches,
        media: '',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      });
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Load track
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Test Track 1')).toBeInTheDocument();
      });
      
      // Simulate mobile screen size
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(() => mockMatchMedia(true)),
      });
      
      // Core functionality should still work
      const pauseButton = screen.getByLabelText('Pause');
      await user.click(pauseButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Play')).toBeInTheDocument();
      });
      
      // Volume controls should still be accessible
      const volumeSlider = screen.getByLabelText('Music player').querySelector('[role="slider"]');
      expect(volumeSlider).toBeInTheDocument();
      
      // Track info should still be visible
      expect(screen.getByText('Test Track 1')).toBeInTheDocument();
      expect(screen.getByText('Test Artist 1')).toBeInTheDocument();
      
      // Progress bar should still be visible
      const timeElements = screen.getAllByText(/\d+:\d+/);
      expect(timeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Complete User Workflow: Error Recovery', () => {
    it('should handle and recover from various error states', async () => {
      let playerActions: any;
      const user = userEvent;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Try to navigate without queue
      const nextButton = screen.getByLabelText('Next track');
      const prevButton = screen.getByLabelText('Previous track');
      
      expect(nextButton).toBeDisabled();
      expect(prevButton).toBeDisabled();
      
      // Try to play without track
      const playButton = screen.getByLabelText('Play');
      expect(playButton).toBeDisabled();
      
      // Load track and verify recovery
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        expect(screen.getByLabelText('Pause')).toBeInTheDocument();
        expect(screen.getByText('Test Track 1')).toBeInTheDocument();
      });
      
      // Set queue and verify navigation works
      act(() => {
        playerActions.setQueue(mockQueue, 0);
      });
      
      await waitFor(() => {
        expect(screen.getByLabelText('Next track')).not.toBeDisabled();
      });
      
      await user.click(screen.getByLabelText('Next track'));
      
      await waitFor(() => {
        expect(screen.getByText('Test Track 2')).toBeInTheDocument();
      });
    });
  });

  describe('Complete User Workflow: Accessibility', () => {
    it('should maintain accessibility throughout user interactions', async () => {
      let playerActions: any;
      const user = userEvent;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Verify ARIA labels are correct initially
      expect(screen.getByLabelText('Music player')).toBeInTheDocument();
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous track')).toBeInTheDocument();
      expect(screen.getByLabelText('Next track')).toBeInTheDocument();
      
      // Load track and test state-dependent ARIA labels
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        expect(screen.getByLabelText('Pause')).toBeInTheDocument();
      });
      
      // Pause and verify label updates
      await user.click(screen.getByLabelText('Pause'));
      
      await waitFor(() => {
        expect(screen.getByLabelText('Play')).toBeInTheDocument();
      });
      
      // Test with queue for navigation labels
      act(() => {
        playerActions.setQueue(mockQueue, 1);
      });
      
      await waitFor(() => {
        const prevBtn = screen.getByLabelText('Previous track');
        const nextBtn = screen.getByLabelText('Next track');
        
        expect(prevBtn).not.toBeDisabled();
        expect(nextBtn).not.toBeDisabled();
        
        // Buttons should have proper ARIA states
        expect(prevBtn).toHaveAttribute('aria-label', 'Previous track');
        expect(nextBtn).toHaveAttribute('aria-label', 'Next track');
      });
      
      // Test shuffle/repeat button ARIA states (these are hidden on mobile)
      if (window.innerWidth >= 640) { // sm breakpoint
        const shuffleBtn = screen.queryByLabelText(/shuffle/i);
        if (shuffleBtn) {
          expect(shuffleBtn).toHaveAttribute('aria-pressed', 'false');
        }
        
        const repeatBtn = screen.queryByLabelText(/repeat/i);
        if (repeatBtn) {
          expect(repeatBtn).toHaveAttribute('aria-pressed', 'false');
        }
      }
    });
  });

  describe('Complete User Workflow: Volume Control', () => {
    it('should handle complete volume control workflow', async () => {
      let playerActions: any;
      const user = userEvent;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Load track for complete testing
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Test Track 1')).toBeInTheDocument();
      });
      
      // Find volume controls
      const volumeIcon = screen.getByLabelText('Music player').querySelector('svg');
      const volumeSlider = screen.getByLabelText('Music player').querySelector('[role="slider"]');
      
      expect(volumeIcon).toBeInTheDocument();
      expect(volumeSlider).toBeInTheDocument();
      
      // Test volume adjustment through context
      act(() => {
        playerActions.setVolume(0.3);
      });
      
      await waitFor(() => {
        expect(playerActions.state.volume).toBe(0.3);
      });
      
      // Test volume extremes
      act(() => {
        playerActions.setVolume(0);
      });
      await waitFor(() => {
        expect(playerActions.state.volume).toBe(0);
      });
      
      act(() => {
        playerActions.setVolume(1);
      });
      await waitFor(() => {
        expect(playerActions.state.volume).toBe(1);
      });
      
      // Volume controls should remain visible regardless of state
      expect(volumeIcon).toBeInTheDocument();
      expect(volumeSlider).toBeInTheDocument();
    });
  });

  describe('Complete User Workflow: Progress Tracking', () => {
    it('should handle progress bar display and time formatting', async () => {
      let playerActions: any;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Initially should show 0:00 for both current time and duration
      expect(screen.getAllByText('0:00')).toHaveLength(2);
      
      // Load track
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Test Track 1')).toBeInTheDocument();
      });
      
      // Simulate time updates
      act(() => {
        playerActions.setCurrentTime(65); // 1:05
      });
      
      await waitFor(() => {
        expect(screen.getByText('1:05')).toBeInTheDocument();
      });
      
      // Test different time formats
      act(() => {
        playerActions.setCurrentTime(125); // 2:05
      });
      
      await waitFor(() => {
        expect(screen.getByText('2:05')).toBeInTheDocument();
      });
      
      act(() => {
        playerActions.setCurrentTime(3665); // 61:05
      });
      
      await waitFor(() => {
        expect(screen.getByText('61:05')).toBeInTheDocument();
      });
      
      // Progress bar should be visible
      const progressContainer = screen.getByLabelText('Music player').querySelector('.group.cursor-pointer');
      expect(progressContainer).toBeInTheDocument();
      
      // Progress bar should have hover effects
      const progressBar = progressContainer?.querySelector('.group-hover\\:bg-spotify-green');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Complete User Workflow: State Persistence', () => {
    it('should maintain state consistency across multiple operations', async () => {
      let playerActions: any;
      const user = userEvent;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Set initial state
      act(() => {
        playerActions.setVolume(0.7);
        playerActions.toggleShuffle();
        playerActions.toggleRepeat(); // -> 'one'
      });
      
      expect(playerActions.state.volume).toBe(0.7);
      expect(playerActions.state.shuffle).toBe(true);
      expect(playerActions.state.repeat).toBe('one');
      
      // Load track and queue
      act(() => {
        playerActions.playTrack(mockTrack2, mockQueue);
      });
      
      await waitFor(() => {
        // Settings should be preserved
        expect(playerActions.state.volume).toBe(0.7);
        expect(playerActions.state.shuffle).toBe(true);
        expect(playerActions.state.repeat).toBe('one');
        
        // Track should be loaded
        expect(screen.getByText('Test Track 2')).toBeInTheDocument();
        expect(playerActions.state.currentIndex).toBe(1);
      });
      
      // Navigate and verify state persistence
      await user.click(screen.getByLabelText('Next track'));
      
      await waitFor(() => {
        // Should stay on same track due to repeat 'one'
        expect(screen.getByText('Test Track 2')).toBeInTheDocument();
        expect(playerActions.state.currentIndex).toBe(1);
        
        // Settings should still be preserved
        expect(playerActions.state.volume).toBe(0.7);
        expect(playerActions.state.shuffle).toBe(true);
        expect(playerActions.state.repeat).toBe('one');
      });
      
      // Change repeat mode and test navigation
      act(() => {
        playerActions.toggleRepeat(); // 'one' -> 'all'
      });
      
      await user.click(screen.getByLabelText('Next track'));
      
      await waitFor(() => {
        expect(screen.getByText('Test Track 3')).toBeInTheDocument();
        expect(playerActions.state.currentIndex).toBe(2);
        
        // Other settings should remain
        expect(playerActions.state.volume).toBe(0.7);
        expect(playerActions.state.shuffle).toBe(true);
        expect(playerActions.state.repeat).toBe('all');
      });
    });
  });
});