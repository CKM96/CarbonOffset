module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jsdom',
};
