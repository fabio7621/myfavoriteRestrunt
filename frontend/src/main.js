import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'leaflet/dist/leaflet.css'
import './assets/main.css'
import './assets/shared.css'

// Google Fonts — Noto Serif JP + Noto Sans JP
const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;600&family=Noto+Sans+JP:wght@300;400;500&display=swap'
document.head.appendChild(fontLink)

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
