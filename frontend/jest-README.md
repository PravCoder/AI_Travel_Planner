# Setting Up Jest for Schedule Component Testing

This document outlines the steps needed to set up and run the unit tests for the Schedule component.

## 1. Install Required Dependencies

First, install Jest and React Testing Library:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

## 2. Configure Jest

Create a `jest.config.js` file in your project root:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Handle CSS imports (if you're using CSS modules)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // Handle module aliases (if you're using them)
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
```

## 3. Create Jest Setup File

Create a `jest.setup.js` file in your project root:

```javascript
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
  observe() {}
  unobserve() {}
  disconnect() {}
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
```

## 4. Create Mock Files(if needed)

Create a `__mocks__` directory in your project root and add files for handling imports:

    `__mocks__/fileMock.js`:
```javascript
// File mock for non-JS/TS file imports
module.exports = 'test-file-stub';
```

`__mocks__/styleMock.js`:
```javascript
// Style mock for CSS imports
module.exports = {};
```

## 5. Add NPM Scripts

Update your `package.json` with the following script:

```json
"scripts": {
  "test_jest": "jest",
  "test_jest:watch": "jest --watch",
  "test_jest:coverage": "jest --coverage"
}
```

## 6. Running the Tests

Now you can run your tests with the following command:

```bash
npm test_jest
```

For watch mode(continuously running tests):

```bash
npm run test_jest:watch
```

For code coverage reports:

```bash
npm run test_jest:coverage
```

## Troubleshooting

If you encounter issues with the tests:

1. ** TypeScript errors **: Make sure you have `ts-jest` properly configured
2. ** Import errors **: Check that your module paths and aliases are correctly set up in the Jest config
3. ** DOM errors **: Ensure you're using `@testing-library/jest-dom` for DOM testing assertions
4. ** Component rendering issues **: Check that your component doesn't depend on browser APIs that aren't available in jsdom

## Additional Resources

    - [Jest Documentation](https://jestjs.io/docs/getting-started)
        -[React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
            -[Testing React with Jest and React Testing Library](https://www.smashingmagazine.com/2020/07/react-apps-testing-library/)