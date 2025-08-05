// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

global.ResizeObserver = MockResizeObserver as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => {
    const mockMediaQueryList = {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
    return mockMediaQueryList;
  }),
});

// Mock pointer capture methods for Radix UI components
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  writable: true,
  value: jest.fn().mockReturnValue(false),
});

Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
  writable: true,
  value: jest.fn(),
});

// Mock scrollIntoView method
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  writable: true,
  value: jest.fn(),
});

// Enhanced audio element mocking for better test compatibility
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
});

Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
  writable: true,
  value: 0,
});

Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
  writable: true,
  value: 1,
});

Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
  writable: true,
  value: true,
});

Object.defineProperty(HTMLMediaElement.prototype, 'ended', {
  writable: true,
  value: false,
});

Object.defineProperty(HTMLMediaElement.prototype, 'readyState', {
  writable: true,
  value: 4, // HAVE_ENOUGH_DATA
});

// Suppress console.error for known JSDOM/Radix UI compatibility issues
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('hasPointerCapture') ||
       args[0].includes('setPointerCapture') ||
       args[0].includes('releasePointerCapture') ||
       args[0].includes('Not implemented: HTMLMediaElement.prototype.load') ||
       args[0].includes('Error: Not implemented'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
