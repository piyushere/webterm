// eslint.config.js
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginImport from 'eslint-plugin-import';

export default tseslint.config(
  // TypeScript ESLint provides recommended configuration with proper language options
  ...tseslint.configs.recommended,
  // Configure prettier plugin and add config
  eslintPluginPrettierRecommended,
  {
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      'prettier/prettier': 'error',
      'import/no-extraneous-dependencies': 'off',
      'no-shadow': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-use-before-define': 'off',
    },
    settings: {
      'import/resolver': {
        node: true,
      },
    },
  }
);
