import React from 'react';
import { Home, Search, Library, Plus, Heart } from 'lucide-react';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 240px;
  background-color: #000;
  color: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  color: #b3b3b3;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }

  &.active {
    color: #fff;
  }
`;

const PlaylistSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PlaylistHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PlaylistTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #b3b3b3;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CreatePlaylistButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
`;

const PlaylistList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PlaylistItem = styled.li`
  color: #b3b3b3;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
`;

export function Sidebar() {
  return (
    <SidebarContainer>
      <Logo>Spotify</Logo>
      
      <nav>
        <NavList>
          <NavItem className="active">
            <Home size={24} />
            <span>Home</span>
          </NavItem>
          <NavItem>
            <Search size={24} />
            <span>Search</span>
          </NavItem>
          <NavItem>
            <Library size={24} />
            <span>Your Library</span>
          </NavItem>
        </NavList>
      </nav>

      <PlaylistSection>
        <PlaylistHeader>
          <PlaylistTitle>Playlists</PlaylistTitle>
          <CreatePlaylistButton>
            <Plus size={16} />
          </CreatePlaylistButton>
        </PlaylistHeader>
        
        <PlaylistList>
          <PlaylistItem>
            <Heart size={14} style={{ marginRight: '8px', display: 'inline' }} />
            Liked Songs
          </PlaylistItem>
          <PlaylistItem>My Playlist #1</PlaylistItem>
          <PlaylistItem>Chill Vibes</PlaylistItem>
          <PlaylistItem>Workout Mix</PlaylistItem>
        </PlaylistList>
      </PlaylistSection>
    </SidebarContainer>
  );
}