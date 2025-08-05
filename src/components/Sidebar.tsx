import React from 'react';
import { Home, Search, Library, Plus, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ui/theme-toggle';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <li
      role="menuitem"
      tabIndex={0}
      className={cn(
        "flex items-center gap-4 cursor-pointer text-spotify-text-gray font-medium transition-colors duration-200 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-spotify-green rounded",
        active && "text-white"
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-current={active ? 'page' : undefined}
    >
      {icon}
      <span className="md:hidden">{label}</span>
    </li>
  );
}

interface PlaylistItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

function PlaylistItem({ children, onClick }: PlaylistItemProps) {
  return (
    <li
      role="menuitem"
      tabIndex={0}
      className="text-spotify-text-gray cursor-pointer text-sm transition-colors duration-200 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-spotify-green rounded p-1"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {children}
    </li>
  );
}

export function Sidebar() {
  const { state, goHome } = useNavigation();
  const isHome = state.currentView === 'home';

  // Hide sidebar when details sidebar is shown on smaller screens
  const sidebarClasses = cn(
    "w-60 lg:w-60 md:w-16 bg-spotify-black text-white p-6 md:p-2 flex flex-col gap-8 md:gap-4",
    state.showDetailsSidebar && "lg:flex md:hidden sm:hidden"
  );

  return (
    <aside className="w-60 lg:w-60 md:w-16 bg-spotify-black text-white p-6 md:p-2 flex flex-col gap-8 md:gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold m-0 md:hidden">Spotify</h1>
        <ThemeToggle />
      </div>
      
      <nav role="navigation" aria-label="Main navigation">
        <ul role="menu" className="list-none p-0 m-0 flex flex-col gap-4">
          <NavItem
            icon={<Home size={24} />}
            label="Home"
            active={isHome}
            onClick={goHome}
          />
          <NavItem
            icon={<Search size={24} />}
            label="Search"
          />
          <NavItem
            icon={<Library size={24} />}
            label="Your Library"
          />
        </ul>
      </nav>

      <div className="flex-1 flex flex-col gap-4 md:hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-spotify-text-gray m-0 uppercase tracking-wider">
            Playlists
          </h3>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-spotify-text-gray hover:text-white hover:bg-transparent"
          >
            <Plus size={16} />
          </Button>
        </div>
        
        <ul role="menu" aria-label="Playlists" className="list-none p-0 m-0 flex flex-col gap-2">
          <PlaylistItem>
            <div className="flex items-center gap-2">
              <Heart size={14} />
              Liked Songs
            </div>
          </PlaylistItem>
          <PlaylistItem>My Playlist #1</PlaylistItem>
          <PlaylistItem>Chill Vibes</PlaylistItem>
          <PlaylistItem>Workout Mix</PlaylistItem>
        </ul>
      </div>
    </aside>
  );
}