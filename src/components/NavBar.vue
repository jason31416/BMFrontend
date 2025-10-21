<!-- components/NavBar.vue -->
<template>
    <nav class="navbar">
        <div class="nav-content">
            <div class="brand">
                <img src="/favicon.jpg" alt="BlockMax Logo" class="logo">
                <h1 class="title">BlockMax Network</h1>
            </div>
            <div class="nav-links">
                <a v-for="link in links" :key="link.name" :href="link.url" class="nav-link">
                    {{ link.name }}
                </a>
                <span class="username">
                    <a :href="userhref"> {{ username }} </a>
                    <span v-if="userhref!=='/auth/login'">
                        |
                        <a v-on:click="logout()"> 退出登录 </a>
                    </span>
                </span>
            </div>

        </div>
    </nav>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import cookies from 'vue-cookies'
import constant from "./const.vue"

const links = [
    { name: '主页', url: '/' },
    { name: '网页聊天', url: '/chat' },
    { name: '数据统计', url: '/plan' },
    { name: '养老地图', url: '/map/survival-1/' }
]

const username = ref("登录/注册")
const userhref = ref("/auth/login")

onMounted(()=>{
    if (cookies.isKey("ua.sid")) {
        axios.post(constant.uniauthurl+"/webapi/validate", {
            token: cookies.get("ua.sid")
        }).then(res => {
            console.log(res.data)
            if (res.data["success"] == true) {
                username.value = res.data["username"]
                userhref.value = "/user/" + res.data["username"]
                constant.username.value = res.data["username"]
            }else{
                cookies.remove("ua.sid")
            }
        })
    }
})

function logout() {
    cookies.remove('ua.sid');
    window.location.href = "/auth/login";
}

</script>

<style scoped>
.navbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding-top: 1rem;
    /* backdrop-filter: blur(10px); */
    background: linear-gradient(#00000055, transparent);
    z-index: 1000;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar.hidden {
    transform: translateY(-100%);
    opacity: 0;
}

.nav-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
    transition: transform 0.3s ease;
    border-radius: 5px;
}

.logo:hover {
    transform: scale(1.2);
}

.title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #7dd3fc;
    margin: 0;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

.username {
    color: #e2e8f0;
    text-decoration: none;
    position: relative;
    font-size: 1rem;
    font-weight: 400;
    padding: 0.5rem 0;
}
.username a {
    color: #e2e8f0;
    text-decoration: none;
    transition: color 0.3s ease;
}
.username a:hover {
    color: #7dd3fc;
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-link {
    color: #e2e8f0;
    text-decoration: none;
    position: relative;
    font-size: 1rem;
    padding: 0.5rem 0;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #7dd3fc;
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 100%;
}

@media (max-width: 768px) {
    .nav-links {
        gap: 1rem;
    }

    .title {
        font-size: 1.2rem;
    }

    .nav-link {
        font-size: 0.9rem;
    }
}
</style>