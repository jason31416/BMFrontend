import { ref, computed } from 'vue'

const messages = ref([])

export function useMessages() {
  const addMessage = (type, message, duration = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    
    messages.value.push({
      id,
      type,
      message,
      duration
    })
    
    // Auto-remove after duration + animation time
    setTimeout(() => {
      removeMessage(id)
    }, duration + 1000)
  }

  const removeMessage = (id) => {
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
  }

  const clearMessages = () => {
    messages.value = []
  }

  const messageCount = computed(() => messages.value.length)

  return {
    messages: computed(() => messages.value),
    addMessage,
    removeMessage,
    clearMessages,
    messageCount
  }
}
