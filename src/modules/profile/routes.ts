import type {RouteRecordRaw} from 'vue-router'
import ProfileView from "@/modules/profile/views/ProfileView.vue";
import ProfileEdit from "@/modules/profile/views/ProfileEdit.vue";

export const profileRoutes: RouteRecordRaw[] = [
  {
    path: '/profile',
    name: 'profile.view',
    component: ProfileView,
    meta: {requiresAuth: true},
  },
  {
    path: '/profile/edit',
    name: 'profile.edit',
    component: ProfileEdit,
    meta: {requiresAuth: true},
  }
]
