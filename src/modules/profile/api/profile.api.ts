import api from '@/lib/api'
import type {AxiosResponse} from 'axios'
import type {JsonApiUpdateDocument,} from '@/types/common.types.ts'
import type {ProfileAttributes, ProfileViewResponse} from "@/modules/profile/types/profile.types.ts";

const PROFILE_TYPE: 'users' = 'users';


export async function getProfile(): Promise<ProfileViewResponse> {
  const response = await api.get<
    ProfileViewResponse,
    AxiosResponse<ProfileViewResponse>
  >(`/api/v1/me`)

  return response.data
}

export async function updateProfile(
  id: string, attrs: ProfileAttributes
): Promise<ProfileViewResponse> {
  const payload: JsonApiUpdateDocument<'users', ProfileAttributes> = {
    data: {
      type: PROFILE_TYPE,
      id,
      attributes: attrs,
    },
  }

  console.log(id);

  const response = await api.patch<ProfileViewResponse, AxiosResponse<ProfileViewResponse>>(
    `/api/v1/users/${encodeURIComponent(id)}`,
    payload
  )
}