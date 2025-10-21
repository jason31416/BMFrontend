<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['error', 'success'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 5000 // 5 seconds default
  },
  id: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const isVisible = ref(false)
const progress = ref(100)
const isClosing = ref(false)

const messageStyles = computed(() => {
  const baseStyles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-600',
      progress: 'bg-red-400'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      progress: 'bg-green-400'
    }
  }
  return baseStyles[props.type]
})

onMounted(() => {
  // Animate in
  setTimeout(() => {
    isVisible.value = true
  }, 10)

  // Start progress bar
  const interval = 50
  const steps = props.duration / interval
  const decrement = 100 / steps

  const progressInterval = setInterval(() => {
    progress.value -= decrement
    if (progress.value <= 0) {
      clearInterval(progressInterval)
      closeMessage()
    }
  }, interval)
})

function closeMessage() {
  if (isClosing.value) return
  
  isClosing.value = true
  isVisible.value = false
  
  // Wait for animation to complete before emitting close
  setTimeout(() => {
    emit('close', props.id)
  }, 300)
}

function handleCloseClick() {
  alert("saw u clicked!")
  closeMessage()
}
</script>

<template>
    <div :class="[
      'message-box fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md transition-all duration-300 ease-out',
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
      isClosing ? '-translate-y-full opacity-0' : ''
    ]" onclick="handleCloseClick()">
        <div :class="[
        'rounded-lg shadow-lg border mx-4 mt-4 overflow-hidden',
        messageStyles.bg,
        messageStyles.border
      ]">
            <div class="py-3 px-4 flex items-start justify-between">
                <div class="flex items-start space-x-3">

                    <!-- Message -->
                    <p :class="['text-sm font-medium flex-1', messageStyles.text]">
                        {{ message }}
                    </p>
                </div>

                <!-- Close Button -->
                <button :class="[
            'flex-shrink-0 ml-4 p-1 rounded-full hover:bg-opacity-20 transition-colors duration-200',
            type === 'error' ? 'hover:bg-red-200' : 'hover:bg-green-200'
          ]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Progress Bar -->
            <div class="h-1">
                <div :class="[
            'h-full transition-all duration-50 ease-linear',
            messageStyles.progress
          ]" :style="{ width: `${progress}%` }"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.message-box {
  will-change: transform, opacity;
}
</style>
