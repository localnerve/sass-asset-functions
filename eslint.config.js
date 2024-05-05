import js from '@eslint/js';
import globals from 'globals';
import jest from 'eslint-plugin-jest';

export default [{
  ignores: [
    'cjs/**',
    'coverage/**',
    'node_modules/**',
    'tmp/**'
  ]
}, {
  files: [
    'index.js',
    'lib/**',
    '__test-package__/**'
  ],
  rules: js.configs.recommended.rules,
  languageOptions: {
    globals: {
      ...globals.node
    }
  }
}, {
  files: [
    '__tests__/**'
  ],
  ...jest.configs['flat/recommended'],
  rules: {
    ...jest.configs['flat/recommended'].rules,
    'jest/expect-expect': 'off',
    'jest/valid-title': 'off',
    'jest/no-done-callback': 'off'
  }
}];