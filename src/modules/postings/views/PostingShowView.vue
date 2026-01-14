<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted} from 'vue'
import {RouterLink, useRoute} from 'vue-router'
import {usePostingsStore} from '../store/postings.store'
import {formatDate} from '@/ui/formatters/date'
import { storeToRefs } from 'pinia'

// If you already have these label maps, reuse them:
import {
  formatEmploymentType,
  formatSource,
  formatStatus,
  formatWorkMode
} from '../ui/postings.formatters'
import type {PostingAttributes} from "@/modules/postings/types/postings.types.ts";

const route = useRoute()
const store = usePostingsStore()
const { current } = storeToRefs(store)

const id = computed(() => String(route.params.id ?? ''))

onMounted(() => {
  void store.fetchOne(id.value)
})

onBeforeUnmount(() => {
  store.clearCurrent()
})

const posting = computed<PostingAttributes | null>(() => current.value?.attributes ?? null)
const currentId = computed(() => current.value?.id ?? '')
const createdAt = computed(() => current.value?.attributes.createdAt ?? '')
const updatedAt = computed(() => current.value?.attributes.updatedAt ?? '')
// const hasCurrent = computed(() => current.value !== null)
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 px-4 space-y-4">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold">Posting</h1>
        <div v-if="posting" class="text-sm text-gray-600">
          ID: <span class="font-mono">{{ currentId }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
          :to="{ name: 'postings.list' }"
          class="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Back to list
        </RouterLink>

        <RouterLink
          v-if="posting"
          :to="{ name: 'postings.edit', params: { id: currentId } }"
          class="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Edit
        </RouterLink>
      </div>
    </div>

    <div v-if="store.currentLoading" class="text-sm text-gray-600">Loading…</div>

    <div
      v-else-if="store.currentError"
      class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
    >
      {{ store.currentError }}
    </div>

    <div v-else-if="posting" class="space-y-4">
      <div class="rounded-lg border border-gray-200 p-4 space-y-2">
        <div class="text-lg font-semibold">
          {{ posting.title }}
        </div>
        <div class="text-sm text-gray-700">
          {{ posting.company }}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          Source ID: <span class="font-mono">{{ posting.sourceId }}</span>
        </div>

        <div class="flex flex-wrap gap-2 pt-2 text-sm">
          <span class="rounded-full border border-gray-200 px-3 py-1">
            {{ formatSource(posting.source) }}
          </span>
          <span class="rounded-full border border-gray-200 px-3 py-1">
            {{ formatEmploymentType(posting.employmentType) }}
          </span>
          <span class="rounded-full border border-gray-200 px-3 py-1">
            {{ formatWorkMode(posting.workMode) }}
          </span>
          <span class="rounded-full border border-gray-200 px-3 py-1">
            {{ formatStatus(posting.status) }}
          </span>
        </div>

        <div class="pt-2">
          <a
            :href="posting.url"
            class="text-sm text-blue-700 underline break-all"
            rel="noreferrer"
            target="_blank"
          >
            {{ posting.url }}
          </a>
        </div>
      </div>

      <div class="rounded-lg border border-gray-200 p-4 space-y-2">
        <h2 class="font-semibold">Description</h2>
        <p class="text-sm text-gray-800 whitespace-pre-line">
          {{ posting.description }}
        </p>
      </div>

      <div v-if="posting.coverLetter" class="rounded-lg border border-gray-200 p-4 space-y-2">
        <h2 class="font-semibold">Cover letter</h2>
        <p class="text-sm text-gray-800 whitespace-pre-line">
          {{ posting.coverLetter }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
        <div class="rounded-lg border border-gray-200 p-4">
          <div class="font-medium">Created</div>
          <div class="mt-1 font-mono">{{ formatDate(createdAt) }}</div>
        </div>

        <div class="rounded-lg border border-gray-200 p-4">
          <div class="font-medium">Updated</div>
          <div class="mt-1 font-mono">{{ formatDate(updatedAt) }}</div>
        </div>
      </div>
    </div>

    <div v-else class="text-sm text-gray-700">
      Not found.
    </div>
  </div>
</template>
