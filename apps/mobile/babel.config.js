module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-transform-private-methods', { loose: true }],
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        verbose: false,
        path: './../../.env',
      },
    ],
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
          utils: './src/utils',
        },
      },
    ],
  ],
};
