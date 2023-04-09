module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'nativewind/babel',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          state: './src/state',
          hooks: './src/hooks',
          components: './src/components',
          screens: './src/screens',
          util: './src/util',
        },
      },
    ],
  ],
};
