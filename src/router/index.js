import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/essays',
    name: 'essays',
    component: () => import('@/views/Essays.vue')
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('@/views/Articles.vue')
  },
  {
    path: '/versions',
    name: 'versions',
    component: () => import('@/views/Versions.vue')
  },
  {
    path: '/introduction',
    name: 'introduction',
    component: () => import('@/views/Introduction.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/myblog'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（比如浏览器前进后退），就恢复到那个位置
    if (savedPosition) {
      return savedPosition
    } else {
      // 否则滚动到顶部
      return { top: 0 }
    }
  }
})

export default router
