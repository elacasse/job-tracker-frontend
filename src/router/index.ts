import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true }, // only for unauthenticated users
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }, // authenticated only
    },
    // add other authenticated pages here (all with requiresAuth: true)
    // {
    //   path: '/jobs',
    //   name: 'jobs',
    //   component: JobsListView,
    //   meta: { requiresAuth: true },
    // },

    // 404 catch-all
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      // no meta: accessible to everyone
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userToken = localStorage.getItem('userToken')
  const isAuthenticated = !!userToken

  // 1. If NOT authenticated:
  if (!isAuthenticated) {
    // allow login and 404
    if (to.name === 'login' || to.name === 'not-found') {
      return next()
    }

    // everything else → redirect to login
    return next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }

  // 2. If authenticated:
  // prevent going back to login
  if (to.name === 'login') {
    return next({ name: 'dashboard' })
  }

  // 3. Otherwise, proceed normally
  next()
})

export default router
