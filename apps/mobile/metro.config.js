/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');
const path = require('path');

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  projectRoot: path.resolve(__dirname, './'),
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
  watchFolders: [
    path.resolve(__dirname, '../../node_modules'),
    path.resolve(__dirname, '../../packages/'),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
