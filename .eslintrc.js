module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    plugins: ['import'],
    overrides: [
      {
        env: {
          node: true,
          jest: true,
        },
        files: ['**/*.ts'],
        parserOptions: {
          sourceType: 'script',
        },
      },
    ],
    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: __dirname,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    ignorePatterns: ['**/*.js'],
    rules: {
      semi: ['error', 'always'],
      indent: ['error', 2],
      'max-len': ['error', { code: 160 }],
      quotes: ['error', 'single', { avoidEscape: true }],
      eqeqeq: ['error', 'smart'],
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': 'error',
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'off',
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal'],
          'newlines-between': 'always',
          'alphabetize': {
            'order': 'asc',
            'caseInsensitive': true,
          },
        },
      ],
    },
  };
