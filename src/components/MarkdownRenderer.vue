<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps<{
  content: string
}>()

const html = computed(() => {
  const raw = marked.parse(props.content ?? '') as string
  console.log(raw)
  return DOMPurify.sanitize(raw)
})
</script>

<template>
  <div
    class="prose prose-sm sm:prose-base max-w-none"
    v-html="html"
  />
</template>
