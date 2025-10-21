<template>
    <div class="content">
        <Navbar />

        <main class="container">
            <section id="about" class="section">
                <div class="hero-grid">
                    <div class="hero-text">
                        <h2 class="heading">Jason31416</h2>
                        <p class="subheading">一只会点开发的屑高中牲~</p>
                        <p class="subsubheading"><del>作为咱网站的开发者，夹带点私货很正常叭awa!</del></p>

                        <ul class="info-list">
                            <li>
                                <i class="fas fa-gamepad"></i>
                                <span>独立游戏开发者</span>
                            </li>
                            <li>
                                <i class="fas fa-globe"></i>
                                <span>来自杭州</span>
                            </li>
                            <li>
                                <i class="fas fa-map-marker-alt"></i>
                                <span>现居北京</span>
                            </li>
                            <li>
                                <i class="fas fa-code"></i>
                                <span>Github (Old projects): <a
                                        href="https://github.com/jason31416">github.com/jason31416</a></span>
                            </li>
                            <li>
                                <i class="fas fa-faucet"></i>
                                <span>SpigotMC: <a
                                        href="https://www.spigotmc.org/members/jason31416.1463619/">spigotmc.org/members/1463619</a></span>
                            </li>
                        </ul>
                    </div>
                    <div class="profile-image">
                        <img src="/jason31416.png" class="member-avatar">
                    </div>
                </div>
            </section>

            <section id="projects" class="section">
                <h3 class="section-title">参与项目</h3>
                <div class="projects-grid">
                    <div v-for="project in projects" :key="project.title" class="project-card">
                        <div class="project-header">
                            <i class="fas fa-code"></i>
                            <h4>{{ project.title }}</h4>
                        </div>
                        <p class="project-description">{{ project.description }}</p>
                        <div class="tech-stack">
                            <span v-for="tech in project.tech" :key="tech" class="tech-pill">{{ tech }}</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <FooterSection />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Navbar from './Navbar.vue';
import FooterSection from './FooterSection.vue';

const projects = ref([
    {
        title: 'Block-Max Network',
        description: '集生存、RPG、小游戏等多元玩法于一体，无论你是建筑大师、冒险家还是生电工程师，都能找到属于自己的乐趣。从休闲娱乐到硬核挑战，从单人探索到团队协作——这里总有一方天地适合你！',
        tech: ['Minecraft', 'Java', 'MySQL', 'Vue.js']
    },
    {
        title: 'Bumps!',
        description: '通过直观的拖拽操作和智能指令系统，让你轻松调兵遣将，专注策略博弈。游戏包含多样化的兵种搭配、科技升级和地形战术，每场战斗都是全新的智力挑战。无论是闪电突袭还是持久消耗，都能体验运筹帷幄的快感。用最简洁的方式，享受最纯粹的战略乐趣！',
        tech: ['Python', 'Pygame', 'RTS']
    },
    {
        title: 'BetterNations',
        description: '这款插件让玩家在Minecraft中组建国家，发展经济，并与其他玩家展开外交、结盟或战争。你可以招募军队、建造防御工事，甚至发动入侵，体验真实的治国与征战乐趣。无论是和平发展还是铁血扩张，BetterNations都能让你的服务器玩法更丰富、竞争更激烈！',
        tech: ['Java', 'Bukkit', 'CivSim']
    }
]);
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
:root {
    --primary: #38bdf8;
    --secondary: #1e293b;
    --background: #0f172a;
    --text: #e2e8f0;
}

body {
    background: var(--background);
    color: var(--text);
    margin: 0;
    font-family: 'Poppins', sans-serif;
    line-height: 1.6;
}

.container {
    width: 85%;
    max-width: 1200px;
    margin: 0 auto;
}

.navbar {
    padding: 1.5rem 0;
    border-bottom: 1px solid #1e293b;
}

.logo {
    font-weight: 700;
    color: var(--primary);
    margin: 0;
    font-size: 1.5rem;
}

.nav-links {
    display: flex;
    gap: 2rem;
}

a {
    color: var(--text);
    text-decoration: none;
    transition: color 0.3s ease;
}

a:hover {
    color: var(--primary);
}

.hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    padding: 4rem 0;
}

.heading {
    font-size: 2.5rem;
    margin: 0 0 1rem;
    line-height: 1.2;
}

.subheading {
    font-size: 1.2rem;
    color: #94a3b8;
    margin-bottom: -0.2rem;
}
.subsubheading {
    font-size: 0.7rem;
    color: #94a3b8;
    margin-bottom: 2rem;
}

.info-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.member-avatar {
    width: 300px;
    height: 400px;
    border-radius: 50%;
    clip: rect(0px, 600px, 300px, 0px);
    bottom: -100px;
    left: 0;

    position: relative;

    transform: scale(1.5);
    animation: awa 0.7s ease;
}
.info-list li {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #1e293b;
    border-radius: 8px;
}

.info-list i {
    color: var(--primary);
    font-size: 1.2rem;
    width: 30px;
    text-align: center;
}

.profile-image {
    position: relative;
    display: flex;
    justify-content: center;
    border-radius: 1rem;
    overflow: hidden;
    height: 400px;
    background: #1e293b;
    border-radius: 1rem;
}

.section {
    padding: 4rem 0;
}

.section-title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 3rem;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.project-card {
    background: #1e293b;
    padding: 1.5rem;
    border-radius: 12px;
    transition: transform 0.3s ease;
}

.project-card:hover {
    transform: translateY(-5px);
}

.project-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.project-header i {
    color: var(--primary);
    font-size: 1.5rem;
}

.project-description {
    color: #94a3b8;
    min-height: 80px;
}

.tech-pill {
    display: inline-block;
    background: #334155;
    color: var(--primary);
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    margin: 0.3rem;
}

.footer {
    background: #1e293b;
    padding: 3rem 0;
    margin-top: 4rem;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.social-links {
    display: flex;
    gap: 1.5rem;
}

.social-links a {
    color: var(--text);
    font-size: 1.5rem;
    transition: color 0.3s ease;
}

.social-links a:hover {
    color: var(--primary);
}

.author-note {
    color: #94a3b8;
    margin: 0;
}

@media (max-width: 768px) {
    .hero-grid {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .nav-links {
        display: none;
    }

    .projects-grid {
        grid-template-columns: 1fr;
    }
}

@keyframes awa {
    from {
        transform: translateY(200px) scale(1.5);
        opacity: 0.6;
    }
    to {
        transform: translateY(0) scale(1.5);
        opacity: 1;
    }
}
</style>