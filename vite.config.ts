import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  // Load env vars from .env, .env.development, .env.development.local, etc.
  const env = loadEnv(mode, process.cwd(), '')

  // If VITE_BASE_URL is like "http://job-tracker.test"
  // extract just the hostname for allowedHosts
  let allowedHost: string | true = true

  if (env.VITE_BASE_URL) {
    try {
      const url = new URL(env.VITE_BASE_URL)
      allowedHost = url.hostname // e.g. "job-tracker.test"
    } catch {
      // If it's not a valid URL, ignore and keep allowedHost = true
    }
  }

  return {
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
      host: true,
      port: 5173,
      strictPort: true,
      allowedHosts: allowedHost,
    },
  }
})
