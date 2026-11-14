import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import sonarjs from 'eslint-plugin-sonarjs';
import security from 'eslint-plugin-security';
import turbo from 'eslint-config-turbo/flat';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig(
  {
    ignores: ['**/node_modules/', '**/dist/', '**/.nuxt/', '**/.output/', '**/.turbo/', '**/.data/']
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  pluginVue.configs['flat/strongly-recommended'],
  sonarjs.configs.recommended,
  security.configs.recommended,
  turbo,
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      // TypeScript already checks undefined names, and Nuxt auto-imports would trip this rule
      'no-undef': 'off'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser }
    }
  },
  {
    files: ['apps/api/**'],
    languageOptions: { globals: globals.node },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: ['apps/web/**'],
    languageOptions: { globals: globals.browser },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off'
    }
  },
  // Keep last: turns off the rules that conflict with Prettier
  prettier
);
