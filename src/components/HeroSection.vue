<!-- components/HeroSection.vue -->
<template>
  <section class="hero">
    <div 
      v-for="(slide, index) in slides"
      :key="index"
      class="hero-slide"
      :class="{ active: currentSlide === index }"
      :style="{ backgroundImage: `url(${slide})` }"
    >
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="title-container">
          <h1 class="hero-title">BlockMax Network</h1>
          <div class="server-status">
            <span class="status-text" :class="{status_class}">{{ status }}</span>
          </div>
        </div>
        <button class="play-button" onclick="alert('请使用MC Java国际版 1.8+客户端 - 多人游戏 - 添加服务器 - 输入地址: mc.block-max.cn 以进入游戏!')">开始游玩</button>
        <div v-if="showScrollText" class="scroll-indicator">
          <span>下滑查看更多</span>
          <div class="chevron"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
    height: 100vh;
    position: relative;
    overflow: hidden;
}

.hero-slide {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: 1s;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.hero-slide.active {
    opacity: 1;
}

.hero-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent, rgba(15, 23, 42, 0.8));
}

.hero-content {
    position: relative;
    z-index: 2;
}

.hero-title {
    font-size: 5rem;
    font-weight: 600;
    color: white;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
    margin-bottom: 3rem;
}

.hero {
    height: 100vh;
    position: relative;
    overflow: hidden;
}

.hero-slide {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: 1s;
}

.hero-slide.active {
    opacity: 1;
}

.hero-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent, #0f172a);
}
.play-button {
    background: #7dd3fc;
    color: #0f172a;
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1.2rem;
    font-weight: 600;
    border-radius: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(125, 211, 252, 0.3);
}

.play-button:hover {
    background: #5bc0eb;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(125, 211, 252, 0.4);
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }

    .play-button {
        padding: 0.8rem 2rem;
        font-size: 1rem;
    }
}
.scroll-indicator {
    position: absolute;
    bottom: -200px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    text-align: center;
    opacity: 0.9;
    animation: float 2s infinite;
}

.chevron {
    width: 20px;
    height: 20px;
    border: 2px solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin: 8px auto;
}

@keyframes float {

    0%,
    100% {
        transform: translate(-50%, 0);
    }

    50% {
        transform: translate(-50%, -10px);
    }
}
.hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding-top: 10vh;
    /* Move content up from center */
}

.title-container {
    text-align: center;
    margin-bottom: 2rem;
}

.server-status {
    margin-top: 1.5rem;
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(0, 0, 0, 0.3);
    padding: 0.5rem 1.5rem;
    border-radius: 2rem;
    backdrop-filter: blur(5px);
}

.status-text {
    display: inline-flex;
    align-items: center;
}

.status-text::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #64748b;
    margin-right: 0.8rem;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        opacity: 0.5;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.5;
    }
}

@media (max-width: 768px) {
    .hero-content {
        padding-top: 15vh;
    }

    .server-status {
        font-size: 1rem;
        padding: 0.4rem 1.2rem;
    }
}
</style>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios';

defineProps({
    slides: Array,
    currentSlide: Number
})

const showScrollText = ref(true)
var status = ref("加载服务器状态中...");

const handleScroll = () => {
    showScrollText.value = window.scrollY < 100
}

function refreshPlayers(){
    axios.get('https://api.mcsrvstat.us/3/mc.block-max.cn')
        .then(response => {
            if (response.data["online"]) {
                status.value = "在线人数: " + response.data["players"]["online"];
            } else {
                status.value = "服务器不见啦! 过会再来看看吧~";
            }
        })
        .catch(error => {
            console.error('无法获取服务器状态: ', error);
        });
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    refreshPlayers();
})

setInterval(refreshPlayers, 30000);

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})

</script>