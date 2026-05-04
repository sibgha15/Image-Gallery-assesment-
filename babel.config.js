module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    // Reanimated 4: Worklets Babel plugin must be last (see Reanimated "Getting started" → RN CLI).
    plugins: ['react-native-worklets/plugin'],
  };
};
