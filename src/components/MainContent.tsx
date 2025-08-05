import React from 'react';
import { Play } from 'lucide-react';
import styled from 'styled-components';
import { usePlayer } from '../contexts/PlayerContext';
import { Track } from '../types';

const MainContainer = styled.main`
  flex: 1;
  background: linear-gradient(180deg, #1f1f1f 0%, #121212 100%);
  color: #fff;
  overflow-y: auto;
`;

const Header = styled.div`
  padding: 60px 32px 0;
  background: linear-gradient(180deg, #1f1f1f 0%, transparent 100%);
`;

const Greeting = styled.h1`
  font-size: 32px;
  font-weight: 900;
  margin: 0 0 24px 0;
`;

const RecentlyPlayed = styled.section`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px 0;
`;

const TrackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  padding: 0 32px;
`;

const TrackCard = styled.div`
  background-color: #181818;
  border-radius: 8px;
  padding: 16px;
  transition: background-color 0.3s;
  cursor: pointer;
  position: relative;
  group: hover;

  &:hover {
    background-color: #282828;
  }

  &:hover .play-button {
    opacity: 1;
    transform: translateY(0);
  }
`;

const TrackCover = styled.img`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 16px;
`;

const TrackTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.p`
  font-size: 14px;
  color: #b3b3b3;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayButton = styled.button`
  position: absolute;
  bottom: 104px;
  right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #1db954;
  border: none;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #1ed760;
    transform: scale(1.05) translateY(0);
  }
`;

const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    cover: 'https://via.placeholder.com/300x300?text=Blinding+Lights',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '2',
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: 174,
    cover: 'https://via.placeholder.com/300x300?text=Watermelon+Sugar',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    cover: 'https://via.placeholder.com/300x300?text=Levitating',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '4',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 178,
    cover: 'https://via.placeholder.com/300x300?text=Good+4+U',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '5',
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    album: 'Stay',
    duration: 141,
    cover: 'https://via.placeholder.com/300x300?text=Stay',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '6',
    title: 'Industry Baby',
    artist: 'Lil Nas X & Jack Harlow',
    album: 'MONTERO',
    duration: 212,
    cover: 'https://via.placeholder.com/300x300?text=Industry+Baby',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  }
];

export function MainContent() {
  const { playTrack } = usePlayer();

  const handlePlayTrack = (track: Track) => {
    playTrack(track);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <MainContainer>
      <Header>
        <Greeting>{getGreeting()}</Greeting>
      </Header>

      <RecentlyPlayed>
        <div style={{ padding: '0 32px' }}>
          <SectionTitle>Recently played</SectionTitle>
        </div>
        <TrackGrid>
          {mockTracks.map((track) => (
            <TrackCard key={track.id}>
              <TrackCover src={track.cover} alt={track.title} />
              <TrackTitle>{track.title}</TrackTitle>
              <TrackArtist>{track.artist}</TrackArtist>
              <PlayButton 
                className="play-button" 
                onClick={() => handlePlayTrack(track)}
              >
                <Play size={24} />
              </PlayButton>
            </TrackCard>
          ))}
        </TrackGrid>
      </RecentlyPlayed>
    </MainContainer>
  );
}