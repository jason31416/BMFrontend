import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { createPinia } from 'pinia'
import VueCookies from "vue-cookies";

// Define a router
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: () => import('./components/Index.vue') },
        { path: '/chat', component: () => import('./unichat/ChatApp.vue') },
        { path: '/auth/login', component: () => import('./components/Login.vue') },
        { path: '/auth/register', component: () => import('./components/Register.vue') },
        { path: '/user/:username', component: () => import('./components/Userpage.vue') },
        { path: '/jason31416', component: () => import("./components/Jason31416.vue") },
        { path: '/:pathMatch(.*)*', component: ()=>import("./components/404.vue")}
    ]
})

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(VueCookies)
app.mount('#app')
