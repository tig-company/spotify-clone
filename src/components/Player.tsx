import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { usePlayer } from '../contexts/PlayerContext';
import { cn } from '../lib/utils';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function Player() {
  const { state, pauseTrack, resumeTrack, setVolume, toggleShuffle, toggleRepeat } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && state.currentTrack) {
      audioRef.current.src = state.currentTrack.audioUrl;
      if (state.isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [state.currentTrack, state.isPlaying]);

  const handlePlayPause = () => {
    if (state.currentTrack) {
      if (state.isPlaying) {
        pauseTrack();
      } else {
        resumeTrack();
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const volume = value[0];
    setVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div className="h-[90px] bg-spotify-medium-gray border-t border-spotify-light-gray flex items-center px-4 md:px-2 text-white" role="region" aria-label="Music player">
      <audio ref={audioRef} aria-hidden="true" />
      
      {/* Track Info */}
      <div className="flex-1 flex items-center gap-3 min-w-0 md:hidden">
        {state.currentTrack && (
          <>
            <img 
              src={state.currentTrack.cover} 
              alt={state.currentTrack.title}
              className="w-14 h-14 rounded object-cover"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                {state.currentTrack.title}
              </span>
              <span className="text-xs text-spotify-text-gray whitespace-nowrap overflow-hidden text-ellipsis">
                {state.currentTrack.artist}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Player Controls */}
      <div className="flex-1 md:flex-none flex flex-col items-center gap-2 max-w-[722px] md:max-w-none">
        <div className="flex items-center gap-4 md:gap-2" role="group" aria-label="Playback controls">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleShuffle}
            className={cn(
              "text-spotify-text-gray hover:text-white hover:bg-transparent md:hidden",
              state.shuffle && "text-spotify-green"
            )}
            aria-label={`${state.shuffle ? 'Disable' : 'Enable'} shuffle`}
            aria-pressed={state.shuffle}
          >
            <Shuffle size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-spotify-text-gray hover:text-white hover:bg-transparent md:hidden"
            aria-label="Previous track"
          >
            <SkipBack size={16} />
          </Button>
          <Button
            variant="spotify"
            size="icon"
            onClick={handlePlayPause}
            disabled={!state.currentTrack}
            className="w-8 h-8"
            aria-label={state.isPlaying ? 'Pause' : 'Play'}
          >
            {state.isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-spotify-text-gray hover:text-white hover:bg-transparent md:hidden"
            aria-label="Next track"
          >
            <SkipForward size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleRepeat}
            className={cn(
              "text-spotify-text-gray hover:text-white hover:bg-transparent md:hidden",
              state.repeat !== 'none' && "text-spotify-green"
            )}
            aria-label={`Repeat: ${state.repeat}`}
            aria-pressed={state.repeat !== 'none'}
          >
            <Repeat size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full max-w-[722px] md:hidden">
          <span className="text-xs text-spotify-text-gray min-w-[40px] text-center">
            {formatTime(state.currentTime)}
          </span>
          <div className="flex-1 group cursor-pointer">
            <div className="h-1 bg-gray-600 rounded-full relative">
              <div 
                className="h-full bg-white rounded-full transition-colors duration-200 group-hover:bg-spotify-green"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-spotify-text-gray min-w-[40px] text-center">
            {formatTime(state.duration)}
          </span>
        </div>
      </div>

      {/* Volume Controls */}
      <div className="flex-1 md:hidden flex items-center justify-end gap-2">
        <Volume2 size={16} className="text-spotify-text-gray" />
        <div className="w-[93px] group">
          <Slider
            value={[state.volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}