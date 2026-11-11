import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/*.js',
      '**/*.cjs',
      '**/*.spec.ts',
      '**/*.spec.tsx'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort,
      perfectionist
    },
    rules: {
      'comma-dangle': ['error', 'never'],
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': [
        'error',
        {
          handlers: [
            'onClick',
            'onMouseDown',
            'onMouseUp',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp'
          ]
        }
      ],
      'jsx-a11y/no-static-element-interactions': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [['^@', '^\\w', '^\\.'], ['^\\u0000']]
        }
      ],
      'simple-import-sort/exports': 'error',
      'perfectionist/sort-interfaces': [
        'warn',
        {
          type: 'alphabetical',
          order: 'asc',
          groups: ['required-member', 'optional-member']
        }
      ]
    }
  },
  {
    files: ['src/components/organisms/PickerColor/PickerColor.tsx'],
    rules: {
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off'
    }
  }
);
