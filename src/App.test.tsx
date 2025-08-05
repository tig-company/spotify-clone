import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock next-themes to prevent addListener errors in JSDOM
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
  useTheme: () => ({
    theme: 'dark',
    setTheme: jest.fn(),
    resolvedTheme: 'dark',
    themes: ['light', 'dark'],
    systemTheme: 'dark'
  })
}));

describe('App Component', () => {
  test('renders spotify clone app successfully', () => {
    render(<App />);
    
    // Check that the main app container renders
    const appContainer = screen.getByRole('region', { name: 'Music player' });
    expect(appContainer).toBeInTheDocument();
    
    // Check that theme provider is present
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });

  test('renders all main sections', () => {
    render(<App />);
    
    // Should have player component
    expect(screen.getByRole('region', { name: 'Music player' })).toBeInTheDocument();
    
    // Should have playback controls
    expect(screen.getByLabelText('Play')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous track')).toBeInTheDocument();
    expect(screen.getByLabelText('Next track')).toBeInTheDocument();
  });

  test('initializes with proper layout structure', () => {
    render(<App />);
    
    // Check main flex container structure
    const appElement = document.querySelector('.flex.flex-col.h-screen');
    expect(appElement).toBeInTheDocument();
    
    // Check nested layout structure
    const contentArea = document.querySelector('.flex.flex-1.overflow-hidden');
    expect(contentArea).toBeInTheDocument();
  });
});
