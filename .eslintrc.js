module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'prettier'],

  env: {
    es2020: true,
    browser: true,
    node: true,
  },

  rules: {
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'all',
        tabWidth: 2,
        semi: false,
        singleQuote: true,
        bracketSpacing: true,
        eslintIntegration: true,
        printWidth: 120,
      },
    ],
    eqeqeq: ['warn', 'always'],
    'no-constructor-return': ['warn', 'always'],
    'no-duplicate-imports': ['warn', 'always'],
    'array-callback-return': ['warn', 'always'],
    'no-constant-binary-expression': ['warn', 'always'],
  },

  ignorePatterns: ['dist/**/*'],
}
