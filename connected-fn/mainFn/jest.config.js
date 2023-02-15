module.exports = {
  preset: 'ts-jest',
  rootDir: '.',
  coverageReporters: ['text-summary', 'json-summary', 'html'],
  setupFiles: ['<rootDir>/config/jest/test-setup.js'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.ts?(x)', '<rootDir>/src/**/?(*.)(spec|test).ts?(x)'],
  testEnvironment: 'node',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.tsx?$': '<rootDir>/config/jest/typescriptTransform.js',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'],
  moduleFileExtensions: ['web.ts', 'ts', 'web.tsx', 'tsx', 'web.js', 'js', 'web.jsx', 'jsx', 'json', 'node'],
};