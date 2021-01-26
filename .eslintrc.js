module.exports = {
  extends: ['google', 'prettier'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2019
  }
};
// module.exports = {
//   extends: ['@advanced-rest-client/eslint-config'],
//   rules: {
//     'import/no-extraneous-dependencies': 'off',
//     'no-plusplus': 'off',
//     'no-await-in-loop': 'off',
//     'no-continue': 'off',
//   },
// };
