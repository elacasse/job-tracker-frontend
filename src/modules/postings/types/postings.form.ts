import type {PostingAttributes, PostingCreateAttributes} from './postings.types'

export type PostingFormModel = {
  source: PostingCreateAttributes['source'] | null
  employmentType: PostingCreateAttributes['employmentType'] | null
  workMode: PostingCreateAttributes['workMode'] | null
  status: PostingCreateAttributes['status'] | null
  sourceId: string
  url: string
  company: string
  title: string
  description: string
  coverLetter: string | null
}

export function postingToForm(a: PostingAttributes): PostingFormModel {
  return {
    source: a.source,
    employmentType: a.employmentType,
    workMode: a.workMode,
    status: a.status,
    sourceId: a.sourceId,
    url: a.url,
    company: a.company,
    title: a.title,
    description: a.description,
    coverLetter: a.coverLetter,
  }
}

export function formToCreate(model: PostingFormModel): PostingCreateAttributes {
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
