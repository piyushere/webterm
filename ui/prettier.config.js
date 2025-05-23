/** @type {import("prettier").Config} */
const config = {
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    plugins: ['prettier-plugin-svelte'],
};

export default config;
