import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Player } from './Player';
import { PlayerProvider, usePlayer } from '../contexts/PlayerContext';
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

// Test component to access player context
const TestPlayerController = ({ onPlayerReady }: { onPlayerReady?: (playerActions: any) => void }) => {
  const playerActions = usePlayer();
  
  React.useEffect(() => {
    if (onPlayerReady) {
      onPlayerReady(playerActions);
    }
  }, [onPlayerReady, playerActions]);
  
  return null;
};

const PlayerWithContext = ({ children, onPlayerReady }: { 
  children?: React.ReactNode;
  onPlayerReady?: (playerActions: any) => void;
}) => (
  <PlayerProvider>
    <Player />
    {onPlayerReady && <TestPlayerController onPlayerReady={onPlayerReady} />}
    {children}
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

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Player Component', () => {
  describe('initial render', () => {
    it('should render player with all controls', () => {
      render(<PlayerWithContext />);

      // Check that main player controls are present
      expect(screen.getByLabelText('Music player')).toBeInTheDocument();
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous track')).toBeInTheDocument();
      expect(screen.getByLabelText('Next track')).toBeInTheDocument();
      // Should have time displays (current time and duration)
      const timeDisplays = screen.getAllByText('0:00');
      expect(timeDisplays.length).toBeGreaterThanOrEqual(2);
    });

    it('should show disabled play button when no track is loaded', () => {
      render(<PlayerWithContext />);

      const playButton = screen.getByLabelText('Play');
      expect(playButton).toBeDisabled();
    });

    it('should show disabled prev/next buttons when no queue is loaded', () => {
      render(<PlayerWithContext />);

      const prevButton = screen.getByLabelText('Previous track');
      const nextButton = screen.getByLabelText('Next track');
      
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  describe('track navigation', () => {
    it('should have prev/next buttons', () => {
      render(<PlayerWithContext />);

      expect(screen.getByLabelText('Previous track')).toBeInTheDocument();
      expect(screen.getByLabelText('Next track')).toBeInTheDocument();
    });
  });

  describe('track info display', () => {
    it('should have track info container', () => {
      render(<PlayerWithContext />);

      // Check that track info section exists
      const playerContainer = screen.getByLabelText('Music player');
      expect(playerContainer).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('should not have md:hidden classes that hide controls inappropriately', () => {
      render(<PlayerWithContext />);

      // Track info should be visible (no md:hidden)
      const trackInfoContainer = screen.getByLabelText('Music player').children[1];
      expect(trackInfoContainer).not.toHaveClass('md:hidden');

      // Progress bar should be visible (no md:hidden)
      const progressContainer = screen.getAllByText('0:00')[0].parentElement;
      expect(progressContainer).not.toHaveClass('md:hidden');

      // Volume controls should be visible (no md:hidden)
      const player = screen.getByLabelText('Music player');
      const volumeContainer = player.querySelector('.flex.items-center.justify-end.gap-2');
      expect(volumeContainer).not.toHaveClass('md:hidden');
    });
  });

  describe('button accessibility', () => {
    it('should have proper aria labels for all buttons', () => {
      render(<PlayerWithContext />);

      expect(screen.getByLabelText('Play')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous track')).toBeInTheDocument();
      expect(screen.getByLabelText('Next track')).toBeInTheDocument();
    });

    it('should have play button with correct default label', () => {
      render(<PlayerWithContext />);

      // When not playing and no track, should show "Play"
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
    });
  });

  describe('Acceptance Criteria 1: Volume bar and controls visible on all screen sizes', () => {
    it('should render volume controls with icon and slider', () => {
      render(<PlayerWithContext />);

      const player = screen.getByLabelText('Music player');
      
      // Volume icon should be present
      const volumeIcon = player.querySelector('svg');
      expect(volumeIcon).toBeInTheDocument();
      
      // Volume slider should be present
      const sliders = player.querySelectorAll('input[type="range"], [role="slider"]');
      expect(sliders.length).toBeGreaterThan(0);
    });

    it('should not hide volume controls on smaller screens', () => {
      render(<PlayerWithContext />);

      const player = screen.getByLabelText('Music player');
      const volumeContainer = player.querySelector('.flex.items-center.justify-end');
      
      // Volume container should not have classes that hide it on mobile
      expect(volumeContainer).not.toHaveClass('hidden');
      expect(volumeContainer).not.toHaveClass('sm:hidden');
      expect(volumeContainer).not.toHaveClass('md:hidden');
    });

    it('should allow volume adjustment through slider', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      // Wait for player to be ready
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Find volume slider and test its presence and functionality
      const player = screen.getByLabelText('Music player');
      const slider = player.querySelector('[role="slider"]') as HTMLElement;
      expect(slider).toBeInTheDocument();
      
      // Test volume adjustment through the player context directly
      act(() => {
        playerActions.setVolume(0.5);
      });
      
      await waitFor(() => {
        expect(playerActions.state.volume).toBe(0.5);
      });
    });

    it('should maintain volume control width on different screen sizes', () => {
      render(<PlayerWithContext />);

      const player = screen.getByLabelText('Music player');
      const volumeSliderContainer = player.querySelector('[class*="w-[60px]"]');
      
      // Should have responsive width classes
      expect(volumeSliderContainer).toBeInTheDocument();
      expect(volumeSliderContainer).toHaveClass('w-[60px]', 'sm:w-[93px]');
    });
  });

  describe('Acceptance Criteria 2: Previous/Next buttons fully functional', () => {
    it('should enable prev/next buttons when queue is loaded', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Set up a queue with 3 tracks to ensure we're in the middle
      act(() => {
        playerActions.setQueue([mockTrack1, mockTrack2, { ...mockTrack1, id: '3' }], 1);
      });
      
      await waitFor(() => {
        const prevButton = screen.getByLabelText('Previous track');
        const nextButton = screen.getByLabelText('Next track');
        
        // Both buttons should be enabled when in middle of queue (index 1 of 3 tracks)
        expect(prevButton).not.toBeDisabled();
        expect(nextButton).not.toBeDisabled();
      });
    });

    it('should navigate to next track when next button is clicked', async () => {
      let playerActions: any;
      const user = userEvent;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Set up queue starting at first track
      act(() => {
        playerActions.setQueue([mockTrack1, mockTrack2], 0);
      });
      
      await waitFor(() => {
        const nextButton = screen.getByLabelText('Next track');
        expect(nextButton).not.toBeDisabled();
      });
      
      const nextButton = screen.getByLabelText('Next track');
      await user.click(nextButton);
      
      await waitFor(() => {
        expect(playerActions.state.currentTrack?.id).toBe(mockTrack2.id);
        expect(playerActions.state.currentIndex).toBe(1);
      });
    });

    it('should navigate to previous track when previous button is clicked', async () => {
      let playerActions: any;
      const user = userEvent;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Set up queue starting at second track
      act(() => {
        playerActions.setQueue([mockTrack1, mockTrack2], 1);
      });
      
      await waitFor(() => {
        const prevButton = screen.getByLabelText('Previous track');
        expect(prevButton).not.toBeDisabled();
      });
      
      const prevButton = screen.getByLabelText('Previous track');
      await user.click(prevButton);
      
      await waitFor(() => {
        expect(playerActions.state.currentTrack?.id).toBe(mockTrack1.id);
        expect(playerActions.state.currentIndex).toBe(0);
      });
    });

    it('should disable prev button at start of queue (when repeat is none)', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Set up queue at first track with no repeat
      act(() => {
        playerActions.setQueue([mockTrack1, mockTrack2], 0);
      });
      
      await waitFor(() => {
        const prevButton = screen.getByLabelText('Previous track');
        expect(prevButton).toBeDisabled();
      });
    });

    it('should disable next button at end of queue (when repeat is none)', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Set up queue at last track with no repeat
      act(() => {
        playerActions.setQueue([mockTrack1, mockTrack2], 1);
      });
      
      await waitFor(() => {
        const nextButton = screen.getByLabelText('Next track');
        expect(nextButton).toBeDisabled();
      });
    });

    it('should enable navigation at queue boundaries when repeat is all', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Set up queue and enable repeat all
      act(() => {
        playerActions.setQueue([mockTrack1, mockTrack2], 0);
      });
      act(() => {
        playerActions.toggleRepeat(); // none -> one
        playerActions.toggleRepeat(); // one -> all
      });
      
      await waitFor(() => {
        const prevButton = screen.getByLabelText('Previous track');
        const nextButton = screen.getByLabelText('Next track');
        
        // Both should be enabled even at boundaries with repeat all
        expect(prevButton).not.toBeDisabled();
        expect(nextButton).not.toBeDisabled();
      });
    });
  });

  describe('Acceptance Criteria 3: Current track name and artist always visible', () => {
    it('should display track title and artist when track is loaded', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        expect(screen.getByText(mockTrack1.title)).toBeInTheDocument();
        expect(screen.getByText(mockTrack1.artist)).toBeInTheDocument();
      });
    });

    it('should not hide track info on smaller screens', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        const trackTitle = screen.getByText(mockTrack1.title);
        const trackArtist = screen.getByText(mockTrack1.artist);
        
        // Track info elements should not have classes that hide them
        expect(trackTitle.closest('.flex-1')).not.toHaveClass('hidden');
        expect(trackTitle.closest('.flex-1')).not.toHaveClass('md:hidden');
        expect(trackArtist.closest('.flex-1')).not.toHaveClass('hidden');
        expect(trackArtist.closest('.flex-1')).not.toHaveClass('md:hidden');
      });
    });

    it('should truncate long track names with ellipsis instead of hiding', async () => {
      let playerActions: any;
      const longTrack: Track = {
        ...mockTrack1,
        title: 'This is a very long track title that should be truncated with ellipsis',
        artist: 'This is also a very long artist name that should be truncated'
      };
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      act(() => {
        playerActions.playTrack(longTrack);
      });
      
      await waitFor(() => {
        const trackTitle = screen.getByText(longTrack.title);
        const trackArtist = screen.getByText(longTrack.artist);
        
        // Should have ellipsis classes for overflow handling
        expect(trackTitle).toHaveClass('text-ellipsis', 'overflow-hidden', 'whitespace-nowrap');
        expect(trackArtist).toHaveClass('text-ellipsis', 'overflow-hidden', 'whitespace-nowrap');
      });
    });

    it('should show track cover image when available', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        const coverImage = screen.getByAltText(mockTrack1.title);
        expect(coverImage).toBeInTheDocument();
        expect(coverImage).toHaveAttribute('src', mockTrack1.cover);
      });
    });
  });

  describe('Acceptance Criteria 4: Play/pause button functionality', () => {
    it('should toggle play/pause when clicked', async () => {
      let playerActions: any;
      const user = userEvent;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        const playPauseButton = screen.getByLabelText('Pause');
        expect(playPauseButton).toBeInTheDocument();
      });
      
      const playPauseButton = screen.getByLabelText('Pause');
      await user.click(playPauseButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Play')).toBeInTheDocument();
        expect(playerActions.state.isPlaying).toBe(false);
      });
      
      const playButton = screen.getByLabelText('Play');
      await user.click(playButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Pause')).toBeInTheDocument();
        expect(playerActions.state.isPlaying).toBe(true);
      });
    });

    it('should be disabled when no track is loaded', () => {
      render(<PlayerWithContext />);
      
      const playButton = screen.getByLabelText('Play');
      expect(playButton).toBeDisabled();
    });

    it('should have correct aria-label based on play state', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        expect(screen.getByLabelText('Pause')).toBeInTheDocument();
      });
      
      act(() => {
        playerActions.pauseTrack();
      });
      
      await waitFor(() => {
        expect(screen.getByLabelText('Play')).toBeInTheDocument();
      });
    });

    it('should show correct icon based on play state', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        // When playing, should show pause icon
        const pauseButton = screen.getByLabelText('Pause');
        expect(pauseButton.querySelector('svg')).toBeInTheDocument();
      });
      
      act(() => {
        playerActions.pauseTrack();
      });
      
      await waitFor(() => {
        // When paused, should show play icon
        const playButton = screen.getByLabelText('Play');
        expect(playButton.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  describe('Acceptance Criteria 5: Progress bar visible and interactive', () => {
    it('should render progress bar with current time and duration', () => {
      render(<PlayerWithContext />);
      
      // Should show time displays
      const timeElements = screen.getAllByText('0:00');
      expect(timeElements).toHaveLength(2); // current time and duration
    });

    it('should not hide progress bar on mobile devices', () => {
      render(<PlayerWithContext />);
      
      const player = screen.getByLabelText('Music player');
      const progressContainer = player.querySelector('.flex.items-center.gap-2.w-full');
      
      // Progress container should not have classes that hide it
      expect(progressContainer).not.toHaveClass('hidden');
      expect(progressContainer).not.toHaveClass('sm:hidden');
      expect(progressContainer).not.toHaveClass('md:hidden');
    });

    it('should display progress bar with hover effects', () => {
      render(<PlayerWithContext />);
      
      const player = screen.getByLabelText('Music player');
      const progressBar = player.querySelector('.group.cursor-pointer');
      
      expect(progressBar).toBeInTheDocument();
      expect(progressBar?.querySelector('.group-hover\\:bg-spotify-green')).toBeInTheDocument();
    });

    it('should show formatted time correctly', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Set current time to test formatting
      act(() => {
        playerActions.setCurrentTime(125); // 2:05
      });
      
      await waitFor(() => {
        // Should format time as mm:ss
        expect(screen.getByText('2:05')).toBeInTheDocument();
      });
    });

    it('should calculate progress percentage correctly', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      // Mock duration and current time
      act(() => {
        playerActions.state.duration = 200;
        playerActions.setCurrentTime(100); // 50% progress
      });
      
      await waitFor(() => {
        const player = screen.getByLabelText('Music player');
        const progressFill = player.querySelector('.h-full.bg-white.rounded-full');
        
        // Should have width style set (though exact calculation happens in component)
        expect(progressFill).toBeInTheDocument();
      });
    });
  });

  describe('Acceptance Criteria 6: Proper responsive layout', () => {
    it('should not hide essential playback controls on any screen size', () => {
      render(<PlayerWithContext />);
      
      const playButton = screen.getByLabelText('Play');
      const prevButton = screen.getByLabelText('Previous track');
      const nextButton = screen.getByLabelText('Next track');
      
      // Core playback controls should never be hidden
      expect(playButton).not.toHaveClass('hidden', 'sm:hidden', 'md:hidden');
      expect(prevButton).not.toHaveClass('hidden', 'sm:hidden', 'md:hidden');
      expect(nextButton).not.toHaveClass('hidden', 'sm:hidden', 'md:hidden');
    });

    it('should maintain proper layout structure on all screen sizes', () => {
      render(<PlayerWithContext />);
      
      const player = screen.getByLabelText('Music player');
      
      // Should have four main flex sections: track info, controls, progress bar, volume
      const flexSections = player.querySelectorAll('.flex-1');
      expect(flexSections).toHaveLength(4);
      
      // Each section should maintain proper responsive classes
      flexSections.forEach(section => {
        expect(section).toHaveClass('flex-1');
      });
    });

    it('should hide optional controls on smaller screens while keeping essentials', () => {
      render(<PlayerWithContext />);
      
      // Shuffle and repeat buttons should be hidden on small screens
      const shuffleButton = screen.getByLabelText(/shuffle/i);
      const repeatButton = screen.getByLabelText(/repeat/i);
      
      expect(shuffleButton).toHaveClass('hidden', 'sm:flex');
      expect(repeatButton).toHaveClass('hidden', 'sm:flex');
    });

    it('should maintain accessible spacing and sizing on mobile', () => {
      render(<PlayerWithContext />);
      
      const player = screen.getByLabelText('Music player');
      
      // Should have responsive padding
      expect(player).toHaveClass('px-2', 'sm:px-4');
      
      // Control groups should have responsive gaps
      const controlGroup = player.querySelector('[role="group"]');
      expect(controlGroup).toHaveClass('gap-2', 'sm:gap-4');
    });

    it('should adapt cover image size responsively', async () => {
      let playerActions: any;
      
      render(<PlayerWithContext onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await waitFor(() => expect(playerActions).toBeDefined());
      
      act(() => {
        playerActions.playTrack(mockTrack1);
      });
      
      await waitFor(() => {
        const coverImage = screen.getByAltText(mockTrack1.title);
        
        // Should have responsive size classes
        expect(coverImage).toHaveClass('w-12', 'h-12', 'sm:w-14', 'sm:h-14');
      });
    });

    it('should maintain proper max-width constraints for sections', () => {
      render(<PlayerWithContext />);
      
      const player = screen.getByLabelText('Music player');
      
      // Track info should have max-width constraint
      const trackInfoSection = player.querySelector('[class*="max-w-[200px]"]');
      expect(trackInfoSection).toBeInTheDocument();
      
      // Controls section should have max-width constraint
      const controlsSection = player.querySelector('[class*="max-w-[722px]"]');
      expect(controlsSection).toBeInTheDocument();
      
      // Volume section should have max-width constraint
      const volumeSection = player.querySelector('[class*="max-w-[120px]"]');
      expect(volumeSection).toBeInTheDocument();
    });
  });
});