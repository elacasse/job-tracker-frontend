import {defineStore} from 'pinia'
import {getProfile, updateProfile} from "@/modules/profile/api/profile.api.ts";
import type {ProfileAttributes, ProfileResource} from '@/modules/profile/types/profile.types'
import {toMessage} from '@/stores/common.store.ts'
import {createEmptyProfileResource} from "@/modules/profile/types/profile.types";

type State = {
  profile: ProfileResource
  loading: boolean
  error: string | null
  saveLoading: boolean
  saveError: string | null
}

export const useProfileStore = defineStore('users', {

  state: (): State => ({
    profile: createEmptyProfileResource(),
    loading: false,
    error: null,

    saveLoading: false,
    saveError: null,
  }),

  getters: {
    attributes(state): ProfileAttributes | null {
      return state.profile?.attributes ?? null
    },

    hasProfile(): boolean {
      return this.profile.id !== ''
    },
  },

  actions: {
    async fetchProfile() {
      this.loading = true
      this.error = null

      try {
        const res = await getProfile()
        this.profile = res.data
        return this.profile
      } catch (e) {
        this.profile = createEmptyProfileResource()
        this.error = toMessage(e)
        return null
      } finally {
        this.loading = false
      }
    },

    async update(attrs: ProfileAttributes) {
      this.saveLoading = true
      this.saveError = null

      try {
        const res = await updateProfile(this.profile.id, attrs)
        this.profile = res.data
        return this.profile
      } catch (e) {
        this.saveError = toMessage(e)
        return null
      } finally {
        this.saveLoading = false
      }
    },
  },
})