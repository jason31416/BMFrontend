<template>
    <div class="flex-1 flex flex-col select-none h-full">
        <!-- 聊天头部 -->
        <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <button @click="goBack" class="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <div class="relative">
                        <img v-if="chat?.avatar" :src="chat.avatar" :alt="chat.name" class="w-10 h-10 rounded-lg">
                        <div v-else class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span class="text-white font-semibold">{{ chat?.name.charAt(0) }}</span>
                        </div>
                        <div :class="[
                            'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800',
                            getBackendStatusClass(chat?.backendId)
                        ]" :title="getBackendName(chat?.backendId)"></div>
                    </div>
                    <div>
                        <div class="flex items-center space-x-2">
                            <h2 class="font-semibold text-gray-900 dark:text-white select-none">{{ chat?.name }}</h2>
                            <span :class="[
                                'text-xs px-1.5 py-0.5 rounded-full',
                                getBackendBadgeClass(chat?.backendId)
                            ]">
                                {{ getBackendShortName(chat?.backendId) }}
                            </span>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 select-none">{{ groupMembers[chat?.id]?.size || 0 }} 在线 · {{ getBackendName(chat?.backendId) }}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button @click="openGroupMembersModal" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Users class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button @click="$emit('open-menu')" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreVertical class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>
        </div>

        <!-- 消息区域 -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            <MessageBubble v-for="message in messages[chat?.id]" :key="message.id" :message="message" />
        </div>

        <!-- 输入区域 -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="flex items-center space-x-3">
                <input v-model="newMessage" @keypress.enter="sendMessage" type="text" placeholder="输入消息..."
                    class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-gray-200 border-none focus:ring-2 focus:ring-blue-500" />

                <button @click="sendMessage" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Send class="w-5 h-5 text-blue-500" />
                </button>
            </div>
        </div>
        <MemberListModal :show="isMembersModalOpen" :members="currentGroupMembers" @close="closeGroupMembersModal" />
    </div>
</template>

<script setup>
import { ref, nextTick, watch, computed } from 'vue'
import { Plus, Send, MoreVertical, Users, ArrowLeft } from 'lucide-vue-next'
import MessageBubble from './MessageBubble.vue'
import MemberListModal from './MemberListModal.vue'
import { useChatStore } from '../stores/chat';
import { storeToRefs } from 'pinia';
import { backendConfigs, getBackendConnectionStatus } from '../stores/backendConfig.js';

const chatStore = useChatStore();
const { messages, currentChatId, userId, groupMembers, userProfiles, chats } = storeToRefs(chatStore);
const { sendMessage: sendChatMessage, showSidebar } = chatStore;

const props = defineProps({
    chat: Object,
})

const emit = defineEmits(['open-menu'])

const newMessage = ref('')
const messagesContainer = ref(null)
const isMembersModalOpen = ref(false)

const currentGroupMembers = computed(() => {
  if (!props.chat?.id || !groupMembers.value[props.chat.id]) {
    return [];
  }
  return Array.from(groupMembers.value[props.chat.id]).map(id => userProfiles.value[id]).filter(Boolean);
});

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

const sendMessage = () => {
    if (newMessage.value.trim() && props.chat?.id) {
        sendChatMessage(props.chat.id, newMessage.value.trim())
        newMessage.value = ''

        nextTick(() => {
            scrollToBottom()
        })
    }
}

const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

watch(() => messages.value[props.chat?.id], () => {
    nextTick(() => {
        scrollToBottom()
    })
}, { deep: true })

const openGroupMembersModal = () => {
    isMembersModalOpen.value = true;
};

const closeGroupMembersModal = () => {
    isMembersModalOpen.value = false;
};

const goBack = () => {
    showSidebar();
};
</script>
