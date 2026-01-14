export type JsonApiDocumentList<TResource, TMeta = Record<string, unknown>> = {
  jsonapi?: { version: string }
  data: TResource[]
  links?: Record<string, string>
  meta?: TMeta
}

export type PostingStatus =
  | 'new'
  | 'postulated'
  | 'interview_scheduled'
  | 'interview_dropped'
  | 'interview_rejected'
  | 'rejected'
  | 'dropped'
  | 'job_accepted'
  | 'job_refused'

export type PostingAttributes = {
  userId: number

  source: 'LinkedIn' | 'Indeed' | 'Jobboom' | 'Jobillico' | 'JobBank' | 'Other'
  sourceId: string

  employmentType: 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary'
  workMode: 'in_office' | 'remote' | 'hybrid'
  status: PostingStatus

  url: string
  company: string
  title: string
  description: string
  coverLetter: string | null

  createdAt: string
  updatedAt: string
}

export type PostingCreateAttributes = Pick<
  PostingAttributes,
  | 'source'
  | 'sourceId'
  | 'employmentType'
  | 'workMode'
  | 'url'
  | 'company'
  | 'title'
  | 'description'
  | 'status'
  | 'coverLetter'
>

export type PostingUpdateAttributes = Partial<PostingCreateAttributes>

// JSON:API request documents
export type JsonApiCreateDocument<TType extends string, TAttrs> = {
  data: {
    type: TType
    attributes: TAttrs
  }
}

export type JsonApiUpdateDocument<TType extends string, TAttrs> = {
  data: {
    type: TType
    id: string
    attributes: TAttrs
  }
}

export type PostingResource = {
  type: 'postings'
  id: string
  attributes: PostingAttributes
}

/**
 * Pagination meta exactly as your API returns it.
 */
export type PostingsPageMeta = {
  currentPage: number
  from: number | null
  lastPage: number
  perPage: number
  to: number | null
  total: number
}

export type PostingsListMeta = {
  page: PostingsPageMeta
}

export type PostingsListResponse = JsonApiDocumentList<PostingResource, PostingsListMeta>

export type PostingShowResponse = {
  jsonapi?: { version: string }
  data: PostingResource
  links?: Record<string, string>
  meta?: Record<string, unknown>
}
