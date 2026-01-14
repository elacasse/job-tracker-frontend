import api from '@/lib/api'
import type {AxiosResponse} from 'axios'
import type {
  JsonApiCreateDocument,
  JsonApiUpdateDocument,
  PostingAttributes,
  PostingCreateAttributes,
  PostingShowResponse,
  PostingsListResponse,
  PostingStatus,
  PostingUpdateAttributes,
} from '../types/postings.types'

const POSTINGS_TYPE: 'postings' = 'postings'

export type PostingsListFilters = {
  company?: string
  title?: string
  employmentType?: PostingAttributes['employmentType']
  source?: PostingAttributes['source']
  workMode?: PostingAttributes['workMode']
  status?: PostingStatus
}

export type PostingsListQuery = {
  pageNumber: number
  pageSize: number
  sort?: string // JSON:API sort: "company" or "-company"
  filters?: PostingsListFilters
}

export async function listPostings(
  query: PostingsListQuery
): Promise<PostingsListResponse> {
  const f = query.filters ?? {}

  const response = await api.get<
    PostingsListResponse,
    AxiosResponse<PostingsListResponse>
  >('/api/v1/postings', {
    params: {
      'page[number]': query.pageNumber,
      'page[size]': query.pageSize,
      ...(query.sort ? {sort: query.sort} : {}),

      // JSON:API-style filters (your backend must support these)
      ...(f.company ? {'filter[company]': f.company} : {}),
      ...(f.title ? {'filter[title]': f.title} : {}),
      ...(f.employmentType ? {'filter[employmentType]': f.employmentType} : {}),
      ...(f.source ? {'filter[source]': f.source} : {}),
      ...(f.workMode ? {'filter[workMode]': f.workMode} : {}),
      ...(f.status ? {'filter[status]': f.status} : {}),
    },
  })

  return response.data
}

export async function getPosting(id: string): Promise<PostingShowResponse> {
  const response = await api.get<
    PostingShowResponse,
    AxiosResponse<PostingShowResponse>
  >(`/api/v1/postings/${encodeURIComponent(id)}`)

  return response.data
}

export async function createPosting(
  attrs: PostingCreateAttributes
): Promise<PostingShowResponse> {
  const payload: JsonApiCreateDocument<'postings', PostingCreateAttributes> = {
    data: {
      type: POSTINGS_TYPE,
      attributes: attrs,
    },
  }

  const response = await api.post<PostingShowResponse, AxiosResponse<PostingShowResponse>>(
    '/api/v1/postings',
    payload
  )

  return response.data
}

export async function updatePosting(
  id: string,
  attrs: PostingUpdateAttributes
): Promise<PostingShowResponse> {
  const payload: JsonApiUpdateDocument<'postings', PostingUpdateAttributes> = {
    data: {
      type: POSTINGS_TYPE,
      id,
      attributes: attrs,
    },
  }

  const response = await api.patch<PostingShowResponse, AxiosResponse<PostingShowResponse>>(
    `/api/v1/postings/${encodeURIComponent(id)}`,
    payload
  )

  return response.data
}
