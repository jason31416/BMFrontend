<template>
  <div class="relative h-screen overflow-hidden bg-gray-100 dark:bg-gray-900" @click="handleClickOutsideMenu">
    <div class="flex h-full">
      <div :class="['transition-transform duration-300 ease-in-out', isChatAreaVisible ? '-translate-x-full' : 'translate-x-0', 'md:translate-x-0', 'w-full md:w-auto flex-shrink-0']">
        <Sidebar @open-settings-menu="openSettingsMenu" class="w-full md:w-80" />
      </div>
      
      <div class="hidden md:block w-1 h-full cursor-ew-resize bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
           @mousedown="startDrag">
      </div>

      <div :class="['absolute md:relative top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out', isChatAreaVisible ? 'translate-x-0' : 'translate-x-full', 'md:translate-x-0']">
        <ChatArea v-if="currentChat" :chat="currentChat" />
        <div v-else class="flex-1 flex items-center justify-center h-full">
          <div class="text-center">
            <MessageSquare class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">选择一个聊天开始对话</p>
          </div>
        </div>
      </div>
    </div>

    <MenuPopup v-if="showMenu" ref="menuRef" :position="menuPosition" :menu-items="settingsMenuItems" @close="closeMenu" />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useChatStore } from './stores/chat'
import { storeToRefs } from 'pinia'
import Sidebar from './components/Sidebar.vue'
import ChatArea from './components/ChatArea.vue'
import MenuPopup from './components/MenuPopup.vue'
import { MessageSquare, User, Settings, LogOut, Info } from 'lucide-vue-next'

const chatStore = useChatStore()
const { chats, currentChatId, isChatAreaVisible } = storeToRefs(chatStore)

const showMenu = ref(false)
const menuPosition = ref({ x: 0, y: 0 })
const menuRef = ref(null)
const isMenuOpening = ref(false)
const sidebarWidth = ref(320)
const isDragging = ref(false)
const userResizedSidebar = ref(false)

const currentChat = computed(() => chats.value.find(chat => chat.id === currentChatId.value))

const settingsMenuItems = computed(() => [
  { id: 'account', label: '账号设置', icon: User },
  { id: 'chat', label: '聊天设置', icon: Settings },
  { id: 'logout', label: '退出登录', icon: LogOut },
  { id: 'about', label: '关于', icon: Info },
])

const openSettingsMenu = (event) => {
  menuPosition.value = { x: event.clientX, y: event.clientY }
  showMenu.value = true
  isMenuOpening.value = true
  setTimeout(() => {
    isMenuOpening.value = false
  }, 100)
}

const closeMenu = () => {
  showMenu.value = false
}

const handleClickOutsideMenu = (event) => {
  if (isMenuOpening.value) {
    return // Ignore clicks when menu is just opening
  }
  if (showMenu.value && menuRef.value && !menuRef.value.$el.contains(event.target)) {
    closeMenu()
  }
}

const startDrag = (event) => {
  isDragging.value = true
  userResizedSidebar.value = true
  document.addEventListener('mousemove', doDrag)
  document.addEventListener('mouseup', stopDrag)
}

const doDrag = (event) => {
  if (isDragging.value) {
    const newWidth = event.clientX
    const maxSidebarWidth = window.innerWidth * 0.4
    if (newWidth > 230 && newWidth < maxSidebarWidth) {
      sidebarWidth.value = newWidth
    }
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', doDrag)
  document.removeEventListener('mouseup', stopDrag)
}

</script>
