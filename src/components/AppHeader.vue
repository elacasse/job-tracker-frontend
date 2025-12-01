<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'

// --- auth state ---
// You can later replace this with Pinia, but this works perfectly for now.
const userToken = ref(localStorage.getItem('userToken'))

// Computed boolean
const isAuthenticated = computed(() => !!userToken.value)

// Watch for login/logout (custom events or localStorage changes)
window.addEventListener('storage', () => {
  userToken.value = localStorage.getItem('userToken')
})

const route = useRoute()

const links = [
  { name: 'Dashboard', to: '/dashboard' },
]

// Simple helper to style the active link
const isActive = (path: string) => route.path === path

function logout() {
  localStorage.removeItem('userToken')
  window.dispatchEvent(new Event('storage'))
  window.location.href = '/login'
}
</script>

<template>
  <header class="fixed top-0 inset-x-0 border-b px-4 py-2 flex justify-between items-center bg-white shadow z-30">
    <h1 class="font-bold text-lg">
      Job Tracker
    </h1>

    <nav v-if="isAuthenticated" class="space-x-4">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="text-sm font-medium"
        :class="[
          isActive(link.to)
            ? 'text-blue-600 underline'
            : 'text-gray-600 hover:text-blue-600'
        ]"
      >
        {{ link.name }}
      </RouterLink>

      <button
        v-if="isAuthenticated"
        @click="logout"
        class="text-sm font-medium text-red-600 hover:text-red-700"
      >
        Logout
      </button>
    </nav>
  </header>
</template>
