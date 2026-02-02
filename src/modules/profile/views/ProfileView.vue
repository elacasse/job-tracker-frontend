<script setup lang="ts">
import {RouterLink} from "vue-router";
import { computed, onMounted } from 'vue'
import { useProfileStore } from '@/modules/profile/store/profile.store'
import type { ProfileAttributes } from '@/modules/profile/types/profile.types'
import {formatDate} from "@/ui/formatters/date.ts";

const store = useProfileStore()

onMounted(() => {
  void store.fetchProfile()
})

// PhpStorm-safe accessors
const profile = computed<ProfileAttributes | null>(() => store.attributes)
const hasProfile = computed(() => store.hasProfile)

// Individual fields (avoids property-chain warnings)
const name = computed(() => profile.value?.name ?? '')
const title = computed(() => profile.value?.title ?? '')

const address = computed(() => profile.value?.address ?? '')
const city = computed(() => profile.value?.city ?? '')
const state = computed(() => profile.value?.state ?? '')
const country = computed(() => profile.value?.country ?? '')
const zip = computed(() => profile.value?.zip ?? '')

const email = computed(() => profile.value?.email ?? '')
const phone = computed(() => profile.value?.phone ?? '')

const createdAt = computed(() => profile.value?.createdAt ?? '')
const updatedAt = computed(() => profile.value?.updatedAt ?? '')

// const currentId = computed(() => profile.value?.id ?? '')
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 px-4 space-y-4">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold">Profile</h1>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
            v-if="hasProfile"
            :to="{ name: 'profile.edit' }"
            class="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Edit
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
      <div class="rounded-lg border border-gray-200 p-4 space-y-2">
        <div class="text-lg font-semibold">
          {{ name }}
        </div>
        <div class="text-md text-gray-700">
          {{ title }}
        </div>

        <div class="text-md text-gray-700">
          <span v-if="address">{{ address }}<br /></span>
          <span v-if="city">{{ city }},&nbsp;</span>
          <span v-if="state">{{ state }},&nbsp;</span>
          <span v-if="country">{{ country }}</span><br v-if="city || state || country" />
          <span v-if="zip">{{ zip }}</span>
        </div>

        <div class="text-md text-gray-700">
          <span class="font-semibold">Phone : </span>
          <a :href="'tel:' + phone">{{ phone }}</a>
        </div>
        <div class="text-md text-gray-700">
          <span class="font-semibold">Email : </span>
          <a :href="'mailto:' + email">{{ email }}</a>
        </div>
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

<style scoped>
</style>
