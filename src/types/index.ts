export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  audioUrl: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  cover: string;
  tracks: Track[];
  releaseDate: string;
  genre: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  genres: string[];
  albums: Album[];
  topTracks: Track[];
  monthlyListeners: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  tracks: Track[];
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  playlists: Playlist[];
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

export interface NavigationState {
  currentView: 'home' | 'artist' | 'album';
  selectedArtist: Artist | null;
  selectedAlbum: Album | null;
  showDetailsSidebar: boolean;
}