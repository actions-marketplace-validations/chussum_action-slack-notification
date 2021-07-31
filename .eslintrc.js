module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      excludedFiles: ['*.js', '*.jsx'],
      rules: {
        'no-console': 'off',
        'no-continue': 'off',
        'class-methods-use-this': 'off',
        'import/extensions': 'off',
        'import/no-named-as-default': 'off',
        'import/prefer-default-export': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-props-no-spreading': 'off',
        'require-await': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-use-before-define': [
          'warn',
          { functions: false, classes: false, variables: false, typedefs: false },
        ],
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'interface',
            format: ['PascalCase'],
          },
        ],
        // It's not accurate in the monorepo style
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'spaced-comment': ['error', 'always', { markers: ['/'] }],
      },
    },
    {
      files: ['tools/**/*.js'],
      rules: {
        'global-require': 'off',
      },
    },
  ],
};
