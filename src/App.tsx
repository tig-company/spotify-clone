import React from 'react';
import styled from 'styled-components';
import { PlayerProvider } from './contexts/PlayerContext';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Player } from './components/Player';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #000;
`;

const MainLayout = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

function App() {
  return (
    <PlayerProvider>
      <AppContainer>
        <MainLayout>
          <Sidebar />
          <MainContent />
        </MainLayout>
        <Player />
      </AppContainer>
    </PlayerProvider>
  );
}

export default App;
