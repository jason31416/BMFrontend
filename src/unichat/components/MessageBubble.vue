<template>
  <div :class="['flex items-start my-2', isOwn ? 'justify-end' : 'justify-start']">
    <div :class="['flex', isOwn ? 'flex-row-reverse' : 'flex-row']">
      <PlayerAvatar :username="message.senderName" :size="32" :class="[isOwn ? 'ml-3' : 'mr-3']" />

      <div class="flex flex-col" :class="[isOwn ? 'items-end' : 'items-start']">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {{ message.senderName || '未知用户' }}
        </div>
        
        <div class="group flex items-end" :class="[isOwn ? 'flex-row-reverse' : 'flex-row']">
          <div class="relative max-w-xs lg:max-w-md px-3 py-2 rounded-lg"
              :class="[isOwn ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none']">
              <p class="text-sm break-words">{{ message.content }}</p>
          </div>
          <div class="text-xs text-gray-400 dark:text-gray-500 mx-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {{ formattedTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useChatStore } from '../stores/chat';
import { storeToRefs } from 'pinia';
import { formatTime } from '../utils/dateFormatter';
import PlayerAvatar from './PlayerAvatar.vue';

const chatStore = useChatStore();
const { userId } = storeToRefs(chatStore);

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
});

const isOwn = computed(() => {
  return props.message.senderId === userId.value;
});


const formattedTime = computed(() => {
  return formatTime(props.message.timestamp);
});
</script>
