import { createRouter, createWebHistory } from 'vue-router'
import BookList from '@/components/BookList.vue'
import UserLogin from '@/components/UserLogin.vue'

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: UserLogin
    },
    {
      path: '/books',
      name: 'books',
      component: BookList
    }
  ]
})

export default router
