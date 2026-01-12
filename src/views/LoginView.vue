<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/lib/api'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const route = useRoute()
const router = useRouter()

async function login() {
  error.value = null
  loading.value = true

  try {
    const response = await api.post('/api/v1/login', {
      email: email.value,
      password: password.value,
    })

    // 🔐 Adjust this path if your JSON:API response is different
    const token =
      response.data?.data?.attributes?.token ??
      response.data?.meta?.token

    if (!token) {
      throw new Error('Token missing from response')
    }

    // Save token for auth guard + header
    localStorage.setItem('userToken', token)

    // Let header / other tabs react if needed
    window.dispatchEvent(new Event('storage'))

    // Optional: if ?redirect=/something is present, go there
    const redirect = (route.query.redirect as string) || '/'
    await router.push(redirect)
  } catch (e: any) {
    console.error(e)
    if (e?.errors?.[0]?.detail) {
      error.value = e.errors[0].detail
    } else {
      error.value = 'Login failed.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-[calc(100vh-4rem)] flex items-center justify-center">
    <div class="w-full max-w-md bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-4 text-center">
        Login
      </h1>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium" for="email">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-200"
            autocomplete="email"
            required
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium" for="password">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-200"
            autocomplete="current-password"
            required
          />
        </div>

        <p v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </p>

        <button
          type="submit"
          class="w-full py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? 'Logging in…' : 'Login' }}
        </button>
      </form>
    </div>
  </main>
</template>
