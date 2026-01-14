import {
  EMPLOYMENT_TYPE_LABELS,
  SOURCE_LABELS,
  STATUS_LABELS,
  WORK_MODE_LABELS
} from '../types/postings.labels'
import type {PostingAttributes} from '../types/postings.types'

export function usePostingFormatters() {
  return {
    sourceLabel: (v: PostingAttributes['source']) => SOURCE_LABELS[v],
    employmentTypeLabel: (v: PostingAttributes['employmentType']) => EMPLOYMENT_TYPE_LABELS[v],
    workModeLabel: (v: PostingAttributes['workMode']) => WORK_MODE_LABELS[v],
    statusLabel: (v: PostingAttributes['status']) => STATUS_LABELS[v],
  }
}
