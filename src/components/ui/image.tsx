import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** The source URL of the image */
  src: string;
  /** Alternative text for the image */
  alt: string;
  /** Fallback image source when main image fails to load */
  fallbackSrc?: string;
  /** Whether to enable lazy loading */
  lazy?: boolean;
  /** Loading state className */
  loadingClassName?: string;
  /** Error state className */
  errorClassName?: string;
  /** Callback when image loads successfully */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: () => void;
  /** Show loading skeleton while image loads */
  showLoadingSkeleton?: boolean;
}

interface ImageState {
  loading: boolean;
  error: boolean;
  loaded: boolean;
}

export function Image({
  src,
  alt,
  fallbackSrc = '/images/default-album.svg',
  lazy = true,
  className,
  loadingClassName,
  errorClassName,
  onLoad,
  onError,
  showLoadingSkeleton = true,
  ...props
}: ImageProps) {
  const [state, setState] = useState<ImageState>({
    loading: true,
    error: false,
    loaded: false,
  });
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(!lazy);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  // Handle image load
  const handleLoad = () => {
    setState({
      loading: false,
      error: false,
      loaded: true,
    });
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      // Try fallback image
      setCurrentSrc(fallbackSrc);
    } else {
      // Fallback also failed
      setState({
        loading: false,
        error: true,
        loaded: false,
      });
    }
    onError?.();
  };

  // Reset state when src changes
  useEffect(() => {
    if (src !== currentSrc) {
      setCurrentSrc(src);
      setState({
        loading: true,
        error: false,
        loaded: false,
      });
    }
  }, [src, currentSrc]);

  const imageClasses = cn(
    'transition-opacity duration-300',
    {
      'opacity-0': state.loading && showLoadingSkeleton,
      'opacity-100': state.loaded,
    },
    state.loading && loadingClassName,
    state.error && errorClassName,
    className
  );

  const skeletonClasses = cn(
    'animate-pulse bg-spotify-medium-gray',
    className
  );

  // Don't render anything if not in view (for lazy loading)
  if (!isInView) {
    return showLoadingSkeleton ? (
      <div
        ref={imgRef}
        className={skeletonClasses}
        role="img"
        aria-label={`Loading ${alt}`}
      />
    ) : (
      <div ref={imgRef} className={className} />
    );
  }

  return (
    <div className="relative inline-block">
      {/* Loading skeleton */}
      {state.loading && showLoadingSkeleton && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse bg-spotify-medium-gray rounded',
            className
          )}
          aria-hidden="true"
        />
      )}
      
      {/* Error state */}
      {state.error && (
        <div
          className={cn(
            'flex items-center justify-center bg-spotify-medium-gray text-spotify-text-gray text-xs',
            className
          )}
          role="img"
          aria-label={`Failed to load ${alt}`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-50"
          >
            <path
              d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}
      
      {/* Actual image */}
      {!state.error && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
          {...props}
        />
      )}
    </div>
  );
}

// Export loading skeleton component for manual use
export function ImageSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse bg-spotify-medium-gray rounded',
        className
      )}
      role="img"
      aria-label="Loading image"
      {...props}
    />
  );
}