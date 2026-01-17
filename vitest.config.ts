import { fileURLToPath, URL } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'
import { mergeConfig, type UserConfig, type ConfigEnv } from 'vite'
import viteConfigExport from './vite.config'

async function resolveViteConfig(): Promise<UserConfig> {
  const env: ConfigEnv = { mode: 'test', command: 'serve' }

  // vite config export can be: UserConfig | (env)=>UserConfig | Promise<...>
  const maybeConfig =
    typeof viteConfigExport === 'function'
      ? (viteConfigExport as (env: ConfigEnv) => UserConfig | Promise<UserConfig>)(env)
      : viteConfigExport

  // Normalize Promise | non-Promise into a concrete object
  return (await maybeConfig) as UserConfig
}

export default defineConfig(async () => {
  const viteConfig = await resolveViteConfig()

  return mergeConfig(
    viteConfig,
    {
      test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url)),
      },
    },
  )
})
