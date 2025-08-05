import { Artist, Album, Track } from '../types';

export const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    cover: '/images/after-hours.svg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '2',
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: 174,
    cover: '/images/fine-line.svg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    cover: '/images/future-nostalgia.svg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '4',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 178,
    cover: '/images/sour.svg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '5',
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    album: 'Stay',
    duration: 141,
    cover: '/images/default-album.svg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '6',
    title: 'Industry Baby',
    artist: 'Lil Nas X & Jack Harlow',
    album: 'MONTERO',
    duration: 212,
    cover: '/images/montero.svg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '7',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    duration: 167,
    cover: '/images/harrys-house.svg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '8',
    title: 'Music For a Sushi Restaurant',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    duration: 193,
    cover: '/images/harrys-house.svg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '9',
    title: 'Don\'t Worry Darling',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 198,
    cover: '/images/future-nostalgia.svg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '10',
    title: 'Physical',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 194,
    cover: '/images/future-nostalgia.svg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '11',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 215,
    cover: '/images/after-hours.svg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '12',
    title: 'Heartless',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 198,
    cover: '/images/after-hours.svg',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  }
];

export const mockAlbums: Album[] = [
  {
    id: 'album1',
    name: 'After Hours',
    artist: 'The Weeknd',
    artistId: 'artist1',
    cover: '/images/after-hours.svg',
    tracks: [
      mockTracks[0], // Blinding Lights
      mockTracks[10], // Save Your Tears
      mockTracks[11], // Heartless
    ],
    releaseDate: '2020-03-20',
    genre: 'R&B'
  },
  {
    id: 'album2',
    name: 'Fine Line',
    artist: 'Harry Styles',
    artistId: 'artist2',
    cover: '/images/fine-line.svg',
    tracks: [
      mockTracks[1], // Watermelon Sugar
    ],
    releaseDate: '2019-12-13',
    genre: 'Pop'
  },
  {
    id: 'album3',
    name: 'Harry\'s House',
    artist: 'Harry Styles',
    artistId: 'artist2',
    cover: '/images/harrys-house.svg',
    tracks: [
      mockTracks[6], // As It Was
      mockTracks[7], // Music For a Sushi Restaurant
    ],
    releaseDate: '2022-05-20',
    genre: 'Pop'
  },
  {
    id: 'album4',
    name: 'Future Nostalgia',
    artist: 'Dua Lipa',
    artistId: 'artist3',
    cover: '/images/future-nostalgia.svg',
    tracks: [
      mockTracks[2], // Levitating
      mockTracks[8], // Don't Worry Darling
      mockTracks[9], // Physical
    ],
    releaseDate: '2020-03-27',
    genre: 'Pop'
  },
  {
    id: 'album5',
    name: 'SOUR',
    artist: 'Olivia Rodrigo',
    artistId: 'artist4',
    cover: '/images/sour.svg',
    tracks: [
      mockTracks[3], // Good 4 U
    ],
    releaseDate: '2021-05-21',
    genre: 'Pop'
  },
  {
    id: 'album6',
    name: 'MONTERO',
    artist: 'Lil Nas X & Jack Harlow',
    artistId: 'artist5',
    cover: '/images/montero.svg',
    tracks: [
      mockTracks[5], // Industry Baby
    ],
    releaseDate: '2021-09-17',
    genre: 'Hip-Hop'
  }
];

export const mockArtists: Artist[] = [
  {
    id: 'artist1',
    name: 'The Weeknd',
    image: '/images/the-weeknd.svg',
    genres: ['R&B', 'Pop', 'Alternative'],
    albums: [mockAlbums[0]], // After Hours
    topTracks: [
      mockTracks[0], // Blinding Lights
      mockTracks[10], // Save Your Tears
      mockTracks[11], // Heartless
    ],
    monthlyListeners: 85000000
  },
  {
    id: 'artist2',
    name: 'Harry Styles',
    image: '/images/harry-styles.svg',
    genres: ['Pop', 'Rock', 'Folk'],
    albums: [mockAlbums[1], mockAlbums[2]], // Fine Line, Harry's House
    topTracks: [
      mockTracks[6], // As It Was
      mockTracks[1], // Watermelon Sugar
      mockTracks[7], // Music For a Sushi Restaurant
    ],
    monthlyListeners: 70000000
  },
  {
    id: 'artist3',
    name: 'Dua Lipa',
    image: '/images/dua-lipa.svg',
    genres: ['Pop', 'Dance', 'Electronic'],
    albums: [mockAlbums[3]], // Future Nostalgia
    topTracks: [
      mockTracks[2], // Levitating
      mockTracks[9], // Physical
      mockTracks[8], // Don't Worry Darling
    ],
    monthlyListeners: 75000000
  },
  {
    id: 'artist4',
    name: 'Olivia Rodrigo',
    image: '/images/olivia-rodrigo.svg',
    genres: ['Pop', 'Alternative', 'Indie'],
    albums: [mockAlbums[4]], // SOUR
    topTracks: [
      mockTracks[3], // Good 4 U
    ],
    monthlyListeners: 60000000
  },
  {
    id: 'artist5',
    name: 'Lil Nas X',
    image: '/images/lil-nas-x.svg',
    genres: ['Hip-Hop', 'Pop', 'Country'],
    albums: [mockAlbums[5]], // MONTERO
    topTracks: [
      mockTracks[5], // Industry Baby
    ],
    monthlyListeners: 55000000
  }
];

// Helper function to find artist by name
export const findArtistByName = (name: string): Artist | undefined => {
  return mockArtists.find(artist => artist.name === name);
};

// Helper function to find album by name and artist
export const findAlbumByNameAndArtist = (albumName: string, artistName: string): Album | undefined => {
  return mockAlbums.find(album => album.name === albumName && album.artist === artistName);
};