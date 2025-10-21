<!-- components/ServerCard.vue -->
<template>
    <div class="server-card">
        <div class="status-indicator" :class="{ online: server.isOnline }"></div>
        <h3 class="server-name">{{ server.name }}</h3>
        <p class="server-description">{{ server.description }}</p>
        <div class="server-stats">
            <div class="version">{{ server.version }}</div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    server: Object
})
</script>

<style scoped>
.server-card {
    background: rgba(45, 55, 72, 0.8);
    border-radius: 1rem;
    padding: 2rem;
    padding-top: 0.5rem;
    min-width: 300px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    position: relative;
    border: 1px solid rgba(125, 211, 252, 0.1);
}

.server-card:hover {
    background: rgba(45, 55, 72, 1);
    transform: translateY(-5px);
}

.status-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #64748b;
}

.status-indicator.online {
    background: #7dd3fc;
    box-shadow: 0 0 10px rgba(125, 211, 252, 0.5);
}

.server-name {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #7dd3fc;
}

.server-description {
    color: #94a3b8;
    font-size: 0.9rem;
    min-height: 60px;
    margin-bottom: 1.5rem;
}

.server-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.online-count {
    text-align: center;
}

.count {
    font-size: 1.8rem;
    font-weight: bold;
    display: block;
    line-height: 1;
}

.label {
    font-size: 0.7rem;
    opacity: 0.8;
}

.version {
    background: rgba(125, 211, 252, 0.1);
    padding: 0.3rem 0.8rem;
    border-radius: 1rem;
    font-size: 0.8rem;
}
</style>