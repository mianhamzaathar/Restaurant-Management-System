import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Axios config
axios.defaults.baseURL = 'http://localhost:8000/api'
axios.defaults.withCredentials = true

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.globalProperties.$axios = axios

app.mount('#app')
