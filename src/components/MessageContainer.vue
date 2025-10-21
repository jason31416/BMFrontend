<script setup>
import { useMessages } from '../composables/useMessages.js'
import MessageBox from './MessageBox.vue'

const { messages, removeMessage } = useMessages()
</script>

<template>
  <div class="message-container fixed top-0 left-0 right-0 z-50">
    <div class="relative">
      <MessageBox
        v-for="message in messages"
        :key="message.id"
        :id="message.id"
        :type="message.type"
        :message="message.message"
        :duration="message.duration"
        @close="removeMessage"
      />
    </div>
  </div>
</template>

<style scoped>
.message-container {
  pointer-events: none;
}
</style>
