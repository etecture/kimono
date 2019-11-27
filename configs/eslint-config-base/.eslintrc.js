module.exports = {
  env: {
    es6: true
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['warn'],
    'no-use-before-define': [
      1,
      {
        classes: false,
        functions: false
      }
    ],
    'no-unused-vars': [
      1,
      {
        ignoreRestSiblings: true
      }
    ],
    'no-console': 'off'
  }
};
