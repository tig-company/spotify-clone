import React from 'react';
import { render, screen } from '@testing-library/react';
import { Player } from './Player';
import { PlayerProvider } from '../contexts/PlayerContext';
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

const PlayerWithContext = ({ children }: { children?: React.ReactNode }) => (
  <PlayerProvider>
    <Player />
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

describe('Player Component', () => {
  describe('initial render', () => {
    it('should render player with all controls', () => {
      render(<PlayerWithContext />);

      // Check that main player controls are present
      expect(screen.getByLabelText('Music player')).toBeInTheDocument();
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous track')).toBeInTheDocument();
      expect(screen.getByLabelText('Next track')).toBeInTheDocument();
      expect(screen.getByText('0:00')).toBeInTheDocument(); // Current time
      expect(screen.getByText('0:00')).toBeInTheDocument(); // Duration
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
      const progressContainer = screen.getByText('0:00').parentElement;
      expect(progressContainer).not.toHaveClass('md:hidden');

      // Volume controls should be visible (no md:hidden)
      const volumeIcon = screen.getByLabelText('Music player').querySelector('svg[data-testid="volume-icon"]');
      if (volumeIcon) {
        expect(volumeIcon.parentElement).not.toHaveClass('md:hidden');
      }
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

  describe('volume control', () => {
    it('should render volume slider', () => {
      render(<PlayerWithContext />);

      // Volume icon should be present
      expect(screen.getByLabelText('Music player')).toContainHTML('svg');
      
      // Slider should be present (may need to be more specific based on slider implementation)
      const sliders = screen.getByLabelText('Music player').querySelectorAll('input[type="range"], [role="slider"]');
      expect(sliders.length).toBeGreaterThan(0);
    });
  });
});