<template>
    <div class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col select-none">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
                <h1 class="text-xl font-semibold text-gray-800 dark:text-white select-none">Chat</h1>
                <button @click="$emit('open-settings-menu', $event)" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <MoreVertical class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            <div class="mt-4 relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="搜索"
                    class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-200 border-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>

        <div class="flex-1 overflow-y-auto">
            <div v-for="chat in chats" :key="chat.id" @click="selectChat(chat.id)" :class="[
                'p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors',
                currentChatId === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            ]">
                <div class="flex items-center space-x-3">
                    <div class="relative">
                        <img :src="chat.avatar" :alt="chat.name" class="w-12 h-12 rounded-lg">
                        <div :class="[
                            'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800',
                            getBackendStatusClass(chat.backendId)
                        ]" :title="getBackendName(chat.backendId)"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ chat.name }}</h3>
                                <span :class="[
                                    'text-xs px-1.5 py-0.5 rounded-full',
                                    getBackendBadgeClass(chat.backendId)
                                ]">
                                    {{ getBackendShortName(chat.backendId) }}
                                </span>
                            </div>
                            <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(chat.lastMessage?.timestamp) }}</span>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                            {{ chat.lastMessage?.content || '暂无消息' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Search, MoreVertical } from 'lucide-vue-next'
import { formatTime } from '../utils/dateFormatter'
import { useChatStore } from '../stores/chat';
import { storeToRefs } from 'pinia';
import { backendConfigs, getBackendConnectionStatus } from '../stores/backendConfig.js';

const chatStore = useChatStore();
const { chats, currentChatId, backendConnections } = storeToRefs(chatStore);
const { setCurrentChat } = chatStore;

const selectChat = (chatId) => {
    setCurrentChat(chatId);
};

const getBackendName = (backendId) => {
  return backendConfigs[backendId]?.name || 'Unknown';
};

const getBackendShortName = (backendId) => {
  const backend = backendConfigs[backendId];
  if (!backend) return '?';
  
  switch (backend.type) {
    case 'minecraft': return 'MC';
    case 'discord': return 'DC';
    case 'telegram': return 'TG';
    default: return 'CH';
  }
};

const getBackendStatusClass = (backendId) => {
  const status = getBackendConnectionStatus(backendId);
  switch (status) {
    case 'connected': return 'bg-green-500';
    case 'connecting': return 'bg-yellow-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

const getBackendBadgeClass = (backendId) => {
  const backend = backendConfigs[backendId];
  if (!backend) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  
  switch (backend.type) {
    case 'minecraft': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'discord': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'telegram': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

defineEmits(['open-settings-menu'])
</script>
