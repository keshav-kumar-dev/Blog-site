module.exports = {
  env: {
    node: true,
    es2023: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier', 'simple-import-sort'],
  rules: {
    // Prettier formatting
    'prettier/prettier': 'error',

    // General ESLint rules
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
    eqeqeq: ['error', 'always'],
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: ['error', 2],

    // Auto-fix require() and import statements
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Node.js built-ins
          ['^node:?', '^(fs|path|http|https|crypto)$'],
          // External packages
          ['^\\w'],
          // Internal modules (your project files)
          ['^@?\\w'],
          // Relative paths
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.json'] },
    },
  },
};
