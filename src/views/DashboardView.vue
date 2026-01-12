<template>
  <div class="p-8 text-center">
    <h1 class="text-4xl font-bold mb-4">Dashboard</h1>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <RouterLink
          v-for="tile in tiles"
          :key="tile.name"
          :to="tile.to"
          class="group"
        >
          <div
            class="h-36 rounded-xl border border-gray-200 bg-white shadow-sm
                 flex flex-col items-center justify-center
                 transition-all duration-200
                 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-500"
          >
            <component
              :is="tile.icon"
              class="h-8 w-8 text-gray-400 mb-3 group-hover:text-indigo-600"
            />

            <span class="text-sm font-semibold text-gray-700 group-hover:text-indigo-600">
            {{ tile.label }}
          </span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BriefcaseIcon, UserIcon } from '@heroicons/vue/24/outline'

const tiles = [
  { name: 'postings', label: 'Postings', to: '/postings', icon: BriefcaseIcon },
  { name: 'resume', label: 'Resume', to: '/resume', icon: UserIcon },
]
</script>
