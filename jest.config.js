export default {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  verbose: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tmp/'
  ]
};