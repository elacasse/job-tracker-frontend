import type {PostingAttributes} from './postings.types'

export const SOURCE_LABELS: Record<PostingAttributes['source'], string> = {
  LinkedIn: 'LinkedIn',
  Indeed: 'Indeed',
  Jobboom: 'Jobboom',
  Jobillico: 'Jobillico',
  JobBank: 'Job Bank',
  Other: 'Other',
}

export const EMPLOYMENT_TYPE_LABELS: Record<PostingAttributes['employmentType'], string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  temporary: 'Temporary',
}

export const WORK_MODE_LABELS: Record<PostingAttributes['workMode'], string> = {
  in_office: 'On-site',
  remote: 'Remote',
  hybrid: 'Hybrid',
}

export const STATUS_LABELS: Record<PostingAttributes['status'], string> = {
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
