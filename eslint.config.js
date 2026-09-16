const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const globals = require('globals');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    files: ['*.js', '*.cjs'],
    languageOptions: { globals: globals.node },
  },
  ...compat.extends('expo'),
  {
    rules: {
      'no-console': 'warn',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '.expo/**'],
  },
];
