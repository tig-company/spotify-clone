import React from 'react';
import { PlayerProvider } from './contexts/PlayerContext';
import { ThemeProvider } from './components/ui/theme-provider';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Player } from './components/Player';

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <PlayerProvider>
        <div className="flex flex-col h-screen bg-spotify-black dark:bg-spotify-black light:bg-white">
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <MainContent />
          </div>
          <Player />
        </div>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
