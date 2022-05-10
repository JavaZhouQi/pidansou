import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant'
import router from '@/router'
import lazyPlugin from 'vue3-lazy'

import 'vant/lib/index.css'

const app = createApp(App)
app.use(router)
app.use(Vant)
app.use(lazyPlugin, {
    loading: 'http://img.bc.fqapps.com/fudai13cae4ae6ef16739ed3b100a2ec39e97.gif', // 图片加载时默认图片
    error: 'http://img.bc.fqapps.com/fudai13cae4ae6ef16739ed3b100a2ec39e97.gif'// 图片加载失败时默认图片
  })
app.mount('#app')
