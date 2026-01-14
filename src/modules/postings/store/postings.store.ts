import {defineStore} from 'pinia'
import type {PostingsListFilters} from '../api/postings.api'
import {createPosting, getPosting, listPostings, updatePosting} from '../api/postings.api'
import type {
  PostingAttributes,
  PostingCreateAttributes,
  PostingResource,
  PostingsListMeta,
  PostingUpdateAttributes
} from '../types/postings.types'
import type {PostingsRouteQuery} from '../routing/postings.query'

type JsonApiError = { title?: string; detail?: string }
type NormalizedApiError = { status?: number; errors?: JsonApiError[] }

type State = {
  items: PostingResource[]
  isLoading: boolean
  error: string | null

  pageNumber: number
  pageSize: number
  sort: string | null // raw JSON:API sort string, ex: "status" or "-status"

  filters: PostingsListFilters

  meta: PostingsListMeta | null

  current: PostingResource | null
  currentLoading: boolean
  currentError: string | null

  saveLoading: boolean
  saveError: string | null
}

function toMessage(e: unknown): string {
  if (typeof e === 'object' && e !== null) {
    const err = e as NormalizedApiError
    const first = err.errors?.[0]
    if (first?.detail) return first.detail
    if (first?.title) return first.title
    if (err.status) return `Request failed (HTTP ${err.status}).`
  }
  return e instanceof Error ? e.message : String(e)
}

export const usePostingsStore = defineStore('postings', {
  state: (): State => ({
    items: [],
    isLoading: false,
    error: null,

    pageNumber: 1,
    pageSize: 25,
    sort: null,
    filters: {},

    meta: null,

    current: null,
    currentLoading: false,
    currentError: null,

    saveLoading: false,
    saveError: null,
  }),

  getters: {
    page(state) {
      return state.meta?.page ?? null
    },
    hasPrev(): boolean {
      const p = this.page
      return !!p && p.currentPage > 1
    },
    hasNext(): boolean {
      const p = this.page
      return !!p && p.currentPage < p.lastPage
    },
    rangeLabel(): string {
      const p = this.page
      if (!p) return ''
      const from = p.from ?? 0
      const to = p.to ?? 0
      return `${from}–${to} of ${p.total}`
    },
    currentId(state): string {
      return state.current?.id ?? ''
    },
    currentAttributes(state): PostingAttributes | null {
      return state.current?.attributes ?? null
    },
  },

  actions: {
    async syncFromRoute(q: PostingsRouteQuery) {
      this.pageNumber = q.page
      this.pageSize = q.size
      this.sort = q.sort
      this.filters = q.filters

      await this.fetchList()
    },

    async fetchList() {
      this.isLoading = true
      this.error = null

      try {
        const res = await listPostings({
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          sort: this.sort ?? undefined,
          filters: this.filters,
        })

        this.items = res.data
        this.meta = res.meta ?? null

        // keep state aligned with server meta
        if (this.meta?.page) {
          this.pageNumber = this.meta.page.currentPage
          this.pageSize = this.meta.page.perPage
        }
      } catch (e) {
        this.error = toMessage(e)
      } finally {
        this.isLoading = false
      }
    },
    async fetchOne(id: string) {
      this.currentLoading = true
      this.currentError = null

      try {
        const res = await getPosting(id)
        this.current = res.data
      } catch (e) {
        this.currentError = toMessage(e)
        this.current = null
      } finally {
        this.currentLoading = false
      }
    },

    clearCurrent() {
      this.current = null
      this.currentError = null
    },

    async create(attrs: PostingCreateAttributes) {
      this.saveLoading = true
      this.saveError = null

      try {
        const res = await createPosting(attrs)
        // Optionally refresh list cache
        return res.data
      } catch (e) {
        this.saveError = toMessage(e)
        return null
      } finally {
        this.saveLoading = false
      }
    },

    async update(id: string, attrs: PostingUpdateAttributes) {
      this.saveLoading = true
      this.saveError = null

      try {
        const res = await updatePosting(id, attrs)
        // keep current in sync if we are viewing/editing it
        this.current = res.data
        return res.data
      } catch (e) {
        this.saveError = toMessage(e)
        return null
      } finally {
        this.saveLoading = false
      }
    },
  },
})
