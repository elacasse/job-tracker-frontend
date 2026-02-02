<script setup lang="ts">
import {useProfileStore} from "@/modules/profile/store/profile.store.ts";
import {computed, onMounted, reactive, watch} from "vue";
import type {ProfileAttributes, ProfileFormModel} from "@/modules/profile/types/profile.types.ts";
import {RouterLink, useRouter} from "vue-router";
import ProfileForm from "../components/ProfileForm.vue";

const router = useRouter()

const store = useProfileStore()

onMounted(() => {
  void store.fetchProfile()
})

const profile = computed<ProfileAttributes | null>(() => store.attributes)
const hasProfile = computed(() => store.hasProfile)

const model = reactive<ProfileFormModel>({
  name: '',
  title: null,
  address: null,
  city: null,
  state: null,
  country: null,
  zip: null,
  phone: null,
  email: '',
});

watch(
    () => store.attributes,
    (cur: ProfileAttributes | null) => {
      if (!cur) return
      Object.assign(model, store.attributes)
    },
    {immediate: true}
);

function formToCreate(form: ProfileFormModel): ProfileAttributes {
  if (!form.name || !form.email) {
    throw new Error('Please fill all required fields.')
  }

  return {
    name: form.name,
    title: form.title ?? '',
    address: form.address ?? '',
    city: form.city ?? '',
    state: form.state ?? '',
    country: form.country ?? '',
    zip: form.zip ?? '',
    phone: form.phone ?? '',
    email: form.email,
    createdAt: profile.value?.createdAt ?? '',
    updatedAt: profile.value?.updatedAt ?? '',
  }
}

async function submit() {
  const form = formToCreate(model);
  const updated = await store.update(form)
  if (updated) {
    await router.push({ name: 'profile.view' })
  }
}

function cancel() {
  void router.push({ name: 'profile.view' })
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 px-4 space-y-4">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold">Edit profile</h1>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
            :to="{ name: 'profile.view' }"
            class="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Back
        </RouterLink>
      </div>
    </div>

    <div v-if="store.loading" class="text-sm text-gray-600">Loading…</div>

    <div
        v-else-if="store.error"
        class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
    >
      {{ store.error }}
    </div>

    <div v-else-if="hasProfile" class="space-y-4">
      <ProfileForm
        v-model="model"
        @cancel="cancel"
        @submit="submit"
        :error="store.saveError"
        :isSaving="store.saveLoading"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
