import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  server: {
    host: true,                  // allow external access (Docker)
    port: 5173,                  // Vite dev port
    strictPort: true,            // don't switch ports
    allowedHosts: [
      import.meta.env.VITE_BASE_URL,        // 👈 REQUIRED
    ],
  },
})
