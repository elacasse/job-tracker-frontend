<script lang="ts" setup>
import type {PostingResource} from '../types/postings.types'
import {usePostingFormatters} from '../composables/usePostingFormatters'
import type {PostingSortField} from '../types/postings.sort'
import {formatDate} from '@/ui/formatters/date'

const props = defineProps<{
  items: PostingResource[]
  sort: string | null
}>()

const {sourceLabel, employmentTypeLabel, workModeLabel, statusLabel} = usePostingFormatters()

const emit = defineEmits<{
  (e: 'sort', field: PostingSortField): void
}>()

function indicator(field: string): string {
  if (props.sort === field) return ' ▲'
  if (props.sort === `-${field}`) return ' ▼'
  return ''
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="min-w-full divide-y divide-gray-200 text-sm">
      <thead class="bg-gray-50">
      <tr>
        <th class="px-4 py-3 text-left font-medium text-gray-700">
          <button
            class="hover:opacity-80"
            type="button"
            @click="emit('sort', 'company')"
          >
            Company{{ indicator('company') }}
          </button>
        </th>

        <th class="px-4 py-3 text-left font-medium text-gray-700">
          <button
            class="hover:opacity-80"
            type="button"
            @click="emit('sort', 'title')"
          >
            Title{{ indicator('title') }}
          </button>
        </th>

        <th class="px-4 py-3 text-left font-medium text-gray-700 whitespace-nowrap">
          <button
            class="hover:opacity-80"
            type="button"
            @click="emit('sort', 'employmentType')"
          >
            Employment Type{{ indicator('employmentType') }}
          </button>
        </th>

        <th class="px-4 py-3 text-left font-medium text-gray-700">
          <button
            class="hover:opacity-80"
            type="button"
            @click="emit('sort', 'source')"
          >
            Source{{ indicator('source') }}
          </button>
        </th>

        <th class="px-4 py-3 text-left font-medium text-gray-700">
          <button
            class="hover:opacity-80"
            type="button"
            @click="emit('sort', 'workMode')"
          >
            Work mode{{ indicator('workMode') }}
          </button>
        </th>

        <th class="px-4 py-3 text-left font-medium text-gray-700">
          <button
            class="hover:opacity-80"
            type="button"
            @click="emit('sort', 'status')"
          >
            Status{{ indicator('status') }}
          </button>
        </th>

        <th class="px-4 py-3 text-left font-medium text-gray-700">
          <button
            class="hover:opacity-80"
            type="button"
            @click="emit('sort', 'createdAt')"
          >
            Created{{ indicator('createdAt') }}
          </button>
        </th>

        <th class="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
      </tr>
      </thead>

      <tbody class="divide-y divide-gray-200 bg-white">
      <tr v-for="p in items" :key="p.id" class="hover:bg-gray-50">
        <td class="px-4 py-3 font-medium text-gray-900">
          {{ p.attributes.company }}
        </td>
        <td class="px-4 py-3 text-gray-900">
          {{ p.attributes.title }}
        </td>
        <td class="px-4 py-3 text-gray-900">
          {{ employmentTypeLabel(p.attributes.employmentType) }}
        </td>
        <td class="px-4 py-3 text-gray-700">
          {{ sourceLabel(p.attributes.source) }}
          <div class="text-xs text-gray-500 whitespace-nowrap">{{ p.attributes.sourceId }}</div>
        </td>
        <td class="px-4 py-3 text-gray-700">
          {{ workModeLabel(p.attributes.workMode) }}
        </td>
        <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
          {{ statusLabel(p.attributes.status) }}
        </td>
        <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
          {{ formatDate(p.attributes.createdAt) }}
        </td>
        <td class="px-4 py-3 text-right">
          <div class="inline-flex items-center gap-3">
            <RouterLink
              :to="{ name: 'postings.show', params: { id: p.id } }"
              class="underline underline-offset-2 hover:opacity-80"
            >
              View
            </RouterLink>
            <RouterLink
              :to="{ name: 'postings.edit', params: { id: p.id } }"
              class="underline underline-offset-2 hover:opacity-80"
            >
              Edit
            </RouterLink>
            <a
              :href="p.attributes.url"
              class="underline underline-offset-2 hover:opacity-80"
              rel="noreferrer"
              target="_blank"
            >
              Open
            </a>
          </div>
        </td>
      </tr>

      <tr v-if="items.length === 0">
        <td class="px-4 py-6 text-center text-gray-600" colspan="7">
          No postings found.
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
