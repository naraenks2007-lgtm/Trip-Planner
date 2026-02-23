import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // All /api/* requests are proxied to the Flask backend.
      // The Vite dev server runs inside Docker and CAN reach 'backend:5000'.
      // The browser just talks to localhost:5173 — it never needs the Docker hostname.
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
