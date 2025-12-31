<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="pt-16">
      <RouterView />
    </main>
  </div>
</template>
