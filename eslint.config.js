import js from '@eslint/js';
import globals from 'globals';
import jest from 'eslint-plugin-jest';

export default [{
  name: 'global',
  ignores: [
    'cjs/**',
    'coverage/**',
    'tmp/**',
    'node_modules/**'
  ]
}, {
  name: 'lib-test-package',
  files: [
    '*.js',
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
  name: 'tests',
  files: [
    '__tests__/**'
  ],
  ...jest.configs['flat/recommended'],
  rules: {
    ...jest.configs['flat/recommended'].rules,
    'jest/no-done-callback': 'off',
    'jest/expect-expect': 'off',
    'jest/valid-title': 'off'
  }
}];
