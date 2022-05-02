import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Manage from '../components/Manage.vue'
import Report from '../components/Report.vue'
import Virtual from '../components/Virtual.vue'

// import AverageAgePage from '../views/AverageAgePage.vue'
// import StaffPage from '../views/StaffPage.vue'
// import TrendPage from '../views/TrendPage.vue'
// import HotProductPage from '../views/HotProductPage.vue'
// import StockPage from '../views/StockPage.vue'
// import HotMapPage from '../views/HotMapPage.vue'
// import ChannelPage from '../views/ChannelPage.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', 
    component: Home,
    redirect: '/data_virtual',
    children: [
      { path: '/data_virtual', component: Virtual },
      { path: '/data_report', component: Report },
      { path: '/data_manage', component: Manage }
    ]
  },
  // { path: '/averageagepage',
  //   component: AverageAgePage
  // },
  // { path: '/staffpage',
  //   component: StaffPage
  // },
  // { path: '/trendpage',
  //   component: TrendPage
  // },
  // { path: '/hotproductpage',
  //   component: HotProductPage
  // },
  // { path: '/stockpage',
  //   component: StockPage
  // },
  // { path: '/hotmappage',
  // component: HotMapPage
  // },
  // { path: '/channelpage',
  //   component: ChannelPage
  // }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
