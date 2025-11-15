import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Proxy API requests during development to the backend server
  server: {
    proxy: {
      // Forward /api requests to the Express server running on port 5000
      '/api': 'http://localhost:5000'
    }
  }
})
