import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        passport: resolve(__dirname, 'p.html'),
        app: resolve(__dirname, 'app.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        imprint: resolve(__dirname, 'imprint.html'),
        cookies: resolve(__dirname, 'cookies.html'),
        compliance: resolve(__dirname, 'compliance-statement.html'),
        security: resolve(__dirname, 'security.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/qrcode')) {
            return 'vendor-qrcode';
          }
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: true
  }
});
