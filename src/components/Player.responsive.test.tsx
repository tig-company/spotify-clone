import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { PlayerProvider, usePlayer } from '../contexts/PlayerContext';
import { Player } from './Player';
import { Track } from '../types';

// Mock test data
const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  duration: 180,
  cover: 'https://example.com/cover.jpg',
  audioUrl: 'https://example.com/audio.mp3'
};

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

// Mock window dimensions
const mockWindowSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Mock matchMedia for different breakpoints
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => {
      // Parse common media queries
      if (query.includes('min-width: 640px')) {
        return {
          matches: width >= 640,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
      }
      if (query.includes('min-width: 768px')) {
        return {
          matches: width >= 768,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
      }
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    }),
  });
};

describe('Player Responsive Design Tests', () => {
  afterEach(() => {
    // Reset window size after each test
    mockWindowSize(1024, 768);
  });

  describe('Mobile Layout (320px - 640px)', () => {
    beforeEach(() => {
      mockWindowSize(375, 667); // iPhone 6/7/8 size
    });

    it('should render all essential controls on mobile', async () => {
      let playerActions: any;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      // Wait for player to be ready
      await new Promise(resolve => setTimeout(resolve, 0));
      act(() => {
        playerActions.playTrack(mockTrack);
      });
      
      // Essential controls should be visible
      expect(screen.getByLabelText('Music player')).toBeInTheDocument();
      expect(screen.getByLabelText('Pause')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous track')).toBeInTheDocument();
      expect(screen.getByLabelText('Next track')).toBeInTheDocument();
      
      // Track info should be visible
      expect(screen.getByText('Test Track')).toBeInTheDocument();
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
      
      // Volume controls should be visible
      const volumeSlider = screen.getByLabelText('Music player').querySelector('[role=\"slider\"]');
      expect(volumeSlider).toBeInTheDocument();
      
      // Progress bar should be visible
      const timeElements = screen.getAllByText(/\d+:\d+/);
      expect(timeElements.length).toBeGreaterThan(0);
    });

    it('should hide non-essential controls on mobile', () => {
      render(<PlayerTestHarness />);
      
      // Shuffle and repeat buttons should be hidden on mobile
      const shuffleButton = screen.queryByLabelText(/shuffle/i);
      const repeatButton = screen.queryByLabelText(/repeat/i);
      
      // These buttons exist but should have 'hidden sm:flex' classes
      if (shuffleButton) {
        expect(shuffleButton).toHaveClass('hidden');
      }
      
      if (repeatButton) {
        expect(repeatButton).toHaveClass('hidden');
      }
    });

    it('should use compact spacing on mobile', () => {
      render(<PlayerTestHarness />);
      
      const player = screen.getByLabelText('Music player');
      
      // Should use mobile padding
      expect(player).toHaveClass('px-2');
      
      // Control groups should use mobile spacing
      const controlGroup = player.querySelector('[role=\"group\"]');
      if (controlGroup) {
        expect(controlGroup).toHaveClass('gap-2');
      }
    });

    it('should use smaller cover image on mobile', async () => {
      let playerActions: any;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      act(() => {
        playerActions.playTrack(mockTrack);
      });
      
      const coverImage = screen.getByAltText('Test Track');
      
      // Should use mobile image size classes
      expect(coverImage).toHaveClass('w-12', 'h-12');
    });

    it('should constrain track info width on mobile', async () => {
      let playerActions: any;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      act(() => {
        playerActions.playTrack(mockTrack);
      });
      
      const trackInfoContainer = screen.getByText('Test Track').closest('.flex-1');
      
      // Should have mobile max-width constraint
      expect(trackInfoContainer).toHaveClass('max-w-[200px]');
    });

    it('should use smaller volume slider on mobile', () => {
      render(<PlayerTestHarness />);
      
      const player = screen.getByLabelText('Music player');
      const volumeSliderContainer = player.querySelector('[class*="w-[60px]"]');
      
      // Should use mobile volume slider width
      expect(volumeSliderContainer).toBeInTheDocument();
      expect(volumeSliderContainer).toHaveClass('w-[60px]');
    });
  });

  describe('Tablet Layout (640px - 1024px)', () => {
    beforeEach(() => {
      mockWindowSize(768, 1024); // iPad size
    });

    it('should show additional controls on tablet', () => {
      render(<PlayerTestHarness />);
      
      // Shuffle and repeat buttons should be present and have responsive classes
      const shuffleButton = screen.queryByLabelText(/shuffle/i);
      const repeatButton = screen.queryByLabelText(/repeat/i);
      
      // These buttons have "hidden sm:flex" classes, meaning they're hidden on mobile but visible on sm and up
      expect(shuffleButton).toBeInTheDocument();
      expect(repeatButton).toBeInTheDocument();
      
      if (shuffleButton) {
        expect(shuffleButton).toHaveClass('hidden', 'sm:flex');
      }
      if (repeatButton) {
        expect(repeatButton).toHaveClass('hidden', 'sm:flex');
      }
      
    });

    it('should use tablet spacing and sizing', async () => {
      let playerActions: any;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      act(() => {
        playerActions.playTrack(mockTrack);
      });
      
      const player = screen.getByLabelText('Music player');
      
      // Should use tablet padding
      expect(player).toHaveClass('sm:px-4');
      
      // Cover image should be larger on tablet
      const coverImage = screen.getByAltText('Test Track');
      expect(coverImage).toHaveClass('sm:w-14', 'sm:h-14');
      
      // Track info should have larger max-width
      const trackInfoContainer = screen.getByText('Test Track').closest('.flex-1');
      expect(trackInfoContainer).toHaveClass('sm:max-w-[300px]');
      
      // Volume slider should be wider
      const volumeSliderContainer = player.querySelector('[class*="sm:w-[93px]"]');
      expect(volumeSliderContainer).toBeInTheDocument();
    });

    it('should use larger control gaps on tablet', () => {
      render(<PlayerTestHarness />);
      
      const player = screen.getByLabelText('Music player');
      const controlGroup = player.querySelector('[role=\"group\"]');
      
      if (controlGroup) {
        expect(controlGroup).toHaveClass('sm:gap-4');
      }
    });
  });

  describe('Desktop Layout (1024px+)', () => {
    beforeEach(() => {
      mockWindowSize(1920, 1080); // Desktop size
    });

    it('should show all controls on desktop', () => {
      render(<PlayerTestHarness />);
      
      // All controls should be visible
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous track')).toBeInTheDocument();
      expect(screen.getByLabelText('Next track')).toBeInTheDocument();
      
      // Optional controls should be present and have responsive classes
      const shuffleButton = screen.queryByLabelText(/shuffle/i);
      const repeatButton = screen.queryByLabelText(/repeat/i);
      
      expect(shuffleButton).toBeInTheDocument();
      expect(repeatButton).toBeInTheDocument();
      
      // On desktop, these controls have "hidden sm:flex" - they're hidden on mobile but visible on sm+
      if (shuffleButton) {
        expect(shuffleButton).toHaveClass('hidden', 'sm:flex');
      }
      
      if (repeatButton) {
        expect(repeatButton).toHaveClass('hidden', 'sm:flex');
      }
    });

    it('should use maximum spacing and sizing on desktop', async () => {
      let playerActions: any;
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      act(() => {
        playerActions.playTrack(mockTrack);
      });
      
      const player = screen.getByLabelText('Music player');
      
      // Should use desktop padding
      expect(player).toHaveClass('sm:px-4');
      
      // All responsive classes should be at their maximum
      const coverImage = screen.getByAltText('Test Track');
      expect(coverImage).toHaveClass('sm:w-14', 'sm:h-14');
      
      const trackInfoContainer = screen.getByText('Test Track').closest('.flex-1');
      expect(trackInfoContainer).toHaveClass('sm:max-w-[300px]');
      
      // Volume controls should be at maximum width
      const volumeSection = player.querySelector('[class*="sm:max-w-[150px]"]');
      expect(volumeSection).toBeInTheDocument();
    });
  });

  describe('Cross-Breakpoint Consistency', () => {
    it('should maintain essential functionality across all breakpoints', async () => {
      const breakpoints = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 }, // Desktop
      ];
      
      for (const { width, height } of breakpoints) {
        mockWindowSize(width, height);
        
        let playerActions: any;
        const { unmount } = render(
          <PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />
        );
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Essential controls should always be present
        expect(screen.getByLabelText('Music player')).toBeInTheDocument();
        expect(screen.getByLabelText('Play')).toBeInTheDocument();
        expect(screen.getByLabelText('Previous track')).toBeInTheDocument();
        expect(screen.getByLabelText('Next track')).toBeInTheDocument();
        
        // Load track and verify it works
        act(() => {
        playerActions.playTrack(mockTrack);
      });
        
        expect(screen.getByText('Test Track')).toBeInTheDocument();
        expect(screen.getByText('Test Artist')).toBeInTheDocument();
        expect(screen.getByLabelText('Pause')).toBeInTheDocument();
        
        // Volume controls should always be present
        expect(screen.getByLabelText('Music player').querySelector('[role=\"slider\"]')).toBeInTheDocument();
        
        // Progress bar should always be present
        const timeElements = screen.getAllByText(/\d+:\d+/);
        expect(timeElements.length).toBeGreaterThan(0);
        
        unmount();
      }
    });

    it('should never hide essential controls at any breakpoint', () => {
      const breakpoints = [320, 480, 640, 768, 1024, 1440, 1920];
      
      for (const width of breakpoints) {
        mockWindowSize(width, 800);
        
        const { unmount } = render(<PlayerTestHarness />);
        
        // Core playback controls should never be hidden
        const playButton = screen.getByLabelText('Play');
        const prevButton = screen.getByLabelText('Previous track');
        const nextButton = screen.getByLabelText('Next track');
        
        expect(playButton).not.toHaveClass('hidden');
        expect(prevButton).not.toHaveClass('hidden');
        expect(nextButton).not.toHaveClass('hidden');
        
        // Volume controls should never be hidden
        const player = screen.getByLabelText('Music player');
        const volumeContainer = player.querySelector('.flex.items-center.justify-end');
        expect(volumeContainer).not.toHaveClass('hidden');
        
        unmount();
      }
    });
  });

  describe('Layout Stress Tests', () => {
    it('should handle extremely narrow screens', () => {
      mockWindowSize(280, 600); // Very narrow mobile
      
      render(<PlayerTestHarness />);
      
      // Player should still render and be functional
      expect(screen.getByLabelText('Music player')).toBeInTheDocument();
      
      // Essential controls should still be present
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous track')).toBeInTheDocument();
      expect(screen.getByLabelText('Next track')).toBeInTheDocument();
    });

    it('should handle extremely wide screens', () => {
      mockWindowSize(2560, 1440); // Ultra-wide desktop
      
      render(<PlayerTestHarness />);
      
      // Layout should still be constrained and functional
      expect(screen.getByLabelText('Music player')).toBeInTheDocument();
      
      // Controls should have proper max-width constraints
      const player = screen.getByLabelText('Music player');
      const controlsSection = player.querySelector('[class*="max-w-[722px]"]');
      expect(controlsSection).toBeInTheDocument();
    });

    it('should handle very long track titles and artist names', async () => {
      const longTrack: Track = {
        ...mockTrack,
        title: 'This is an extremely long track title that should be truncated properly to prevent layout issues',
        artist: 'This is also a very long artist name that could potentially break the layout if not handled correctly'
      };
      
      let playerActions: any;
      
      mockWindowSize(375, 667); // Mobile size where truncation is most important
      
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      act(() => {
        playerActions.playTrack(longTrack);
      });
      
      const trackTitle = screen.getByText(longTrack.title);
      const trackArtist = screen.getByText(longTrack.artist);
      
      // Should have proper truncation classes
      expect(trackTitle).toHaveClass('whitespace-nowrap', 'overflow-hidden', 'text-ellipsis');
      expect(trackArtist).toHaveClass('whitespace-nowrap', 'overflow-hidden', 'text-ellipsis');
      
      // Container should have proper constraints
      const trackInfoContainer = trackTitle.closest('.flex-1');
      expect(trackInfoContainer).toHaveClass('min-w-0'); // Allow shrinking
    });
  });

  describe('Accessibility at Different Screen Sizes', () => {
    it('should maintain proper touch targets on mobile', () => {
      mockWindowSize(375, 667);
      
      render(<PlayerTestHarness />);
      
      // Buttons should have adequate touch targets on mobile
      const playButton = screen.getByLabelText('Play');
      const prevButton = screen.getByLabelText('Previous track');
      const nextButton = screen.getByLabelText('Next track');
      
      // Play button should be larger (w-8 h-8 = 32px, meets minimum 44px when including padding)
      expect(playButton).toHaveClass('w-8', 'h-8');
      
      // Navigation buttons should have adequate size
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should maintain keyboard navigation across breakpoints', () => {
      const breakpoints = [375, 768, 1920];
      
      for (const width of breakpoints) {
        mockWindowSize(width, 800);
        
        const { unmount } = render(<PlayerTestHarness />);
        
        // All interactive elements should be focusable
        const playButton = screen.getByLabelText('Play');
        const prevButton = screen.getByLabelText('Previous track');
        const nextButton = screen.getByLabelText('Next track');
        
        expect(playButton).not.toHaveAttribute('tabindex', '-1');
        expect(prevButton).not.toHaveAttribute('tabindex', '-1');
        expect(nextButton).not.toHaveAttribute('tabindex', '-1');
        
        // Volume slider should be accessible
        const volumeSlider = screen.getByLabelText('Music player').querySelector('[role=\"slider\"]');
        expect(volumeSlider).toBeInTheDocument();
        
        unmount();
      }
    });
  });

  describe('Visual Hierarchy and Spacing', () => {
    it('should maintain proper visual hierarchy on mobile', async () => {
      mockWindowSize(375, 667);
      
      let playerActions: any;
      render(<PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      act(() => {
        playerActions.playTrack(mockTrack);
      });
      
      // Track info should be properly sized
      const trackTitle = screen.getByText('Test Track');
      const trackArtist = screen.getByText('Test Artist');
      
      expect(trackTitle).toHaveClass('text-sm', 'font-medium');
      expect(trackArtist).toHaveClass('text-xs');
      
      // Main player should have proper height
      const player = screen.getByLabelText('Music player');
      expect(player).toHaveClass('h-[90px]');
    });

    it('should scale text appropriately across breakpoints', async () => {
      let playerActions: any;
      
      // Test mobile
      mockWindowSize(375, 667);
      const { unmount: unmountMobile } = render(
        <PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />
      );
      
      await new Promise(resolve => setTimeout(resolve, 0));
      act(() => {
        playerActions.playTrack(mockTrack);
      });
      
      let trackTitle = screen.getByText('Test Track');
      expect(trackTitle).toHaveClass('text-sm');
      
      unmountMobile();
      
      // Test desktop - text sizes should remain consistent for readability
      mockWindowSize(1920, 1080);
      const { unmount: unmountDesktop } = render(
        <PlayerTestHarness onPlayerReady={(actions) => { playerActions = actions; }} />
      );
      
      await new Promise(resolve => setTimeout(resolve, 0));
      act(() => {
        playerActions.playTrack(mockTrack);
      });
      
      trackTitle = screen.getByText('Test Track');
      expect(trackTitle).toHaveClass('text-sm'); // Should remain consistent
      
      unmountDesktop();
    });
  });
});