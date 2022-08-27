import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/views/sellerPage'
import TrendPage from '@/views/trendPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  },
  {
    path: '/trendpage',
    component: TrendPage
  }
]

const router = new VueRouter({
  routes
})

export default router
