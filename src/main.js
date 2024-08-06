import { createApp } from 'vue';
import { Quasar, Notify } from 'quasar';
import { router } from './routes/routes.js';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import axios from 'axios'; 
import './style.css';
import App from './App.vue';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

axios.defaults.baseURL = "http://localhost:4500/"

const app = createApp(App)
const pinia = (createPinia())
pinia.use(piniaPluginPersistedstate)
app.use(router)
app.use(pinia)

app.use(Quasar, {
    plugins: {
        Notify
    }
})

app.mount('#app')
