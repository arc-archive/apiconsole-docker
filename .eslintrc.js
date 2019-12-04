// module.exports = {
//     "extends": "google"
// };
module.exports = {
  extends: ['@advanced-rest-client/eslint-config'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
  },
};
