import { Artist, Album, Track } from '../types';

export const mockTracks: Track[] = [
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
  },
  {
    id: '7',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    duration: 167,
    cover: 'https://via.placeholder.com/300x300?text=As+It+Was',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '8',
    title: 'Music For a Sushi Restaurant',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    duration: 193,
    cover: 'https://via.placeholder.com/300x300?text=Music+For+Sushi',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '9',
    title: 'Don\'t Worry Darling',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 198,
    cover: 'https://via.placeholder.com/300x300?text=Don%27t+Worry+Darling',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '10',
    title: 'Physical',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 194,
    cover: 'https://via.placeholder.com/300x300?text=Physical',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '11',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 215,
    cover: 'https://via.placeholder.com/300x300?text=Save+Your+Tears',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '12',
    title: 'Heartless',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 198,
    cover: 'https://via.placeholder.com/300x300?text=Heartless',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  }
];

export const mockAlbums: Album[] = [
  {
    id: 'album1',
    name: 'After Hours',
    artist: 'The Weeknd',
    artistId: 'artist1',
    cover: 'https://via.placeholder.com/300x300?text=After+Hours',
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
    cover: 'https://via.placeholder.com/300x300?text=Fine+Line',
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
    cover: 'https://via.placeholder.com/300x300?text=Harry%27s+House',
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
    cover: 'https://via.placeholder.com/300x300?text=Future+Nostalgia',
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
    cover: 'https://via.placeholder.com/300x300?text=SOUR',
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
    cover: 'https://via.placeholder.com/300x300?text=MONTERO',
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
    image: 'https://via.placeholder.com/300x300?text=The+Weeknd',
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
    image: 'https://via.placeholder.com/300x300?text=Harry+Styles',
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
    image: 'https://via.placeholder.com/300x300?text=Dua+Lipa',
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
    image: 'https://via.placeholder.com/300x300?text=Olivia+Rodrigo',
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
    image: 'https://via.placeholder.com/300x300?text=Lil+Nas+X',
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