<template>
    <NavBar :visible="navVisible" />
    <main class="chat-main">
        <div class="sidebar">
            <div class="server-status-panel" v-if="showSidebar">
                <div v-for="server in servers" :key="server.name" class="server-card">
                    <div class="server-header">
                        <div class="status-indicator" :class="{ running: server.status }"></div>
                        <h3>{{ server.name }} <span class="online-count">在线 {{ server.players.length }}</span></h3>
                        <button class="collapse-btn" @click="server.collapsed = server.players.length > 0 ?!server.collapsed:true">
                            <svg :class="{ rotated: !server.collapsed }" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                    </div>
                    <transition name="slide">
                        <div class="player-list-container" v-show="!server.collapsed">
                            <div class="player-list">
                                <transition-group name="player">
                                    <div v-for="player in server.players" :key="player.id" class="player-item"
                                        :class="player.state">
                                        <a :href="'/user/' + player.name" class="player-name">{{ player.name }}</a>
                                    </div>
                                </transition-group>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <!-- <div class="channel-selector">
                <button v-on:click="setChannel('global')" :class="{ active: selectedChannel == 'global' }">
                    Global
                </button>
                <button v-on:click="setChannel('Webchat')" :class="{ active: selectedChannel == 'Webchat' }">
                    Webchat
                </button>
                <button v-for="server in servers" :key="server.name" v-on:click="setChannel(server.name)"
                    :class="{ active: selectedChannel == server.name }">
                    {{ server.name }}
                </button>
            </div>
        </div> -->
        <div class="chat-container" ref="chatContainer" @scroll="handleScroll">
            <div class="loading-indicator" v-if="loading" :class="{ loading }">
                <div class="loading-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>

            <transition-group name="message" tag="div" class="messages">
                <div v-for="message in messages" :class="{ 'selfMessage': message.username == constant.username.value }"
                    :key="message.id" class="message"
                    :hidden="message.server != selectedChannel && selectedChannel != 'global'">
                    <div class="message-header">
                        <span class="systemmessage" v-if="message.type =='server'">{{ message.content }}</span>
                        <a class="username" v-if="message.type!='server'" :href="'/user/' + message.username">{{
                            message.username }}</a>
                        <span class="timestamp">{{ formatTimestamp(message.createdAt) }} <span
                                v-if="message.type !='server'">@ {{ message.server }}</span></span>
                    </div>
                    <p v-if="message.type != 'server'" class="message-content">{{ message.content }}</p>
                </div>
            </transition-group>
        </div>
    </main>
    <div class="input-wrapper" v-if="loggedin">
        <input type="text" placeholder="输入消息..." rows="1" v-model="textinput" maxlength="128" class="message-input">
        <button class="send-button" v-on:click="sendMessage()">
            <svg fill="#ffffff" height="30px" width="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 495.003 495.003" xml:space="preserve">
                <g id="XMLID_51_">
                    <path id="XMLID_53_" d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616
		l-67.6-32.22V456.687z" />
                    <path id="XMLID_52_" d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422
		c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414
		l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956
		L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z" />
                </g>
            </svg>
        </button>
    </div>
    <div class="input-wrapper" v-if="!loggedin">
        <input type="text" placeholder="登录后方可发送消息!" disabled rows="1" v-model="textinput" maxlength="128"
            class="message-input">
    </div>
</template>

<style>
@font-face {
    font-family: 'fzxs';
    src: url('/FZXIANGSU12.TTF') format('truetype');
}

body {
    background: #1a365d;
    color: #e2e8f0;
    height: 100%;
    margin: 0;
    font-family: 'Poppins', sans-serif;
    overflow: hidden;
}
.channel-selector {
    display: flex;
    gap: 12px;
    margin-top: 1rem;
    top: 0;
    z-index: 1000;
    max-width: 280px;
    flex-wrap: wrap;
}

.channel-selector button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    color: #fff;
    background: #145682;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
}

.channel-selector button:hover {
    background: #3498db;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.channel-selector button.active {
    color: white;
    background: #3498db;
    box-shadow: 0 4px 6px -1px rgba(52, 152, 219, 0.3);
}

.channel-selector button.active::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 3px;
    background: #3498db;
    border-radius: 2px;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        width: 0;
        opacity: 0;
    }

    to {
        width: 60%;
        opacity: 1;
    }
}

.chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    height: calc(100vh - 90px);
}

.chat-container {
    flex: 1;
    padding: 0 1rem;
    margin-top: 5rem;
    overflow: auto;
    border-radius: 5px;
    /* backdrop-filter: blur(10px); */
    font-family: 'fzxs';
    padding-left: 10%;
    width: 80%;
}

