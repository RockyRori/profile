import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    root: '.',
    srcDir: './src',
    publicDir: './public',
    outDir: './dist',
    cacheDir: './astro',
    redirects: {},
    site: 'https://rockyrori.github.io/profile',
    compressHTML: false,
    base: '/profile',
    trailingSlash: 'always',
    output: 'static',
    build: {
        format: 'directory',
        client: './client',
        server: './server',
        assets: '_astro',
        assetsPrefix: '/profile'
    },
    server: {
        port: 3003,
        host: true,
        open: true
    }
});
