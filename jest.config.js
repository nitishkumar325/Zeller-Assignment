module.exports = {
  preset: 'react-native',
  // Redux Toolkit ships ESM that Jest does not parse unless we transform it.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|immer|@reduxjs|redux|reselect|graphql-request|graphql)/)',
  ],
};
