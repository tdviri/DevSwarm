module.exports = {
    preset: '@shelf/jest-mongodb',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/testSetup.js'],
  };
  