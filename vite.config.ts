import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  // Load env vars from .env, .env.development, .env.development.local, etc.
  const env = loadEnv(mode, process.cwd(), '')

  // Vite expects: true | string[] | undefined
  let allowedHosts: true | string[] | undefined = true

  if (env.BASE_URL) {
    try {
      const url = new URL(env.BASE_URL)
      // Provide as an array (even if only one host)
      allowedHosts = [url.hostname]
    } catch {
      // If it's not a valid URL, keep allowedHosts = true
    }
  }

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      allowedHosts,
    },
  }
})
