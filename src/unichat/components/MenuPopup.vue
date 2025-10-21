<template>
  <div
    ref="menuRef"
    class="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-48"
    :style="adjustedPosition">
    <div class="py-1">
      <button v-for="item in menuItems" :key="item.id" @click="handleMenuItemClick(item)"
        class="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
        <component :is="item.icon" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span>{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  User,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Archive
} from 'lucide-vue-next'

const menuRef = ref(null)

const emit = defineEmits(['close'])

const props = defineProps({
  position: Object
})

const adjustedPosition = computed(() => {
  if (!menuRef.value) {
    return {
      left: `${props.position.x}px`,
      top: `${props.position.y}px`
    }
  }

  const menuWidth = menuRef.value.offsetWidth
  const menuHeight = menuRef.value.offsetHeight
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let newX = props.position.x
  let newY = props.position.y

  if (newX + menuWidth > viewportWidth) {
    newX = viewportWidth - menuWidth - 10
  }
  if (newX < 0) {
    newX = 10
  }

  if (newY + menuHeight > viewportHeight) {
    newY = viewportHeight - menuHeight - 10
  }
  if (newY < 0) {
    newY = 10
  }

  return {
    left: `${newX}px`,
    top: `${newY}px`
  }
})

const menuItems = [
  { id: 1, label: '设置', icon: Settings },
  { id: 2, label: '关于', icon: HelpCircle },
  { id: 3, label: '退出登录', icon: LogOut }
]

const handleMenuItemClick = (item) => {
  console.log('Menu item clicked:', item.label)
  emit('close')
}
</script>

