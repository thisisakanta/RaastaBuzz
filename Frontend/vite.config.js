import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  define: {
    global: 'window', // Polyfill for global object used by sockjs-client
  },
  resolve: {
    // Ensure sockjs-client is resolved correctly
    alias: {
      'sockjs-client': 'sockjs-client/dist/sockjs.min.js', // Use the minified browser-compatible version
    },
  },
  optimizeDeps: {
    // Pre-bundle dependencies to avoid runtime issues
    include: ['sockjs-client', '@stomp/stompjs'],
  },
});