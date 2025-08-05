import React from 'react';
import { Play, Shuffle } from 'lucide-react';
import { Button } from './ui/button';
import { Artist } from '../types';
import { usePlayer } from '../contexts/PlayerContext';
import { useNavigation } from '../contexts/NavigationContext';

interface ArtistDetailsProps {
  artist: Artist;
}

export function ArtistDetails({ artist }: ArtistDetailsProps) {
  const { playTrack } = usePlayer();
  const { showAlbumDetails } = useNavigation();

  const formatListeners = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (track: any) => {
    playTrack(track);
  };

  const handleAlbumClick = (album: any) => {
    showAlbumDetails(album);
  };

  const handlePlayAll = () => {
    if (artist.topTracks.length > 0) {
      playTrack(artist.topTracks[0]);
    }
  };

  const handleShuffle = () => {
    if (artist.topTracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * artist.topTracks.length);
      playTrack(artist.topTracks[randomIndex]);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Artist Header */}
      <div className="p-6 bg-gradient-to-b from-neutral-800 to-transparent">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-48 h-48 rounded-full object-cover mb-4 shadow-lg"
          />
          <h1 className="text-3xl font-black text-white mb-2">{artist.name}</h1>
          <p className="text-spotify-text-gray text-sm mb-2">
            {formatListeners(artist.monthlyListeners)} monthly listeners
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {artist.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-spotify-medium-gray rounded-full text-xs text-spotify-text-gray"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="spotify"
            size="lg"
            onClick={handlePlayAll}
            className="flex items-center gap-2"
          >
            <Play size={20} />
            Play
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleShuffle}
            className="flex items-center gap-2 border-spotify-text-gray text-spotify-text-gray hover:text-white hover:border-white"
          >
            <Shuffle size={20} />
            Shuffle
          </Button>
        </div>
      </div>

      {/* Popular Tracks */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Popular</h2>
        <div className="space-y-2">
          {artist.topTracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-spotify-light-gray cursor-pointer group"
              onClick={() => handlePlayTrack(track)}
            >
              <span className="text-spotify-text-gray text-sm w-6 text-center group-hover:hidden">
                {index + 1}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="w-6 h-6 opacity-0 group-hover:opacity-100 text-white hover:bg-transparent"
              >
                <Play size={16} />
              </Button>
              <img
                src={track.cover}
                alt={track.title}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{track.title}</h3>
                <p className="text-spotify-text-gray text-sm truncate">{track.album}</p>
              </div>
              <span className="text-spotify-text-gray text-sm">
                {formatDuration(track.duration)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Albums */}
      <div className="px-6 pb-6">
        <h2 className="text-xl font-bold text-white mb-4">Albums</h2>
        <div className="grid grid-cols-2 gap-4">
          {artist.albums.map((album) => (
            <div
              key={album.id}
              className="bg-spotify-medium-gray rounded-lg p-4 hover:bg-spotify-light-gray cursor-pointer transition-colors"
              onClick={() => handleAlbumClick(album)}
            >
              <img
                src={album.cover}
                alt={album.name}
                className="w-full aspect-square rounded-lg object-cover mb-3"
              />
              <h3 className="text-white font-medium text-sm mb-1 truncate">
                {album.name}
              </h3>
              <p className="text-spotify-text-gray text-xs truncate">
                {album.releaseDate.split('-')[0]} • {album.genre}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}