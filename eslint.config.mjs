// eslint.config.mjs
import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Add any custom rules here
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'react/no-unescaped-entities': 'off',
  }
});