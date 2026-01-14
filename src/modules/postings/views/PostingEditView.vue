<script lang="ts" setup>
import {computed, reactive, watch} from 'vue'
import {RouterLink, useRoute, useRouter} from 'vue-router'
import {usePostingsStore} from '../store/postings.store'
import PostingForm from '../components/PostingForm.vue'
import type {PostingFormModel} from '../types/postings.form'
import {formToCreate, postingToForm} from '../types/postings.form'
import type {PostingResource} from "@/modules/postings/types/postings.types.ts";
import {storeToRefs} from "pinia";

const route = useRoute()
const router = useRouter()
const store = usePostingsStore()
const { current } = storeToRefs(store)

const id = computed(() => String(route.params.id ?? ''))

const model = reactive<PostingFormModel>({
  source: null,
  employmentType: null,
  workMode: null,
  status: null,
  sourceId: '',
  url: '',
  company: '',
  title: '',
  description: '',
  coverLetter: null,
})

watch(
  id,
  (newId) => {
    if (newId) void store.fetchOne(newId)
  },
  {immediate: true}
)

watch(
  () => store.current,
  (cur: PostingResource | null) => {
    if (!cur) return
    Object.assign(model, postingToForm(cur.attributes))
  },
  {immediate: true}
)

async function submit() {
  const attrs = formToCreate(model) // same shape as create; we send full payload on update
  const updated = await store.update(id.value, attrs)
  if (updated) {
    await router.push({name: 'postings.show', params: {id: updated.id}})
  }
}

function cancel() {
  if (!store.current) return
  void router.push({name: 'postings.show', params: {id: current?.id}})
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 px-4 space-y-4">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold">Edit posting</h1>
        <div class="text-sm text-gray-600">
          ID: <span class="font-mono">{{ id }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
          :to="{ name: 'postings.show', params: { id } }"
          class="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Back
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

    <div v-else class="space-y-3">
      <PostingForm v-model="model" @cancel="cancel" @submit="submit"/>
    </div>
  </div>
</template>