.messages {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.message {
    background: #ffffff11;
    padding: 1.2rem;
    border-radius: 14px;
    color: #f8fafc;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.selfMessage .username {
    color: #7bfd5e;
}

.message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.systemmessage {
    color: #fdf473;
}

.username {
    font-weight: 600;
    color: #7dd3fc;
    font-size: 0.95rem;
    letter-spacing: 0.5px;
    text-decoration: none;
    transition: color 0.2s ease;
}
.username:hover {
    color: #268fff;
}

.timestamp {
    color: #94a3b8;
    font-size: 0.8rem;
    font-family: Monaco, Consolas, 'Courier New', monospace;
}

.message-content {
    margin-top: 0.8rem;
    color: #e2e8f0;
    line-height: 1.5;
    font-size: 0.95rem;
    letter-spacing: 0.2px;
    max-width: fit-content;
    word-wrap: break-word;
}

.input-wrapper {
    position: fixed;
    width: 60%;
    box-sizing:border-box;
    height: 50px;
    left: 20%;
    bottom: 2rem;
    /* background: #0f172a; */
    padding: 1rem;
    border-top: 1px solid #1e293b;
}

.message-input {
    width: calc(90% - 60px);
    background: #ffffff11;
    border: 2px solid #00000055;
    border-radius: 12px;
    padding: 1rem 4.5rem 1rem 1.5rem;
    color: #f8fafc;
    font-size: 1rem;
    font-family: 'fzxs',
        'Poppins',
        sans-serif;
}
.message-input:focus {
    outline: none;
}

.send-button {
    position: absolute;
    background: #2196F3;
    border: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;
    margin-left: 10px;
}

.send-button:hover {
    background: #1976D2;
}

.message-enter-active {
    animation: messageIn 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
}

@keyframes messageIn {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.message:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Scrollbar styling */
.chat-container::-webkit-scrollbar {
    width: 6px;
}

.chat-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}

.chat-container::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 3px;
}

.loading-indicator {
    position: fixed;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    transition: top 0.3s ease-out;
    z-index: 1000;
}

.loading-indicator.loading {
    top: 20px;
}

.loading-spinner {
    width: 30px;
    height: 30px;
    position: relative;
}

