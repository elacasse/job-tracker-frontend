import type {RouteRecordRaw} from 'vue-router'

import PostingsListView from './views/PostingsListView.vue'
import PostingCreateView from './views/PostingCreateView.vue'
import PostingShowView from './views/PostingShowView.vue'
import PostingEditView from './views/PostingEditView.vue'

export const postingsRoutes: RouteRecordRaw[] = [
  {
    path: '/postings',
    name: 'postings.list',
    component: PostingsListView,
    meta: {requiresAuth: true},
  },
  {
    path: '/postings/new',
    name: 'postings.create',
    component: PostingCreateView,
    meta: {requiresAuth: true},
  },
  {
    path: '/postings/:id',
    name: 'postings.show',
    component: PostingShowView,
    meta: {requiresAuth: true},
    props: true,
  },
  {
    path: '/postings/:id/edit',
    name: 'postings.edit',
    component: PostingEditView,
    meta: {requiresAuth: true},
    props: true,
  },
]
