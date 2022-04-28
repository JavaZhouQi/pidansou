import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant'
import router from '@/router'

import 'vant/lib/index.css'

const app = createApp(App)
app.use(router)
app.use(Vant)
app.mount('#app')
