// Add Jest-DOM extended assertions
import '@testing-library/jest-dom';

// Mock localStorage
class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }

    removeItem(key) {
        delete this.store[key];
    }
}

Object.defineProperty(window, 'localStorage', {
    value: new LocalStorageMock(),
});

// Mock for ResizeObserver which is not available in jsdom
global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});