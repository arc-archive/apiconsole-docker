module.exports = {
  extends: ['@advanced-rest-client/eslint-config', 'eslint-config-prettier'].map(require.resolve),
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
  },
};
