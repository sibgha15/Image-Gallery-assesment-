module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-redux|@reduxjs/toolkit|immer|reselect|@apollo/|rxjs|react-native-screens|react-native-gesture-handler|react-native-safe-area-context|react-native-reanimated|@react-navigation)/)',
  ],
};
