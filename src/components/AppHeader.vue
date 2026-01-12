<script setup lang="ts">
import { ref, computed } from 'vue'
import RightSidebar from '@/components/RightSidebar.vue'

const sidebarOpen = ref(false)

function openSidebar() {
  sidebarOpen.value = true
}
function closeSidebar() {
  sidebarOpen.value = false
}

const userToken = ref(localStorage.getItem('userToken'))

// Computed boolean
const isAuthenticated = computed(() => !!userToken.value)

// Watch for login/logout (custom events or localStorage changes)
window.addEventListener('storage', () => {
  userToken.value = localStorage.getItem('userToken')
})

function logout() {
  localStorage.removeItem('userToken')
  window.dispatchEvent(new Event('storage'))
  window.location.href = '/login'
}
</script>

<template>
  <header class="fixed left-0 right-0 top-0 z-30 border-b bg-white">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <div class="text-lg font-semibold text-gray-900">
        Job Tracker
      </div>

      <!-- Hamburger -->
      <button
        v-if="isAuthenticated"
        type="button"
        class="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        @click="openSidebar"
        aria-label="Open menu"
        :aria-expanded="sidebarOpen"
      >
        <!-- Hamburger icon -->
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </header>

  <!-- Sidebar -->
  <RightSidebar v-model="sidebarOpen" title="Navigation" v-if="isAuthenticated">
    <ul class="space-y-1">
      <li>
        <RouterLink
          to="/"
          class="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          @click="closeSidebar"
        >
          Dashboard
        </RouterLink>
      </li>

      <li>
        <RouterLink
          to="/resume"
          class="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          @click="closeSidebar"
        >
          Resume
        </RouterLink>
      </li>

      <li>
        <RouterLink
          to="/postings"
          class="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          @click="closeSidebar"
        >
          Postings
        </RouterLink>
      </li>

      <li>
        <a
          href="#"
          @click="logout"
          class="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Logout
        </a>
      </li>
    </ul>
  </RightSidebar>
</template>
