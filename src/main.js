import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表
import "./assets/css/global.css"
// 导入字体图标
import './assets/font/iconfont.css'
import VueCountTo from './components/VueCountTo/vue-countTo'
import axios from 'axios'
import SocketService from '@/utils/socket_service'
// 对服务端进行websocket的连接
SocketService.Instance.connect()
// 其他的组件  this.$socket
Vue.prototype.$socket = SocketService.Instance


// 配置请求根路径
// axios.defaults.baseURL = ' https://mock.mengxuegu.com/mock/62583398560e3d1eabd770eb/baseurl/'
axios.defaults.baseURL = ' http://127.0.0.1:3000/'
// 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config)
  // NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  // NProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false
Vue.component('CountTo', VueCountTo)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
