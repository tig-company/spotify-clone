import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { ArtistDetails } from './ArtistDetails';
import { AlbumDetails } from './AlbumDetails';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';

export function DetailsSidebar() {
  const { state, goHome, hideDetailsSidebar } = useNavigation();

  if (!state.showDetailsSidebar) {
    return null;
  }

  return (
    <div className={cn(
      "w-80 lg:w-80 md:w-72 bg-spotify-dark-gray text-white flex flex-col border-l border-spotify-light-gray",
      "transition-transform duration-300 ease-in-out"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-spotify-light-gray">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={goHome}
            className="text-spotify-text-gray hover:text-white hover:bg-spotify-light-gray"
          >
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-lg font-semibold">
            {state.currentView === 'artist' && state.selectedArtist && 'Artist'}
            {state.currentView === 'album' && state.selectedAlbum && 'Album'}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={hideDetailsSidebar}
          className="text-spotify-text-gray hover:text-white hover:bg-spotify-light-gray"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {state.currentView === 'artist' && state.selectedArtist && (
          <ArtistDetails artist={state.selectedArtist} />
        )}
        {state.currentView === 'album' && state.selectedAlbum && (
          <AlbumDetails album={state.selectedAlbum} />
        )}
      </div>
    </div>
  );
}