# Spotify Clone

A modern web-based music player clone built with React and TypeScript, featuring the iconic Spotify interface and core music player functionality.

## Features

- 🎵 Music player with play/pause controls
- 🔀 Shuffle and repeat modes
- 🔊 Volume control
- 📱 Responsive design matching Spotify's UI
- 🎨 Dark theme interface
- 📋 Playlist management
- 🎧 Track information display
- ⏯️ Progress bar with seek functionality

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Styled Components
- **Icons**: Lucide React
- **State Management**: React Context API with useReducer
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tig-company/spotify-clone.git
cd spotify-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/          # React components
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── MainContent.tsx # Main content area
│   └── Player.tsx      # Bottom music player
├── contexts/           # React contexts
│   └── PlayerContext.tsx # Music player state management
├── types/              # TypeScript type definitions
│   └── index.ts        # Core types for Track, Playlist, User, etc.
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Utility functions
└── App.tsx             # Main App component
```

## Components Overview

### Sidebar
- Navigation menu with Home, Search, Your Library
- Playlist management
- Create new playlists

### MainContent
- Recently played tracks
- Track grid with cover art
- Greeting based on time of day
- Play button hover effects

### Player
- Play/pause controls
- Skip forward/backward
- Shuffle and repeat toggles
- Volume control slider
- Progress bar with time display
- Current track information

### PlayerContext
- Global state management for music player
- Track queue management
- Playback controls
- Volume and progress tracking

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - One-way operation to eject from CRA

## Future Enhancements

- [ ] Search functionality
- [ ] User authentication
- [ ] Playlist creation and editing
- [ ] Like/unlike tracks
- [ ] Queue management
- [ ] Artist and album pages
- [ ] Social features
- [ ] Offline mode
- [ ] Mobile app version

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is for educational purposes only. Spotify is a trademark of Spotify AB.
