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
        version: 'detect',
      },
    },
    rules: {
      'no-unused-vars': 'warn', // relaxed to warning to avoid build failure
      '@next/next/no-img-element': 'off', // disable img element warning completely
      'react/react-in-jsx-scope': 'off', // disable since Next.js React 17+ handles this
      'react/prop-types': 'off', // disable prop-types checks if using TypeScript
      'react/display-name': 'off', // disable display name warnings
    },
  }),
];

export default eslintConfig;