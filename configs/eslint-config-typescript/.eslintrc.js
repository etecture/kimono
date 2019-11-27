module.exports = {
  extends: ['plugin:@typescript-eslint/eslint-recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],

  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-use-before-define': [
      1,
      {
        classes: false,
        functions: false
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      1,
      {
        ignoreRestSiblings: true
      }
    ]
  },
  overrides: [
    {
      // https://github.com/typescript-eslint/typescript-eslint/issues/46#issuecomment-470486034
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [2, { args: 'none' }]
      }
    }
  ]
};
