<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 z-40 flex justify-center items-center" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">成员列表</h2>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <X class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      <div class="p-4 max-h-96 overflow-y-auto">
        <ul>
          <li v-for="member in members" :key="member.id" class="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <PlayerAvatar :username="member.name" :size="40" />
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">{{ member.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next';
import PlayerAvatar from './PlayerAvatar.vue';

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  members: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['close']);
</script>