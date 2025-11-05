import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import router from './router/index.js'

const { message, dialog, notification, loadingBar } = createDiscreteApi([
  'message',
  'dialog',
  'notification',
  'loadingBar'
])

const app = createApp(App)

// 注册Naive UI组件
app.use(naive)

// 注册路由
app.use(router)

// 全局挂载Naive UI的离散API
app.config.globalProperties.$message = message
app.config.globalProperties.$dialog = dialog
app.config.globalProperties.$notification = notification
app.config.globalProperties.$loadingBar = loadingBar

app.mount('#app')