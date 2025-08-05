import React from 'react';
import { Play } from 'lucide-react';
import { Button } from './ui/button';
import { Image } from './ui/image';
import { usePlayer } from '../contexts/PlayerContext';
import { useNavigation } from '../contexts/NavigationContext';
import { Track } from '../types';
import { mockTracks, findArtistByName, findAlbumByNameAndArtist } from '../data/mockData';


interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
}

function TrackCard({ track, onPlay }: TrackCardProps) {
  return (
    <div className="bg-spotify-medium-gray rounded-lg p-4 transition-colors duration-300 cursor-pointer relative group hover:bg-spotify-light-gray">
      <Image 
        src={track.cover} 
        alt={`${track.title} by ${track.artist} - Album cover`}
        className="w-full aspect-square rounded-lg object-cover mb-4"
        fallbackSrc="/images/default-album.svg"
        lazy={true}
        showLoadingSkeleton={true}
      />
      <h3 className="text-base font-bold mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
        {track.title}
      </h3>
      <p className="text-sm text-spotify-text-gray m-0 whitespace-nowrap overflow-hidden text-ellipsis">
        {track.artist}
      </p>
      <Button
        variant="spotify"
        size="icon-lg"
        className="absolute bottom-[104px] right-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 shadow-lg hover:scale-105"
        onClick={() => onPlay(track)}
      >
        <Play size={24} />
      </Button>
    </div>
  );
}

export function MainContent() {
  const { playTrack } = usePlayer();
  const { showArtistDetails, showAlbumDetails } = useNavigation();

  const handlePlayTrack = (track: Track) => {
    playTrack(track);
  };

  const handleArtistClick = (artistName: string) => {
    const artist = findArtistByName(artistName);
    if (artist) {
      showArtistDetails(artist);
    }
  };

  const handleAlbumClick = (albumName: string, artistName: string) => {
    const album = findAlbumByNameAndArtist(albumName, artistName);
    if (album) {
      showAlbumDetails(album);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <main className="flex-1 bg-gradient-to-b from-neutral-800 to-spotify-dark-gray text-white overflow-y-auto">
      <div className="pt-15 px-8 md:px-6 sm:px-4 pb-0 bg-gradient-to-b from-neutral-800 to-transparent">
        <h1 className="text-3xl md:text-2xl sm:text-xl font-black mb-6 m-0">
          {getGreeting()}
        </h1>
      </div>

      <section className="mb-12">
        <div className="px-8 md:px-6 sm:px-4">
          <h2 className="text-2xl md:text-xl sm:text-lg font-bold mb-4 m-0">Recently played</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-6 lg:gap-4 md:gap-3 sm:gap-2 px-8 md:px-6 sm:px-4">
          {mockTracks.map((track) => (
            <TrackCard 
              key={track.id}
              track={track}
              onPlay={handlePlayTrack}
            />
          ))}
        </div>
      </section>
    </main>
  );
}