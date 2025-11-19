module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
  ],
  testMatch: [
    '**/tests/**/*.test.js',
  ],
  setupFiles: ['<rootDir>/tests/setup.js'],
  verbose: true,
  testTimeout: 30000,
  maxWorkers: 1, // Run tests serially to avoid database conflicts
};
