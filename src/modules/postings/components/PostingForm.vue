<script lang="ts" setup>
import {computed, reactive, watch} from 'vue'
import type {PostingAttributes, PostingStatus,} from '../types/postings.types'
import {
  formatEmploymentType,
  formatSource,
  formatStatus,
  formatWorkMode,
} from '../ui/postings.formatters'
import type {PostingFormModel} from '../types/postings.form'

type Props = {
  modelValue: PostingFormModel
  isSaving?: boolean
  error?: string | null
  submitLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  isSaving: false,
  error: null,
  submitLabel: 'Save',
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: PostingFormModel): void
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

// local copy so inputs stay responsive
const form = reactive<PostingFormModel>({...props.modelValue})

watch(
  () => props.modelValue,
  (v) => Object.assign(form, v),
  {deep: true}
)

watch(
  form,
  (v) => emit('update:modelValue', {...v}),
  {deep: true}
)

// Enumerations
const SOURCES: PostingAttributes['source'][] = [
  'LinkedIn',
  'Indeed',
  'Jobboom',
  'Jobillico',
  'JobBank',
  'Other',
]

const EMPLOYMENT_TYPES: PostingAttributes['employmentType'][] = [
  'full_time',
  'part_time',
  'contract',
  'internship',
  'temporary',
]

const WORK_MODES: PostingAttributes['workMode'][] = ['in_office', 'remote', 'hybrid']

const STATUSES: PostingStatus[] = [
  'new',
  'postulated',
  'interview_scheduled',
  'interview_dropped',
  'interview_rejected',
  'rejected',
  'dropped',
  'job_accepted',
  'job_refused',
]

const canSubmit = computed(() => {
  // Minimal client-side validation; server remains source of truth
  return (
    form.company.trim().length > 0 &&
    form.title.trim().length > 0 &&
    form.url.trim().length > 0 &&
    form.sourceId.trim().length > 0
  )
})

function onSubmit() {
  if (!canSubmit.value || props.isSaving) return
  emit('submit')
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div
      v-if="error"
      class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
    >
      {{ error }}
    </div>

    <div class="rounded-lg border border-gray-200 p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Company</div>
          <input
            v-model="form.company"
            autocomplete="organization"
            class="w-full rounded-md border border-gray-300 p-2"
            type="text"
          />
        </label>

        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Title</div>
          <input
            v-model="form.title"
            autocomplete="off"
            class="w-full rounded-md border border-gray-300 p-2"
            type="text"
          />
        </label>
      </div>

      <label class="space-y-1">
        <div class="text-sm font-medium text-gray-700">URL</div>
        <input
          v-model="form.url"
          class="w-full rounded-md border border-gray-300 p-2"
          placeholder="https://…"
          type="url"
        />
      </label>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Source</div>
          <select v-model="form.source" class="w-full rounded-md border border-gray-300 p-2">
            <option :value="null" disabled>— Select —</option>
            <option v-for="s in SOURCES" :key="s" :value="s">
              {{ formatSource(s) }}
            </option>
          </select>
        </label>

        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Source ID</div>
          <input
            v-model="form.sourceId"
            class="w-full rounded-md border border-gray-300 p-2"
            placeholder="e.g. IND-81984611"
            type="text"
          />
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Employment type</div>
          <select
            v-model="form.employmentType"
            class="w-full rounded-md border border-gray-300 p-2"
          >
            <option :value="null" disabled>— Select —</option>
            <option v-for="t in EMPLOYMENT_TYPES" :key="t" :value="t">
              {{ formatEmploymentType(t) }}
            </option>
          </select>
        </label>

        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Work mode</div>
          <select v-model="form.workMode" class="w-full rounded-md border border-gray-300 p-2">
            <option :value="null" disabled>— Select —</option>
            <option v-for="m in WORK_MODES" :key="m" :value="m">
              {{ formatWorkMode(m) }}
            </option>
          </select>
        </label>

        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Status</div>
          <select v-model="form.status" class="w-full rounded-md border border-gray-300 p-2">
            <option :value="null" disabled>— Select —</option>
            <option v-for="st in STATUSES" :key="st" :value="st">
              {{ formatStatus(st) }}
            </option>
          </select>
        </label>
      </div>
    </div>

    <div class="rounded-lg border border-gray-200 p-4 space-y-3">
      <label class="space-y-1">
        <div class="text-sm font-medium text-gray-700">Description</div>
        <textarea
          v-model="form.description"
          class="w-full rounded-md border border-gray-300 p-2"
          rows="8"
        />
      </label>

      <label class="space-y-1">
        <div class="text-sm font-medium text-gray-700">Cover letter</div>
        <textarea
          v-model="form.coverLetter"
          class="w-full rounded-md border border-gray-300 p-2"
          placeholder="Optional"
          rows="8"
        />
      </label>
    </div>

    <div class="flex items-center justify-end gap-2">
      <button
        :disabled="isSaving"
        class="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        type="button"
        @click="$emit('cancel')"
      >
        Cancel
      </button>

      <button
        :disabled="!canSubmit || isSaving"
        class="rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        type="submit"
      >
        {{ isSaving ? 'Saving…' : submitLabel }}
      </button>
    </div>
  </form>
</template>
