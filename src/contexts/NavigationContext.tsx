import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Artist, Album, NavigationState } from '../types';

interface NavigationContextType {
  state: NavigationState;
  showArtistDetails: (artist: Artist) => void;
  showAlbumDetails: (album: Album) => void;
  goHome: () => void;
  hideDetailsSidebar: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

type NavigationAction =
  | { type: 'SHOW_ARTIST_DETAILS'; payload: Artist }
  | { type: 'SHOW_ALBUM_DETAILS'; payload: Album }
  | { type: 'GO_HOME' }
  | { type: 'HIDE_DETAILS_SIDEBAR' };

const initialState: NavigationState = {
  currentView: 'home',
  selectedArtist: null,
  selectedAlbum: null,
  showDetailsSidebar: false,
};

function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  switch (action.type) {
    case 'SHOW_ARTIST_DETAILS':
      return {
        ...state,
        currentView: 'artist',
        selectedArtist: action.payload,
        selectedAlbum: null,
        showDetailsSidebar: true,
      };
    case 'SHOW_ALBUM_DETAILS':
      return {
        ...state,
        currentView: 'album',
        selectedAlbum: action.payload,
        selectedArtist: null,
        showDetailsSidebar: true,
      };
    case 'GO_HOME':
      return {
        ...state,
        currentView: 'home',
        selectedArtist: null,
        selectedAlbum: null,
        showDetailsSidebar: false,
      };
    case 'HIDE_DETAILS_SIDEBAR':
      return {
        ...state,
        showDetailsSidebar: false,
      };
    default:
      return state;
  }
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(navigationReducer, initialState);

  const contextValue: NavigationContextType = {
    state,
    showArtistDetails: (artist) => dispatch({ type: 'SHOW_ARTIST_DETAILS', payload: artist }),
    showAlbumDetails: (album) => dispatch({ type: 'SHOW_ALBUM_DETAILS', payload: album }),
    goHome: () => dispatch({ type: 'GO_HOME' }),
    hideDetailsSidebar: () => dispatch({ type: 'HIDE_DETAILS_SIDEBAR' }),
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}