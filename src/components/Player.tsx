import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2 } from 'lucide-react';
import styled from 'styled-components';
import { usePlayer } from '../contexts/PlayerContext';

const PlayerContainer = styled.div`
  height: 90px;
  background-color: #181818;
  border-top: 1px solid #282828;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #fff;
`;

const TrackInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const TrackCover = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 4px;
  object-fit: cover;
`;

const TrackDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const TrackTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.span`
  font-size: 12px;
  color: #b3b3b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerControls = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 722px;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ControlButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$active ? '#1db954' : '#b3b3b3'};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }

  &:disabled {
    color: #404040;
    cursor: not-allowed;
  }
`;

const PlayButton = styled(ControlButton)`
  background-color: #fff;
  color: #000;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f0f0f0;
    color: #000;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 722px;
`;

const TimeDisplay = styled.span`
  font-size: 11px;
  color: #b3b3b3;
  min-width: 40px;
  text-align: center;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background-color: #4f4f4f;
  border-radius: 2px;
  cursor: pointer;
  position: relative;

  &:hover .progress-fill {
    background-color: #1db954;
  }
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background-color: #fff;
  border-radius: 2px;
  transition: background-color 0.2s;
`;

const VolumeControls = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const VolumeSlider = styled.input`
  width: 93px;
  height: 4px;
  background: #4f4f4f;
  outline: none;
  border-radius: 2px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
  }
`;

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <PlayerContainer>
      <audio ref={audioRef} />
      
      <TrackInfo>
        {state.currentTrack && (
          <>
            <TrackCover src={state.currentTrack.cover} alt={state.currentTrack.title} />
            <TrackDetails>
              <TrackTitle>{state.currentTrack.title}</TrackTitle>
              <TrackArtist>{state.currentTrack.artist}</TrackArtist>
            </TrackDetails>
          </>
        )}
      </TrackInfo>

      <PlayerControls>
        <ControlButtons>
          <ControlButton onClick={toggleShuffle} $active={state.shuffle}>
            <Shuffle size={16} />
          </ControlButton>
          <ControlButton>
            <SkipBack size={16} />
          </ControlButton>
          <PlayButton onClick={handlePlayPause} disabled={!state.currentTrack}>
            {state.isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </PlayButton>
          <ControlButton>
            <SkipForward size={16} />
          </ControlButton>
          <ControlButton onClick={toggleRepeat} $active={state.repeat !== 'none'}>
            <Repeat size={16} />
          </ControlButton>
        </ControlButtons>

        <ProgressContainer>
          <TimeDisplay>{formatTime(state.currentTime)}</TimeDisplay>
          <ProgressBar>
            <ProgressFill className="progress-fill" $progress={progressPercentage} />
          </ProgressBar>
          <TimeDisplay>{formatTime(state.duration)}</TimeDisplay>
        </ProgressContainer>
      </PlayerControls>

      <VolumeControls>
        <Volume2 size={16} color="#b3b3b3" />
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={state.volume}
          onChange={handleVolumeChange}
        />
      </VolumeControls>
    </PlayerContainer>
  );
}