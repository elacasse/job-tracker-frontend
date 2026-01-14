<script lang="ts" setup>
import {onMounted, reactive, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {usePostingsStore} from '../store/postings.store'
import PostingTable from '../components/PostingTable.vue'
import {buildPostingsQuery, parsePostingsQuery} from '../routing/postings.query'
import type {PostingsListFilters} from '../api/postings.api'

const store = usePostingsStore()
const route = useRoute()
const router = useRouter()

// local, editable filter model for the form
const form = reactive<PostingsListFilters>({
  company: undefined,
  title: undefined,
  employmentType: undefined,
  source: undefined,
  workMode: undefined,
  status: undefined,
})

async function applyRouteToStore() {
  const q = parsePostingsQuery(route.query)

  // Keep form in sync with URL so refresh/back works visually
  Object.assign(form, q.filters)

  await store.syncFromRoute(q)
}

function setUrl(partial: Partial<{
  page: number
  size: number
  sort: string | null
  filters: PostingsListFilters
}>, mode: 'push' | 'replace' = 'push') {
  const current = parsePostingsQuery(route.query)

  const next = {
    page: partial.page ?? current.page,
    size: partial.size ?? current.size,
    sort: partial.sort !== undefined ? partial.sort : current.sort,
    filters: partial.filters !== undefined ? partial.filters : current.filters,
  }

  const nav = {query: buildPostingsQuery(next)}
  return mode === 'replace' ? router.replace(nav) : router.push(nav)
}

// Initial load: if URL has nothing, we still fetch page=1 size=25 sort=null
onMounted(() => {
  void applyRouteToStore()
})

// Back/forward / manual URL edits
watch(
  () => route.query,
  () => {
    void applyRouteToStore()
  },
  {deep: true}
)

// Sorting: update URL, reset page
function onSort(field: string) {
  const current = parsePostingsQuery(route.query)
  const asc = field
  const desc = `-${field}`

  let nextSort = asc
  if (current.sort === asc) nextSort = desc
  else if (current.sort === desc) nextSort = asc

  // Sorting resets page; use replace to avoid spamming history for sort clicks
  void setUrl({sort: nextSort, page: 1}, 'replace')
}

// Pagination buttons: push so back/forward navigates pages
function onPrev() {
  const current = parsePostingsQuery(route.query)
  void setUrl({page: Math.max(1, current.page - 1)}, 'push')
}

function onNext() {
  const current = parsePostingsQuery(route.query)
  void setUrl({page: current.page + 1}, 'push')
}

function onPageSize(size: number) {
  // Page size resets page; replace is generally nicer UX
  void setUrl({size, page: 1}, 'replace')
}

// Debounced text search -> URL update
let t: number | undefined

function onTextFilterChange() {
  if (t) window.clearTimeout(t)
  t = window.setTimeout(() => {
    void setUrl({filters: {company: form.company, title: form.title}, page: 1}, 'replace')
  }, 300)
}

// Select filters -> URL update immediately
function onSelectFiltersChange() {
  void setUrl(
    {
      filters: {
        employmentType: form.employmentType,
        source: form.source,
        workMode: form.workMode,
        status: form.status,
      },
      page: 1,
    },
    'replace'
  )
}

function clearFilters() {
  Object.assign(form, {
    company: undefined,
    title: undefined,
    employmentType: undefined,
    source: undefined,
    workMode: undefined,
    status: undefined,
  })

  // Clear URL filters + reset to page 1 (table reload happens via route watcher)
  void setUrl({filters: {}, page: 1}, 'replace')
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 px-4 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Postings</h1>

      <div class="flex items-center gap-3">
        <label class="text-sm text-gray-700">
          Page size
          <select
            :value="store.pageSize"
            class="ml-2 rounded-md border border-gray-300 p-1"
            @change="onPageSize(Number(($event.target as HTMLSelectElement).value))"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </label>

        <RouterLink
          :to="{ name: 'postings.create' }"
          class="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          New posting
        </RouterLink>
      </div>
    </div>

    <div v-if="store.isLoading" class="text-sm text-gray-600">Loading…</div>

    <div
      v-else-if="store.error"
      class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
    >
      {{ store.error }}
    </div>

    <div v-else class="space-y-3">
      <div class="rounded-lg border border-gray-200 p-3 space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label class="text-sm text-gray-700">
            Company
            <input
              v-model="form.company"
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Search company…"
              type="text"
              @input="onTextFilterChange"
            />
          </label>

          <label class="text-sm text-gray-700">
            Title
            <input
              v-model="form.title"
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Search title…"
              type="text"
              @input="onTextFilterChange"
            />
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
          <label class="text-sm text-gray-700">
            Employment type
            <select
              v-model="form.employmentType"
              class="mt-1 w-full rounded-md border border-gray-300 p-2"
              @change="onSelectFiltersChange"
            >
              <option :value="undefined">Any</option>
              <option value="full_time">Full time</option>
              <option value="part_time">Part time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="temporary">Temporary</option>
            </select>
          </label>

          <label class="text-sm text-gray-700">
            Source
            <select
              v-model="form.source"
              class="mt-1 w-full rounded-md border border-gray-300 p-2"
              @change="onSelectFiltersChange"
            >
              <option :value="undefined">Any</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Indeed">Indeed</option>
              <option value="Jobboom">Jobboom</option>
              <option value="Jobillico">Jobillico</option>
              <option value="JobBank">JobBank</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label class="text-sm text-gray-700">
            Work mode
            <select
              v-model="form.workMode"
              class="mt-1 w-full rounded-md border border-gray-300 p-2"
              @change="onSelectFiltersChange"
            >
              <option :value="undefined">Any</option>
              <option value="in_office">In office</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>

          <label class="text-sm text-gray-700">
            Status
            <select
              v-model="form.status"
              class="mt-1 w-full rounded-md border border-gray-300 p-2"
              @change="onSelectFiltersChange"
            >
              <option :value="undefined">Any</option>
              <option value="new">New</option>
              <option value="postulated">Postulated</option>
              <option value="interview_scheduled">Interview scheduled</option>
              <option value="interview_dropped">Interview dropped</option>
              <option value="interview_rejected">Interview rejected</option>
              <option value="rejected">Rejected</option>
              <option value="dropped">Dropped</option>
              <option value="job_accepted">Job accepted</option>
              <option value="job_refused">Job refused</option>
            </select>
          </label>

          <div class="flex items-end">
            <button
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
              type="button"
              @click="clearFilters"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      <PostingTable
        :items="store.items"
        :sort="store.sort"
        @sort="onSort"
      />

      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Page {{ store.pageNumber }}
        </div>

        <div class="flex items-center gap-2">
          <button
            :disabled="!store.hasPrev || store.isLoading"
            class="rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
            type="button"
            @click="onPrev"
          >
            Previous
          </button>

          <button
            :disabled="!store.hasNext || store.isLoading"
            class="rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
            type="button"
            @click="onNext"
          >
            Next
          </button>

          <div v-if="store.page">{{ store.rangeLabel }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
