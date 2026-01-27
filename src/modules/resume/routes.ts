import type {RouteRecordRaw} from 'vue-router'
import ResumeView from "@/modules/resume/views/ResumeView.vue";
import ResumeEdit from "@/modules/resume/views/ResumeEdit.vue";

export const resumeRoutes: RouteRecordRaw[] = [
  {
    path: '/resume',
    name: 'resume.view',
    component: ResumeView,
    meta: {requiresAuth: true},
  },
  {
    path: '/resume/edit',
    name: 'resume.edit',
    component: ResumeEdit,
    meta: {requiresAuth: true},
  }
]
