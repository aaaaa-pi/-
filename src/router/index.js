import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/views/sellerPage'
import TrendPage from '@/views/trendPage'
import MapPage from '@/views/mapPage'
import RankPage from '@/views/rankPage'
import HotPage from '@/views/hotPage'
import StockPage from '@/views/stockPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  },
  {
    path: '/trendpage',
    component: TrendPage
  },
  {
    path: '/mappage',
    component: MapPage
  },
  {
    path: '/rankpage',
    component: RankPage
  },
  {
    path: '/hotpage',
    component: HotPage
  },
  {
    path: '/stockpage',
    component: StockPage
  }
]

const router = new VueRouter({
  routes
})

export default router
