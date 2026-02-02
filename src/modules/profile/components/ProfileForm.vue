<script setup lang="ts">
import type {ProfileFormModel} from "@/modules/profile/types/profile.types.ts";
import {computed, reactive, watch} from "vue";

type Props = {
  modelValue: ProfileFormModel
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
  (e: 'update:modelValue', v: ProfileFormModel): void
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const form = reactive<ProfileFormModel>({...props.modelValue})

const canSubmit = computed(() => {
  // Minimal client-side validation; server remains source of truth
  return (
      form.name.trim().length > 0 &&
      form.email.trim().length > 0
  )
})
function onSubmit() {
  if (!canSubmit.value || props.isSaving) return
  emit('submit')
}

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
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Name</div>
          <input
              v-model="form.name"
              autocomplete="name"
              class="w-full rounded-md border border-gray-300 p-2"
              type="text"
          />
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
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

      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Address</div>
          <input
              v-model="form.address"
              autocomplete="address"
              class="w-full rounded-md border border-gray-300 p-2"
              type="text"
          />
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">City</div>
          <input
              v-model="form.city"
              autocomplete="off"
              class="w-full rounded-md border border-gray-300 p-2"
              type="text"
          />
        </label>

        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Province/State</div>
          <input
              v-model="form.state"
              autocomplete="state"
              class="w-full rounded-md border border-gray-300 p-2"
              type="text"
          />
        </label>

        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Country</div>
          <input
              v-model="form.country"
              autocomplete="country"
              class="w-full rounded-md border border-gray-300 p-2"
              type="text"
          />
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Postal/Zip Code</div>
          <input
              v-model="form.zip"
              autocomplete="zip"
              class="w-full rounded-md border border-gray-300 p-2"
              type="text"
          />
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Phone</div>
          <input
              v-model="form.phone"
              autocomplete="phone"
              class="w-full rounded-md border border-gray-300 p-2"
              type="text"
          />
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <label class="space-y-1">
          <div class="text-sm font-medium text-gray-700">Email</div>
          <input
              v-model="form.email"
              autocomplete="email"
              class="w-full rounded-md border border-gray-300 p-2"
              type="text"
          />
        </label>
      </div>
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

<style scoped>
</style>