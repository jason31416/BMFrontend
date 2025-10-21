<!-- components/ServersSection.vue -->
<template>
    <section class="servers-section">
        <h2 class="section-title">我们的子服</h2>
        <div class="servers-container" @touchstart="startDrag"
            @touchmove="doDrag" @touchend="endDrag" ref="container">
            <div class="servers-track" :style="{ transform: `translateX(${dragOffset}px)` }">
                <ServerCard v-for="(server, index) in servers" :key="index" :server="server"
                    :style="{ transform: `scale(${activeIndex === index ? 1.0 : 0.95})` }"
                    @mouseenter="activeIndex = index" @mouseleave="activeIndex = -1" />
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import ServerCard from './ServerCard.vue'

const props = defineProps({
    servers: Array
})

const container = ref(null)
const isDragging = ref(false)
const startX = ref(0)
const initialOffset = ref(0)
const dragOffset = ref(0)
const activeIndex = ref(-1)

const clampOffset = computed(() => {
    const containerWidth = container.value?.offsetWidth || 0
    const trackWidth = containerWidth * props.servers.length
    const maxOffset = (trackWidth - containerWidth) / 2
    return Math.max(Math.min(dragOffset.value, maxOffset), -maxOffset)
})

const startDrag = (e) => {
    isDragging.value = true
    startX.value = e.clientX || e.touches[0].clientX
    initialOffset.value = dragOffset.value
}

const doDrag = (e) => {
    if (!isDragging.value) return
    e.preventDefault()
    const x = e.clientX || e.touches[0].clientX
    dragOffset.value = initialOffset.value + (x - startX.value)
}

const endDrag = () => {
    isDragging.value = false
    // Add momentum/snap effect
    dragOffset.value = clampOffset.value
}
</script>

<style scoped>
.servers-section {
    padding: 4rem 0;
    background: #0f172a;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
}

.servers-container {
    padding: 2rem 0;
}

.servers-track::-webkit-scrollbar {
    opacity: 0;
}
.servers-track::-webkit-scrollbar-thumb {
    opacity: 0;
}
.servers-track {
    overflow-x: auto;
    display: flex;
    gap: 2rem;
    padding: 0 5vw;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@media (max-width: 768px) {
    .servers-track {
        padding: 0 2rem;
    }
}
</style>