import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  tseslint.configs.recommended,
  {
    rules: {
      quotes: [2, 'single', { avoidEscape: true }],
      semi: ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'comma-dangle': ['error', {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
      }],
      'newline-before-return': ['error'],
      '@typescript-eslint/no-namespace': 'off',
    },
  },
])