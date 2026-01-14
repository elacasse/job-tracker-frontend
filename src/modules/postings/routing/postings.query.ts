import type {LocationQuery, LocationQueryRaw} from 'vue-router'
import type {PostingAttributes, PostingStatus} from '../types/postings.types'
import type {PostingsListFilters} from '../api/postings.api'

export type PostingsRouteQuery = {
  page: number
  size: number
  sort: string | null
  filters: PostingsListFilters
}

const DEFAULTS = {
  page: 1,
  size: 25,
  sort: null as string | null,
  filters: {} as PostingsListFilters,
}

function toInt(v: unknown): number | null {
  if (typeof v !== 'string' || v.trim() === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : null
}

function toStr(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const s = v.trim()
  return s ? s : null
}

export function parsePostingsQuery(q: LocationQuery): PostingsRouteQuery {
  const page = Math.max(1, toInt(q.page) ?? DEFAULTS.page)
  const size = Math.min(200, Math.max(1, toInt(q.size) ?? DEFAULTS.size))
  const sort = toStr(q.sort) ?? DEFAULTS.sort

  const company = toStr(q.company) ?? undefined
  const title = toStr(q.title) ?? undefined

  const employmentType = (toStr(q.employmentType) ?? undefined) as
    | PostingAttributes['employmentType']
    | undefined

  const source = (toStr(q.source) ?? undefined) as
    | PostingAttributes['source']
    | undefined

  const workMode = (toStr(q.workMode) ?? undefined) as
    | PostingAttributes['workMode']
    | undefined

  const status = (toStr(q.status) ?? undefined) as PostingStatus | undefined

  const filters: PostingsListFilters = {
    ...(company ? {company} : {}),
    ...(title ? {title} : {}),
    ...(employmentType ? {employmentType} : {}),
    ...(source ? {source} : {}),
    ...(workMode ? {workMode} : {}),
    ...(status ? {status} : {}),
  }

  return {page, size, sort, filters}
}

export function buildPostingsQuery(next: PostingsRouteQuery): LocationQueryRaw {
  const out: LocationQueryRaw = {}

  if (next.page !== 1) out.page = String(next.page)
  if (next.size !== 25) out.size = String(next.size)
  if (next.sort) out.sort = next.sort

  if (next.filters.company) out.company = next.filters.company
  if (next.filters.title) out.title = next.filters.title
  if (next.filters.employmentType) out.employmentType = next.filters.employmentType
  if (next.filters.source) out.source = next.filters.source
  if (next.filters.workMode) out.workMode = next.filters.workMode
  if (next.filters.status) out.status = next.filters.status

  return out
}
