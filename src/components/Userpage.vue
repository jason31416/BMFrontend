<template>
    <notfound v-if="!found" />
    <div class="user-profile" v-if="found">
        <NavBar class="navbar-container" />

        <!-- 主要内容 -->
        <main class="container main-content">
            <!-- 用户信息头部 -->
            <div class="profile-header">
                <img :src="avatar" alt="用户头像" class="avatar">
                <div class="profile-info">
                    <h1 class="username"><span :style="'color: '+rankcolor" class="userrank">{{ rankname }}</span>{{ username }}</h1>
                    <div class="uuid">UUID: {{ uuid }}</div>
                    <div class="bio" :class="{ 'empty-bio': !bio }">
                        {{ bio || '该用户很懒，什么也没有写!' }}
                    </div>
                </div>
            </div>

            <!-- 数据卡片 -->
            <div class="stats-grid">
                <div v-for="stat in stats" :key="stat.title" class="stat-card" :style="{ '--hue': stat.hue }">
                    <div class="stat-icon">
                        <component :is="stat.icon" />
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">{{ stat.value }}</div>
                        <div class="stat-title">{{ stat.title }}</div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
    CubeTransparentIcon,
    ArrowLeftIcon,
    ClockIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    StarIcon,
    IdentificationIcon
} from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import locale from 'dayjs/locale/zh-cn'
import NavBar from '/src/components/Navbar.vue'
import axios from 'axios'
import notfound from "./404.vue"

import { Jimp } from "jimp"
import constant from "./const.vue"

dayjs.extend(relativeTime)
dayjs.locale("zh-cn")

const route = useRoute()
const username = ref(route.params.username)

const bio = ref('')
const uuid = ref('xxxxxxxx-xxxx-xxxxxxxxxxxx')
const lastLogin = ref(dayjs().valueOf())
const registered = ref(dayjs().valueOf())
const balance = ref(0.0)
const playTime = ref(0)
const level = ref(0)
const rankname = ref("")
const rankcolor = ref("#000000")
const avatar = ref("")
const found = ref(true)

axios.get(constant.backendurl+"/api/userdata", {
    params: {
        username: username.value
    }
}).then(res=>{
    if(res.data["status"]==200){
        bio.value = "";
        uuid.value = res.data["uuid"]
        lastLogin.value = res.data["lastlogin"]
        registered.value = res.data["regtime"]
        balance.value = res.data["balance"]
        playTime.value = dayjs(res.data["playtime"]).get("hour")
        if(res.data["rank"]=="vip"){
            rankname.value = "[VIP] "
            rankcolor.value = "#ffdd19"
        }else if(res.data["rank"]=="mvp"){
            rankname.value="[MVP] "
            rankcolor.value="#ff3311"
        }else if(res.data["rank"]=="admin"){
            rankname.value="[Admin] "
            rankcolor.value = "#dd0033"
        }else if(res.data["rank"]=="builder"){
            rankname.value = "[Builder] "
            rankcolor.value = "#00ff00"
        }
    }else{
        console.warn("Error code received when retrieving data: "+res.data["status"]);
        found.value=false;
    }
})
axios.get(constant.backendurl+"/api/avatar", {
    params: {
        username: username.value
    }
}).then(res=>{
    console.log(res.data);
    Jimp.read(res.data.textures.SKIN.url).then(image=>{
        image.crop({
            x:8,y:8,h:8,w:8
        }).resize({w:120,h:120,mode:"nearestNeighbor"}).getBase64("image/png").then(src=>{
            console.log(src);
            avatar.value=src;
        });
    })
})

const stats = computed(() => [
    {
        title: '上次登录',
        value: dayjs(lastLogin.value).fromNow(),
        icon: ClockIcon,
        hue: 200
    },
    {
        title: '注册时间',
        value: dayjs(registered.value).format('YYYY-MM-DD'),
        icon: CalendarIcon,
        hue: 220
    },
    {
        title: '金币数量',
        value: balance.value.toLocaleString(),
        icon: CurrencyDollarIcon,
        hue: 50
    },
    {
        title: '活跃时长',
        value: `${playTime.value} 小时`,
        icon: ClockIcon,
        hue: 180
    }
])

const handleAvatarError = (e) => {
    e.target.src = '/defaultavatar.png'
}

</script>

<style>
@font-face {
    font-family: 'fzxs';
    src: url('/FZXIANGSU12.TTF') format('truetype');
}
body {
    color: #e2e8f0;
    margin: 0;
    overflow: hidden;
}

.user-profile {
    min-height: 100vh;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #1a365d 0%, #2a5298 100%);
    color: white;
    padding-top: 72px;
}

.navbar-container {
    position: fixed;
    height: 60px;
    /* background: rgba(26, 54, 93, 0.9); */
    /* backdrop-filter: blur(10px); */
    top: 0;
    left: 0;
    right: 0;
    /* box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); */
    z-index: 1000;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.5rem;
    font-weight: 700;
}

.icon {
    width: 24px;
    height: 24px;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 3rem;
    margin: 4rem 0;
    animation: fade-in 0.6s ease;
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 20%;
    border: 3px solid white;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
}

.avatar:hover {
    transform: scale(1.05*5);
}

.username {
    font-size: 2.5rem;
    margin: 0;
    text-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    font-family: 'fzxs',
        'Poppins',
        sans-serif;
}

.uuid {
    color: #a0aec0;
    font-size: 0.9rem;
    margin: 8px 0;
}

.bio {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 12px;
    max-width: 600px;
    line-height: 1.6;
    backdrop-filter: blur(4px);
}

.empty-bio {
    opacity: 0.7;
    font-style: italic;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
}

.stat-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.stat-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg,
            hsl(var(--hue), 70%, 50%, 0.3) 0deg,
            transparent 180deg);
    transform: rotate(60deg);
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.stat-icon {
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-icon svg {
    width: 28px;
    height: 28px;
    color: hsl(var(--hue), 70%, 60%);
}

.stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 4px;
}

.stat-title {
    color: #a0aec0;
    font-size: 0.9rem;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes rotate {
    to {
        transform: rotate(360deg);
    }
}
</style>