import React from 'react';
import { Play, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Album } from '../types';
import { usePlayer } from '../contexts/PlayerContext';
import { useNavigation } from '../contexts/NavigationContext';

interface AlbumDetailsProps {
  album: Album;
}

export function AlbumDetails({ album }: AlbumDetailsProps) {
  const { playTrack } = usePlayer();
  const { showArtistDetails } = useNavigation();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    const totalSeconds = album.tracks.reduce((sum, track) => sum + track.duration, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const handlePlayTrack = (track: any) => {
    playTrack(track);
  };

  const handlePlayAlbum = () => {
    if (album.tracks.length > 0) {
      playTrack(album.tracks[0]);
    }
  };

  const handleArtistClick = () => {
    // Create a minimal artist object for navigation
    // In a real app, you'd fetch the full artist data
    const artist = {
      id: album.artistId,
      name: album.artist,
      image: album.cover,
      genres: [album.genre],
      albums: [album],
      topTracks: album.tracks.slice(0, 5),
      monthlyListeners: 1000000
    };
    showArtistDetails(artist);
  };

  const formatReleaseYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Album Header */}
      <div className="p-6 bg-gradient-to-b from-neutral-800 to-transparent">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={album.cover}
            alt={album.name}
            className="w-48 h-48 rounded-lg object-cover mb-4 shadow-lg"
          />
          <p className="text-spotify-text-gray text-sm mb-1">Album</p>
          <h1 className="text-2xl font-black text-white mb-2">{album.name}</h1>
          <button
            onClick={handleArtistClick}
            className="text-spotify-text-gray hover:text-white text-sm mb-2 hover:underline cursor-pointer"
          >
            {album.artist}
          </button>
          <div className="flex items-center gap-2 text-spotify-text-gray text-xs">
            <span>{formatReleaseYear(album.releaseDate)}</span>
            <span>•</span>
            <span>{album.tracks.length} songs</span>
            <span>•</span>
            <span>{getTotalDuration()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <Button
            variant="spotify"
            size="lg"
            onClick={handlePlayAlbum}
            className="flex items-center gap-2"
          >
            <Play size={20} />
            Play
          </Button>
        </div>
      </div>

      {/* Track List */}
      <div className="px-6 pb-6">
        {/* Track List Header */}
        <div className="flex items-center gap-4 p-2 border-b border-spotify-light-gray mb-4">
          <span className="text-spotify-text-gray text-sm w-6 text-center">#</span>
          <span className="text-spotify-text-gray text-sm flex-1 min-w-0">Title</span>
          <Clock size={16} className="text-spotify-text-gray" />
        </div>

        {/* Tracks */}
        <div className="space-y-1">
          {album.tracks.map((track, index) => (
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
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{track.title}</h3>
                <p className="text-spotify-text-gray text-sm truncate">{track.artist}</p>
              </div>
              <span className="text-spotify-text-gray text-sm">
                {formatDuration(track.duration)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}