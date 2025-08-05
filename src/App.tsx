import React from 'react';
import { PlayerProvider } from './contexts/PlayerContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { ThemeProvider } from './components/ui/theme-provider';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { DetailsSidebar } from './components/DetailsSidebar';
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
        <NavigationProvider>
          <div className="flex flex-col h-screen bg-spotify-black dark:bg-spotify-black light:bg-white">
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <MainContent />
              <DetailsSidebar />
            </div>
            <Player />
          </div>
        </NavigationProvider>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
