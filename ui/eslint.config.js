import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import pluginSvelte from 'eslint-plugin-svelte';
import parserSvelte from 'svelte-eslint-parser';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

const config = [
    // eslint:recommended
    eslint.configs.recommended,
    // typescript-eslint parser and options
    ...tsEslint.configs.recommended,
    // this enables both: eslint-config-prettier and eslint-plugin-prettier
    eslintPluginPrettierRecommended,
    // this disables prettier's conflicting rules with svelte
    ...pluginSvelte.configs.prettier,
    {
        files: ['**/*.svelte'],
        languageOptions: {
            // parser for .svelte files
            parser: parserSvelte,
            parserOptions: {
                // typescript support in the <script> tag
                parser: tsEslint.parser,
                svelteConfig,
            },
            // browser globals like window and document
            globals: {
                ...globals.browser,
            },
        },
    },
    {
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            // 'no-use-before-define': 'off',
            // 'import/no-extraneous-dependencies': 'off',
        },
    },
];

export default config;
