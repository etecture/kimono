module.exports = {
  extends: ['plugin:react/recommended'],
  env: {
    es6: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/display-name': 0,
    'react/prop-types': 'off',
    'react/no-children-prop': 'off',
    'react/no-unescaped-entities': 'off'
  }
};
