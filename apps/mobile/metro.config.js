/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');
const { makeMetroConfig } = require('@rnx-kit/metro-config');

module.exports = makeMetroConfig({
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    resolveRequest: MetroSymlinksResolver(),
    extraNodeModules: {
      stream: require.resolve('readable-stream'),
      crypto: require.resolve('expo-crypto'),
    },
  },
});
