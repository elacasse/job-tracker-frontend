<script lang="ts" setup>
import {reactive} from 'vue'
import {RouterLink, useRouter} from 'vue-router'
import PostingForm from '../components/PostingForm.vue'
import type {PostingFormModel} from '../types/postings.form'
import type {PostingCreateAttributes} from '../types/postings.types'
import {usePostingsStore} from '../store/postings.store'

const router = useRouter()
const store = usePostingsStore()

// Defaults for a new record
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

function toApi(model: PostingFormModel): PostingCreateAttributes {
  if (!model.source || !model.employmentType || !model.workMode || !model.status) {
    throw new Error('Please complete all required dropdown fields.')
  }

  return {
    source: model.source,
    employmentType: model.employmentType,
    workMode: model.workMode,
    status: model.status,
    sourceId: model.sourceId,
    url: model.url,
    company: model.company,
    title: model.title,
    description: model.description,
    coverLetter: model.coverLetter,
  }
}

async function submit() {
  try {
    const apiPayload = toApi(model)
    const created = await store.create(apiPayload)
    if (created) await router.push({name: 'postings.show', params: {id: created.id}})
  } catch (e) {
    alert((e as Error).message)
  }
}

function cancel() {
  void router.push({name: 'postings.list'})
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 px-4 space-y-4">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold">New posting</h1>
        <div class="text-sm text-gray-600">Create a new job posting entry.</div>
      </div>

      <RouterLink
        :to="{ name: 'postings.list' }"
        class="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
      >
        Back
      </RouterLink>
    </div>

    <PostingForm
      v-model="model"
      :error="store.saveError"
      :isSaving="store.saveLoading"
      submitLabel="Create"
      @cancel="cancel"
      @submit="submit"
    />
  </div>
</template>
