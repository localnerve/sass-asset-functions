import js from '@eslint/js';
import globals from 'globals';
import nodePlugin from 'eslint-plugin-n';

const nodeRules = nodePlugin.configs['flat/recommended'].rules;

export default [{
  name: 'global',
  ignores: [
    'cjs/**',
    'coverage/**',
    'tmp/**',
    'node_modules/**'
  ]
}, {
  plugins: { n: nodePlugin },
  name: 'lib',
  files: [
    'index.js',
    'lib/**'
  ],
  rules: {
    ...js.configs.recommended.rules,
    ...nodeRules
  },
  languageOptions: {
    globals: {
      ...globals.node
    }
  }
}, {
  plugins: { n: nodePlugin },
  name: 'dev',
  files: [
    '__tests__/**',
    '__test-package__/**',
    'eslint.config.js',
    'posttranspile.js'
  ],
  rules: {
    ...js.configs.recommended.rules,
    ...nodeRules,
    'n/no-unsupported-features/node-builtins': 'off',
    // Allow devDependencies in tests
    'n/no-extraneous-require': ['error', {
      'allowModules': ['sass', 'tar', 'glob']
    }],
    'n/no-extraneous-import': ['error', {
      'allowModules': ['sass']
    }],
    // Allow unpublished imports
    'n/no-unpublished-import': 'off',
    // Allow 'package'
    'n/no-missing-require': ['error', {
      'allowModules': ['package']
    }],
    'n/no-missing-import': ['error', {
      'allowModules': ['package']
    }]
  },
  languageOptions: {
    globals: {
      ...globals.node
    }
  }
}];
