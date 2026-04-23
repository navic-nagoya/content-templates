import { createRouter, createWebHashHistory } from 'vue-router'
import { SECTIONS } from './sections.js'

// Hash history keeps the site deploy-agnostic: it works as a static bundle
// opened directly from disk, from `pnpm preview`, or behind any sub-path,
// without requiring server-side rewrites.
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/components/:id',
    name: 'component',
    component: () => import('../views/ComponentView.vue'),
    props: true
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import('../views/PreviewView.vue')
  },
  // Fallback: unknown routes land on the homepage.
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export { SECTIONS }
