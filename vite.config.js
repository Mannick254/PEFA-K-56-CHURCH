import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';
import javascriptObfuscator from 'rollup-plugin-javascript-obfuscator';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    svgr({ exportAs: 'ReactComponent' }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'apple-touch-icon.png'
      ],
      manifest: {
        name: 'PEFA Kawangware 56 Church',
        short_name: 'PEFA 56',
        description: 'PEFA Kawangware 56 Church website. Join our community for transformative sermons, worship, and fellowship.',
        theme_color: '#ffffff',
        background_color: '#004a99',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Sermons',
            short_name: 'Sermons',
            description: 'Listen to the latest sermons',
            url: '/sermons',
            icons: [{ src: 'https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png', sizes: '192x192' }]
          },
          {
            name: 'Events',
            short_name: 'Events',
            description: 'View upcoming church events',
            url: '/events',
            icons: [{ src: 'https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png', sizes: '192x192' }]
          },
          {
            name: 'Prayers',
            short_name: 'Prayers',
            description: 'Post and view prayer requests',
            url: '/prayers',
            icons: [{ src: 'https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png', sizes: '192x192' }]
          },
          {
            name: 'Contact Us',
            short_name: 'Contact',
            description: 'Get in touch with the church',
            url: '/contact',
            icons: [{ src: 'https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/beta\.ourmanna\.com\/api\/v1\/get/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'verse-of-the-day-api',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 24 * 60 * 60 // 1 day
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/bible-api\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'bible-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },
    }),
    process.env.NODE_ENV === 'production' && javascriptObfuscator({
      options: {
        // Obfuscator options here
      }
    }),
    // Optional: bundle analyzer
    visualizer({ filename: 'stats.html', template: 'treemap' })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    cors: true, 
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      external: ['puppeteer', 'puppeteer-core', 'cosmiconfig'], // ✅ exclude Node-only libs
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
          charting: ['chart.js', 'react-chartjs-2'],
          pdf: ['jspdf', 'jspdf-autotable'],
          vendor: [] // small utilities grouped
        }
      },
    },
  },
});