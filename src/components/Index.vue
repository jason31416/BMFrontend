<!-- App.vue -->
<template>
    <div class="content">
        <NavBar />
        <HeroSection :slides="slides" :current-slide="currentSlide" />
        <a name="servers"></a>
        <ServersSection :servers="servers" />
        <TeamSection :team="team" />
        <FooterSection />
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import NavBar from '/src/components/Navbar.vue'
import HeroSection from '/src/components/HeroSection.vue'
import ServersSection from '/src/components/ServersSection.vue'
import TeamSection from '/src/components/TeamSection.vue'
import FooterSection from '/src/components/FooterSection.vue'

const servers = ref([
    {
        name: '养老生存',
        description: '正如大部分原版生存服，提供基础的传送，经济，领地，与地图等玩法，并允许生电！本子服保证不换周目！不论你是建筑高手还是生电玩家，不论你想打出自己的一片天地或是交到更多朋友，来这里就对了！',
        version: '1.20.1',
        isOnline: true
    },
    {
        name: '粘液空岛',
        description: '欢迎来到粘液空岛服务器！在这里，你将面对独特的挑战，从零开始建设你的空中家园。粘液科技所提供的自动化系统，让你通过科技与智慧征服空岛。无论是资源管理还是复杂机械，都能让你体验创造的乐趣。加入我们，挑战极限，打造属于你的自动化空岛帝国！',
        version: '1.21.4',
        isOnline: true
    },
    {
        name: '模组服',
        description: '玩腻了千篇一律的原版生存？想挑战一些更新颖的玩法？那就来我们的模组服试一试吧！在这里，你可以制造各种机器，探索全新的维度，甚至殖民宇宙!',
        version: '1.12.2',
        isOnline: true
    },
    {
        name: '王国战争',
        description: '包含独创国战趣味玩法，你可以在一个开放的世界中生存，收集资源、建造属于你的王国，与其他玩家合作或竞争。本服务器中所有国战相关玩法全部为自研，保证带给你独一无二的游玩体验！[本服务器将于暑假开放]',
        version: '1.20.1',
        isOnline: false
    },
    {
        name: '无尽地城',
        description: '喜欢玩肉鸽类游戏吗？那不妨在Minecraft里开启一段属于你的地城探索之旅！通过击杀怪物来购买更强力的装备，你能坚持到第几关？',
        version: '1.18.2',
        isOnline: true
    }
])

const navScrolled = ref(false)
const currentSlide = ref(0)
const slides = [
    '/scroll1.png',
    '/scroll2.png',
    '/scroll3.png'
]

const team = [
    { name: 'Flyingfish', role: '腐竹 & 硬件技术', avatar: '/flyingfish.png' },
    { name: 'Jason31416', role: '养老/国战腐竹 & 技术', avatar: '/jason31416.png' },
    { name: 'oneLiLi', role: '小游戏腐竹 & 技术', avatar: '/onelili.png' },
    { name: 'Leo728', role: '技术&反作弊', avatar: '/leo728.png' },
    { name: 'Jiyu', role: '纯净生存腐竹', avatar: '/jiyu.png' }
]

const handleScroll = () => {
    navScrolled.value = window.scrollY > 50
    console.log(window.scrollY);
}

const startSlideShow = () => {
    setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % slides.length
    }, 5000)
}

const navVisible = ref(true)

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    startSlideShow()
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
body {
  background: #0f172a;
  color: #e2e8f0;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  overflow-x:hidden;
}
.content {
  overflow-x:hidden;
}
</style>
