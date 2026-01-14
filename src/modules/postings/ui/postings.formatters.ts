import type {PostingAttributes, PostingStatus} from '../types/postings.types'

export function formatSource(v: PostingAttributes['source']) {
  return v // or map labels
}

export function formatEmploymentType(v: PostingAttributes['employmentType']) {
  const map: Record<PostingAttributes['employmentType'], string> = {
    full_time: 'Full time',
    part_time: 'Part time',
    contract: 'Contract',
    internship: 'Internship',
    temporary: 'Temporary',
  }
  return map[v]
}

export function formatWorkMode(v: PostingAttributes['workMode']) {
  const map: Record<PostingAttributes['workMode'], string> = {
    in_office: 'In office',
    remote: 'Remote',
    hybrid: 'Hybrid',
  }
  return map[v]
}

export function formatStatus(v: PostingStatus) {
  const map: Record<PostingStatus, string> = {
    new: 'New',
    postulated: 'Postulated',
    interview_scheduled: 'Interview scheduled',
    interview_dropped: 'Interview dropped',
    interview_rejected: 'Interview rejected',
    rejected: 'Rejected',
    dropped: 'Dropped',
    job_accepted: 'Job accepted',
    job_refused: 'Job refused',
  }
  return map[v]
}
