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
            entry: resolve(__dirname, 'forum.js'),
            name: 'TagTilesForum',
            fileName: 'forum',
            formats: ['iife'],
        },
        rollupOptions: {
            external: ['flarum/forum/app', 'flarum/common/extend', 'flarum/tags/components/TagsPage'],
            output: {
                globals: {
                    'flarum/forum/app': 'flarum.core.compat["forum/app"]',
                    'flarum/common/extend': 'flarum.core.compat["common/extend"]',
                    'flarum/tags/components/TagsPage': 'flarum.core.compat["tags/components/TagsPage"]',
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
