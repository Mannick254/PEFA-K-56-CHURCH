import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';
import javascriptObfuscator from 'rollup-plugin-javascript-obfuscator';
import { visualizer } from 'rollup-plugin-visualizer';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// Helper to inject Cloudinary auto-resizing flags to match PWA Manifest expectations
const getCloudinaryIcon = (width, height) => 
  `https://res.cloudinary.com/dtcb3ffnv/image/upload/c_fill,w_${width},h_${height},f_png/v1780723691/Untitled-design-24-_lfef05.png`;

export default defineConfig({
  plugins: [
    react(),
    svgr({ exportAs: 'ReactComponent' }),
    ViteImageOptimizer({
      /* config */
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'apple-touch-icon.png'
      ],
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
        // Obfuscator options
      }
    }),
    visualizer({ filename: 'stats.html', template: 'treemap' }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        lyrics_studio: resolve(__dirname, 'public/lyrics-studio.html'),
      },
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
          charting: ['chart.js', 'react-chartjs-2'],
          pdf: ['jspdf', 'jspdf-autotable'],
          vendor: []
        }
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    }
  }
});