.loading-spinner div {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 5px solid transparent;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.loading-spinner div:nth-child(2) {
    border-top-color: #3498db;
    animation-delay: -0.1s;
}

.loading-spinner div:nth-child(3) {
    border-top-color: #3498db;
    animation-delay: -0.2s;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.sidebar {
    position: fixed;
    left: 20px;
    top: 120px;
}

.server-status-panel {
    width: 250px;
    background: #ffffff11;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 15px;
    z-index: 1000;
    transition: transform 0.3s ease;
}

.server-card {
    margin-bottom: 20px;
}

.server-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e74c3c;
    margin-right: 10px;
    transition: background 0.3s ease;
}

.status-indicator.running {
    background: #2ecc71;
}

.player-list {
    max-height: 200px;
    overflow-y: auto;
}
.server-header h3 {
    margin: 5px;
}
.online-count {
    color: #94a3b8;
}

.player-item {
    padding: 8px 12px;
    margin: 4px 0;
    background: #e6f3ff;
    color: #000;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.player-name {
    font-weight: 600;
    color: #000;
    text-decoration: none;
    transition: color 0.2s ease;
    font-family: 'fzxs', 'Poppins', sans-serif;
}

.player-name:hover {
    color: #268fff;
}

/* Player animations */
.player-enter-active,
.player-leave-active {
    transition: all 0.3s ease;
}

.player-enter-from {
    opacity: 0;
}

.player-leave-to {
    opacity: 0;
}
/* Style additions */
.server-header {
    position: relative;
    padding-right: 30px;
}

.collapse-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.collapse-btn:hover {
    opacity: 0.8;
}

.collapse-btn svg {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.collapse-btn .rotated {
    transform: rotate(180deg);
}

.player-list-container {
    border: 1px solid #3498db33;
    border-radius: 8px;
    margin-top: 8px;
    overflow: hidden;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease-in-out;
    max-height: 400px;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    max-height: 0;
}

.player-list {
    max-height: 200px;
    overflow-y: auto;
    padding: 8px;
    background: #ffffff08;
}
</style>

<script setup>

import NavBar from '/src/components/Navbar.vue'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import axios from 'axios';
import constant from "./const.vue"
import cookies from 'vue-cookies'
import Navbar from './Navbar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const servers = ref([]);

const chatContainer = ref(null);
const messages = ref([]);
const loading = ref(false);
const noMoreMessages = ref(false);
const updateInterval = ref(null);
const lastUpdate = ref(null);
const navVisible = ref(true);
const loggedin = ref(false);
const selectedChannel = ref("global");
var textinput = ref("");

const showSidebar = ref(true);

const fetchMessages = async (before) => {
    if (loading.value || noMoreMessages.value) return;

    loading.value=true;
    try {
        const params = { limit: 15 };
        if (before) params.before = before;

        const response = await axios.get(constant.backendurl+'/api/messages', { params });
        if (response.data.length === 0) {
            noMoreMessages.value = true;
            return;
        }

        if (before) {
            const container = chatContainer.value;
            const oldScrollHeight = container.scrollHeight;
            messages.value.unshift(...response.data.reverse());
            await nextTick();
            container.scrollTop = container.scrollHeight - oldScrollHeight;
        } else {
            const container = chatContainer.value;
            const oldScrollHeight = container.scrollHeight;
            messages.value = response.data.reverse();
            await nextTick();
            container.scrollTop = container.scrollHeight - oldScrollHeight;
        }
    } finally {
        loading.value = false;
    }
};

const handleScroll = () => {
    const container = chatContainer.value;
    if (container.scrollTop < 100 && !loading.value) {
        const oldestMessage = messages.value[0];
        if (oldestMessage) {
            fetchMessages(oldestMessage.createdAt);
        }
    }
};

const startUpdateInterval = () => {
    updateInterval.value = setInterval(async () => {
        try {
            const params = { limit: 15 };
            params.after = messages.value[messages.value.length - 1].createdAt;

            const response = await axios.get(constant.backendurl+'/api/messages', { params });
            if (response.data.length > 0) {
                const container = chatContainer.value;
                messages.value.push(...response.data);
                lastUpdate.value = messages.value[messages.value.length-1].createdAt;
                // if the user is at the bottom of the chat, scroll to the bottom
                if (container.scrollTop + container.offsetHeight >= container.scrollHeight - 100) {
                    await nextTick();
                    container.scrollTop = container.scrollHeight;
                }
            }
        } catch (error) {
            console.error('Failed to fetch updates:', error);
        }
    }, 1000);
};

const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
};

onMounted(() => {
    if (window.innerWidth < 1300) showSidebar.value = false;
    if (cookies.isKey("bmsessiontoken")) {
        loggedin.value = true;
    }
    loading.value=true;
    setTimeout(()=>{
        loading.value=false;
        fetchMessages();
    }, 200);
    startUpdateInterval();
    setTimeout(fetchServerStatus, 200);
    setInterval(()=>{
        fetchServerStatus();
    }, 5000);
});

onBeforeUnmount(() => {
    if (updateInterval.value) {
        clearInterval(updateInterval.value);
    }
})
function sendMessage() {
    axios.post(constant.backendurl + "/api/sendchat", {
        token: cookies.get("bmsessiontoken"),
        message: textinput.value
    }).then(res => {
        if (res.data["success"] == true) {
            textinput.value = "";
        }
    })
}

function addPlayer(serverName, playerName) {
    const server = servers.value.find(s => s.name === serverName);
    if (server) {
        const newPlayer = {
            id: Date.now(),
            name: playerName,
            state: 'enter'
        };
        server.players.push(newPlayer);
    }
}

function removePlayer(serverName, playerName) {
    const server = servers.value.find(s => s.name == serverName);
    if (server) {
        const player = server.players.find(p => p.name == playerName);
        if (player) {
            player.state = 'exit';
            setTimeout(() => {
                server.players = server.players.filter(p => p.name != playerName);
            }, 300);
        }
    }
}

function setChannel(channel){
    selectedChannel.value = channel;
    for(var i=0;i<10;i++){
        nextTick(() => {
            const oldestMessage = messages.value[0];
            fetchMessages(oldestMessage.createdAt);
        });
    }
}

const fetchServerStatus = async () => {
    try {
        axios.get(constant.backendurl+'/api/serverstatus').then(res => {
            const apiData = res.data;
            console.log(apiData);

            apiData.forEach(apiServer => {
                const localServer = servers.value.find(s => s.name === apiServer.name);
                if (!localServer){
                    servers.value.push({
                        name: apiServer.name,
                        status: apiServer.status,
                        players: [],
                        collapsed: true,
                        lastChecked: new Date().toISOString()
                    });
                    if (apiServer.status) apiServer.players.forEach(player => {
                        addPlayer(apiServer.name, player);
                    });
                    return;
                }
                
                // Update server status
                localServer.status = apiServer.status;
                localServer.lastChecked = new Date().toISOString();
                if(apiServer.players.length == 0) collapseServer(localServer.name);
                if(!apiServer.status) return;

                // Create ID maps for comparison
                const currentPlayers = new Set(localServer.players.map(p => p.name));
                const newPlayers = new Set(apiServer.players);

                // Add new players with animation
                apiServer.players.forEach(player => {
                    if (!currentPlayers.has(player)) {
                        addPlayer(localServer.name, player);
                    }
                });

                // Remove disappeared players with animation
                localServer.players.forEach(localPlayer => {
                    if (!newPlayers.has(localPlayer.name)) {
                        removePlayer(localServer.name, localPlayer.name);
                    }
                });
            });
        });
    } catch (error) {
        console.error('Server status update failed:', error);
    }
};
</script>