import { createRouter, createWebHistory } from 'vue-router'
import BookList from '@/components/BookList.vue'
import CheckoutBookList from '@/components/CheckoutBookList.vue'
import UserLogin from '@/components/UserLogin.vue'

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'books',
      component: BookList
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutBookList
    },
    {
      path: '/sign',
      name: 'sign',
      component: UserLogin
    }
  ]
})

export default router
