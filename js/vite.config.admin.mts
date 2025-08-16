import { defineConfig } from 'vite';
import { resolve } from 'path';
import oxlint from 'vite-plugin-oxlint';

export default defineConfig({
    plugins: [
        oxlint({
            includes: ['src/**/*.ts', 'src/**/*.tsx'],
            excludes: ['node_modules/**/*', 'dist/**/*'],
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'admin.js'),
            name: 'TagTilesAdmin',
            fileName: 'admin',
            formats: ['iife'],
        },
        rollupOptions: {
            external: ['flarum/admin/app'],
            output: {
                globals: {
                    'flarum/admin/app': 'flarum.core.compat["admin/app"]',
                },
            },
        },
        outDir: 'dist',
        emptyOutDir: false,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
});
