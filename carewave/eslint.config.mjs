// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next', 'plugin:react/recommended', 'prettier'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
    rules: {
      'no-unused-vars': 'off', // Disable no-unused-vars rule globally
      '@next/next/no-img-element': 'warn', // Keep no-img-element as warning (optional, based on your preference)
    },
  }),
];

export default eslintConfig;