import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Plant Buddy - AI IoT Companion',
        short_name: 'Plant Buddy',
        description: 'Intelligent Plant Monitoring and IoT Companion',
        theme_color: '#10b981',
        background_color: '#042f2e',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/plant-icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
