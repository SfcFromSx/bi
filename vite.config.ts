import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import apiPlugin from './vite-api-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    host: '0.0.0.0', // Allow access from other devices on the network
    allowedHosts: true, // Allow ngrok/cpolar tunneling (Vite 5.1+)
  },
})
