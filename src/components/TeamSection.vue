components/TeamSection.vue
<template>
    <section class="team-section">
        <h2 ref="title" class="section-title">我们的团队</h2>
        <div class="team-grid">
            <div v-for="(member, index) in team" :key="member.name" ref="members" class="team-member">
                <img :src="member.avatar" class="member-avatar">
                <h3 class="team-text">{{ member.name }}</h3>
                <p class="team-text">{{ member.role }}</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
    team: Array
})

const title = ref(null)
const members = ref([])

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate')
            }
        })
    }, { threshold: 0.1 })

    observer.observe(title.value)
    members.value.forEach(member => observer.observe(member))
})
</script>

<style scoped>
.team-section {
    padding: 5rem 5%;
    text-align: center;
}

.section-title {
    font-size: 2.5rem;
    margin-bottom: 5rem;
    opacity: 0;
    transform: translateY(20px);
    transition: 0.8s;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
}

.team-member {
    background: rgba(45, 55, 72, 0.5);
    padding: 2rem;
    margin-top: 6rem;
    border-radius: 1rem;
    transition: 0.3s;
    opacity: 0;
    transform: translateY(20px);
}

.team-member:hover {
    transform: translateY(-5px);
}

.team-text {
    position: relative;
    left: 30%;
}

.member-avatar {
    width: 300px;
    height: 400px;
    border-radius: 50%;
    position: absolute;
    clip: rect(0px, 600px, 300px, 0px);
    bottom: -100px;
    left: 0;
}

.animate {
    opacity: 1 !important;
    transform: translateY(0) !important;
}
</style>