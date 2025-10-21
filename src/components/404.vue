<template>
    <div class="user-profile">
        <NavBar class="navbar-container" />
        
        <div class="not-found-container">
            <div class="content-wrapper">
                <div class="floating-icon">
                    ☁️
                </div>

                <h1 class="bounce-in">404 - 页面飘走啦！</h1>
                <p class="fade-slide-in">哎呀，你要找的页面好像被风吹走了呢～</p>

                <a href="/" class="home-button pop-in">
                    返回主页
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '/src/components/Navbar.vue'

const isHovered = ref(false)

const hoverButton = (state) => {
    isHovered.value = state
}
</script>

<style>
body {
    margin: 0;
    overflow: hidden;
    min-height: 100vh;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #1a365d 0%, #2a5298 100%);
    color: white;
    padding-top: 72px;
}

.navbar-container {
    position: fixed;
    height: 60px;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}
.not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 72px);
    padding: 20px;
}

.content-wrapper {
    text-align: center;
    position: relative;
    top: -100px;
    max-width: 600px;
}

.floating-icon {
    font-size: 8rem;
    animation: float 3s ease-in-out infinite;
    position: relative;
    filter: drop-shadow(0 5px 15px rgba(255,255,255,0.3));
}

h1 {
    font-size: 4rem;
    font-weight: 600;
    color: white;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    margin-bottom: 3rem;
}

p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    line-height: 1.6;
    color: #e6f7ff;
}

.home-button {
    background: #7dd3fc;
    color: #0f172a;
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1.2rem;
    font-weight: 600;
    border-radius: 2rem;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(125, 211, 252, 0.3);
}

.home-button:hover {
    background: #5bc0eb;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(125, 211, 252, 0.4);
}

/* 动画定义 */
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

@keyframes pulse {
    0%, 100% { transform: translateX(-50%) scale(1); }
    50% { transform: translateX(-50%) scale(1.2); }
}

@keyframes balloon-float {
    0%, 100% { transform: translateY(0) rotate(-5deg); }
    50% { transform: translateY(-30px) rotate(5deg); }
}

.bounce-in {
    animation: bounceIn 0.8s ease-out;
}

.fade-slide-in {
    animation: fadeSlideIn 1s ease-out;
}

.pop-in {
    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes bounceIn {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeSlideIn {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0.5);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>