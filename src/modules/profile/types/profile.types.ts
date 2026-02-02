export type ProfileAttributes = {
    name: string
    title: string
    address: string
    city: string
    state: string
    country: string
    zip: string
    phone: string
    email: string

    createdAt: string
    updatedAt: string
}

export type ProfileFormModel = {
    name: string
    title: string | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    zip: string | null
    phone: string | null
    email: string
}

export type ProfileResource = {
    type: 'users'
    id: string
    attributes: ProfileAttributes
}

export const createEmptyProfileResource = (): ProfileResource => <ProfileResource>({
  type: 'users',
  id: '',
  attributes: {
    name: '',
    title: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    phone: '',
    email: '',
    createdAt: '',
    updatedAt: '',
  }
})

export type ProfileViewResponse = {
    jsonapi?: { version: string }
    data: ProfileResource
    links?: Record<string, string>
    meta?: Record<string, unknown>
}