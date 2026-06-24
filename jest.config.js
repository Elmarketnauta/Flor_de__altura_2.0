const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/__tests__/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/.next/', '/dist/'],
  // framer-motion v11 ships conditional ESM exports; jest needs to transform it
  transformIgnorePatterns: [
    '/node_modules/(?!(framer-motion)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  transform: {
    '^.+\\.(ts|tsx|js|mjs)$': ['@swc/jest'],
  },
}

module.exports = createJestConfig(customJestConfig)
