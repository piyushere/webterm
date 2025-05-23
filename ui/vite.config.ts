import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import viteCompression from 'vite-plugin-compression';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte(), tailwindcss(), viteCompression(), tsconfigPaths()],
    base: `/${process.env.BASE_PATH || ''}`,
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3002',
                changeOrigin: true,
            },
            '/api/machines/ws': {
                target: 'ws://localhost:3002',
                ws: true,
                changeOrigin: true,
                rewrite: (path) => path.replace('/ws', ''),
            },
        },
    },
});
