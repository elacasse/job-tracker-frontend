<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function close() {
  emit('update:modelValue', false)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// Optional: prevent body scroll while open
watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  },
  { immediate: true }
)
</script>

<template>
  <!-- Backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 z-40 bg-black/40"
      @click="close"
      aria-hidden="true"
    />
  </Transition>

  <!-- Panel -->
  <Transition
    enter-active-class="transition-transform duration-200"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside
      v-if="modelValue"
      class="fixed right-0 top-0 z-50 h-dvh w-80 max-w-[85vw] bg-white shadow-xl"
      role="dialog"
      aria-modal="true"
      :aria-label="title ?? 'Menu'"
      @click.stop
    >
      <div class="flex items-center justify-between border-b px-4 py-3">
        <h2 class="text-base font-semibold text-gray-900">
          {{ title ?? 'Menu' }}
        </h2>

        <button
          type="button"
          class="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @click="close"
          aria-label="Close menu"
        >
          <!-- X icon -->
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <nav class="px-2 py-3">
        <!-- Put your links here -->
        <slot />
      </nav>
    </aside>
  </Transition>
</template>
