import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Image, ImageSkeleton } from './image';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));
window.IntersectionObserver = mockIntersectionObserver;

describe('Image Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(<Image src="/test-image.jpg" alt="Test image" />);
      
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/test-image.jpg');
      expect(img).toHaveAttribute('alt', 'Test image');
    });

    it('applies custom className', () => {
      render(<Image src="/test-image.jpg" alt="Test image" className="custom-class" />);
      
      const img = screen.getByRole('img');
      expect(img).toHaveClass('custom-class');
    });

    it('renders with default fallback when no fallbackSrc provided', () => {
      render(<Image src="/test-image.jpg" alt="Test image" />);
      
      // Initially shows loading state, then loads image
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading skeleton by default', () => {
      render(<Image src="/test-image.jpg" alt="Test image" showLoadingSkeleton={true} />);
      
      const loadingElement = screen.getByLabelText('Loading Test image');
      expect(loadingElement).toBeInTheDocument();
    });

    it('hides loading skeleton when showLoadingSkeleton is false', () => {
      render(<Image src="/test-image.jpg" alt="Test image" showLoadingSkeleton={false} />);
      
      expect(screen.queryByLabelText('Loading Test image')).not.toBeInTheDocument();
    });

    it('applies loading className when loading', () => {
      render(
        <Image 
          src="/test-image.jpg" 
          alt="Test image" 
          loadingClassName="loading-custom"
          showLoadingSkeleton={true}
        />
      );
      
      const img = screen.getByRole('img');
      expect(img).toHaveClass('loading-custom');
    });
  });

  describe('Error Handling', () => {
    it('shows fallback image on error', async () => {
      render(
        <Image 
          src="/broken-image.jpg" 
          alt="Test image" 
          fallbackSrc="/fallback-image.jpg" 
        />
      );
      
      const img = screen.getByRole('img');
      fireEvent.error(img);
      
      await waitFor(() => {
        expect(img).toHaveAttribute('src', '/fallback-image.jpg');
      });
    });

    it('shows error state when both main and fallback images fail', async () => {
      render(
        <Image 
          src="/broken-image.jpg" 
          alt="Test image" 
          fallbackSrc="/broken-fallback.jpg"
          errorClassName="error-custom"
        />
      );
      
      const img = screen.getByRole('img');
      
      // First error switches to fallback
      fireEvent.error(img);
      
      await waitFor(() => {
        expect(img).toHaveAttribute('src', '/broken-fallback.jpg');
      });
      
      // Second error shows error state
      fireEvent.error(img);
      
      await waitFor(() => {
        const errorElement = screen.getByLabelText('Failed to load Test image');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveClass('error-custom');
      });
    });

    it('calls onError callback when image fails to load', () => {
      const onErrorMock = jest.fn();
      render(
        <Image 
          src="/broken-image.jpg" 
          alt="Test image" 
          onError={onErrorMock}
        />
      );
      
      const img = screen.getByRole('img');
      fireEvent.error(img);
      
      expect(onErrorMock).toHaveBeenCalled();
    });
  });

  describe('Success Handling', () => {
    it('calls onLoad callback when image loads successfully', () => {
      const onLoadMock = jest.fn();
      render(
        <Image 
          src="/test-image.jpg" 
          alt="Test image" 
          onLoad={onLoadMock}
        />
      );
      
      const img = screen.getByRole('img');
      fireEvent.load(img);
      
      expect(onLoadMock).toHaveBeenCalled();
    });

    it('removes loading state when image loads', async () => {
      render(
        <Image 
          src="/test-image.jpg" 
          alt="Test image" 
          showLoadingSkeleton={true}
        />
      );
      
      const img = screen.getByRole('img');
      fireEvent.load(img);
      
      await waitFor(() => {
        expect(screen.queryByLabelText('Loading Test image')).not.toBeInTheDocument();
      });
    });
  });

  describe('Lazy Loading', () => {
    it('uses lazy loading by default', () => {
      render(<Image src="/test-image.jpg" alt="Test image" />);
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('disables lazy loading when lazy=false', () => {
      render(<Image src="/test-image.jpg" alt="Test image" lazy={false} />);
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'eager');
    });

    it('sets up IntersectionObserver for lazy loading', () => {
      render(<Image src="/test-image.jpg" alt="Test image" lazy={true} />);
      
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          rootMargin: '50px',
          threshold: 0.1,
        }
      );
    });

    it('shows skeleton while not in view when lazy loading', () => {
      render(
        <Image 
          src="/test-image.jpg" 
          alt="Test image" 
          lazy={true}
          showLoadingSkeleton={true}
        />
      );
      
      const loadingElement = screen.getByLabelText('Loading Test image');
      expect(loadingElement).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text', () => {
      render(<Image src="/test-image.jpg" alt="Descriptive alt text" />);
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Descriptive alt text');
    });

    it('provides accessible error state', async () => {
      render(
        <Image 
          src="/broken-image.jpg" 
          alt="Test image" 
          fallbackSrc="/broken-fallback.jpg"
        />
      );
      
      const img = screen.getByRole('img');
      
      // Trigger both errors to reach error state
      fireEvent.error(img);
      fireEvent.error(img);
      
      await waitFor(() => {
        const errorElement = screen.getByLabelText('Failed to load Test image');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveAttribute('role', 'img');
      });
    });

    it('provides accessible loading state', () => {
      render(
        <Image 
          src="/test-image.jpg" 
          alt="Test image" 
          showLoadingSkeleton={true}
        />
      );
      
      const loadingElement = screen.getByLabelText('Loading Test image');
      expect(loadingElement).toHaveAttribute('role', 'img');
    });
  });

  describe('Source Changes', () => {
    it('resets state when src changes', async () => {
      const { rerender } = render(
        <Image src="/image1.jpg" alt="Test image" />
      );
      
      const img = screen.getByRole('img');
      fireEvent.load(img);
      
      // Change source
      rerender(<Image src="/image2.jpg" alt="Test image" />);
      
      await waitFor(() => {
        expect(img).toHaveAttribute('src', '/image2.jpg');
      });
    });
  });

  describe('Additional Props', () => {
    it('passes through additional HTML attributes', () => {
      render(
        <Image 
          src="/test-image.jpg" 
          alt="Test image" 
          data-testid="custom-image"
          title="Custom title"
        />
      );
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('data-testid', 'custom-image');
      expect(img).toHaveAttribute('title', 'Custom title');
    });
  });
});

describe('ImageSkeleton Component', () => {
  it('renders skeleton with proper accessibility', () => {
    render(<ImageSkeleton className="custom-skeleton" />);
    
    const skeleton = screen.getByLabelText('Loading image');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('role', 'img');
    expect(skeleton).toHaveClass('custom-skeleton');
  });

  it('applies default styles', () => {
    render(<ImageSkeleton />);
    
    const skeleton = screen.getByLabelText('Loading image');
    expect(skeleton).toHaveClass('animate-pulse', 'bg-spotify-medium-gray', 'rounded');
  });

  it('passes through additional props', () => {
    render(<ImageSkeleton data-testid="custom-skeleton" />);
    
    const skeleton = screen.getByLabelText('Loading image');
    expect(skeleton).toHaveAttribute('data-testid', 'custom-skeleton');
  });
});