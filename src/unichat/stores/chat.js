import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import cookies from 'vue-cookies'
import axios from 'axios'
import constant from "../../components/const.vue"
import { 
  backendConfigs, 
  backendConnections, 
  getBackendForGroup, 
  setBackendConnectionStatus,
  fetchGroupInfo
} from './backendConfig.js'

export const useChatStore = defineStore('chat', () => {
  const chats = ref([])
  const messages = reactive({})
  const currentChatId = ref(null)
  const sockets = reactive({}) // Multiple WebSocket connections keyed by backendId
  const socketMessageQueues = reactive({}) // Message queues per backend
  const groupMembers = reactive({})
  const userProfiles = reactive({})
  const userId = ref(null);
  const session = ref(null);
  const isChatAreaVisible = ref(false);

  const connectWebSocket = (backendId = 'default') => {
    const backend = backendConfigs[backendId];
    if (!backend) {
      console.error(`Backend ${backendId} not found`);
      return;
    }

    // Check if already connected
    if (sockets[backendId] && sockets[backendId].readyState === WebSocket.OPEN) {
      return;
    }

    // Initialize message queue for this backend
    if (!socketMessageQueues[backendId]) {
      socketMessageQueues[backendId] = [];
    }

    const wsUrl = `${backend.wsUrl}?userId=${session.value}&backend=${backendId}`;
    sockets[backendId] = new WebSocket(wsUrl);

    sockets[backendId].onopen = () => {
      console.log(`WebSocket连接已建立 (${backend.name})`);
      setBackendConnectionStatus(backendId, 'connected');
      
      // Send queued messages
      while (socketMessageQueues[backendId].length > 0) {
        const message = socketMessageQueues[backendId].shift();
        sockets[backendId].send(message);
      }
    };

    sockets[backendId].onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(`收到WebSocket消息 (${backend.name}):`, data);
      
      // Handle backend-specific message routing
      switch (data.type) {
        case 'chatMessage':
          handleNewMessage(data.payload.groupId, data.payload.message);
          break;
        case 'historyMessages':
          handleHistoryMessages(data.payload.groupId, data.payload.messages);
          break;
        case 'userEvent':
          handleUserEvent(data.payload);
          break;
        case 'backendStatus':
          handleBackendStatus(data.payload);
          break;
        default:
          console.warn(`未知消息类型 (${backend.name}):`, data.type);
      }
    };

    sockets[backendId].onclose = () => {
      console.log(`WebSocket连接已关闭 (${backend.name})，尝试重连...`);
      setBackendConnectionStatus(backendId, 'disconnected');
      setTimeout(() => connectWebSocket(backendId), 3000);
    };

    sockets[backendId].onerror = (error) => {
      console.error(`WebSocket错误 (${backend.name}):`, error);
      setBackendConnectionStatus(backendId, 'error');
      sockets[backendId].close();
    };
  };

  const sendWebSocketMessage = (message, backendId = 'default') => {
    if (sockets[backendId] && sockets[backendId].readyState === WebSocket.OPEN) {
      sockets[backendId].send(JSON.stringify(message));
    } else {
      // Initialize queue if it doesn't exist
      if (!socketMessageQueues[backendId]) {
        socketMessageQueues[backendId] = [];
      }
      socketMessageQueues[backendId].push(JSON.stringify(message));
      
      // Try to connect if not already connecting
      if (!sockets[backendId] || sockets[backendId].readyState === WebSocket.CLOSED) {
        connectWebSocket(backendId);
      }
    }
  };

  const fetchGroups = async () => {
    try {
      // Get all configured groups (backends)
      const availableGroups = Object.keys(backendConfigs);
      
      // Fetch info for each group and create chat entries
      const groupPromises = availableGroups.map(async (groupId) => {
        const backend = getBackendForGroup(groupId);
        if (!backend) return null;
        
        // Fetch group info from backend
        const groupInfo = await fetchGroupInfo(groupId);
        
        return {
          id: groupId,
          name: groupInfo?.displayName || backend.name,
          avatar: groupInfo?.avatar || backend.avatar,
          lastMessage: null,
          backendId: groupId // Each group is its own backend
        };
      });
      
      const groupResults = await Promise.all(groupPromises);
      chats.value = groupResults.filter(Boolean);
      
      // Connect to all groups
      availableGroups.forEach(groupId => {
        connectWebSocket(groupId);
      });
      
    } catch (error) {
      console.error('获取群组列表失败:', error);
    }
  };

  const fetchGroupMembers = async (groupId) => {
    try {
      const backend = getBackendForGroup(groupId);
      const response = await fetch(`${backend.apiUrl}/users`);
      const data = await response.json();
      console.log(`群组 ${groupId} 成员:`, data);
      groupMembers[groupId] = new Set(data.map(u => u.id));
      data.forEach(member => {
        userProfiles[member.id] = { ...userProfiles[member.id], ...member };
        fetchUserAvatar(member.id);
      });
    } catch (error) {
      console.error(`获取群组 ${groupId} 成员失败:`, error);
    }
  };

  const fetchUserAvatar = async (id) => {
    if (userProfiles[id] && (userProfiles[id].avatar || userProfiles[id].color)) return;
    try {
      // For now, use the first available backend for avatars
      // In a real implementation, you might need to determine which backend the user belongs to
      const firstBackend = Object.values(backendConfigs)[0];
      if (!firstBackend) return;
      
      const response = await fetch(`${firstBackend.apiUrl}/avatar/${id}`);
      const data = await response.json();
      userProfiles[id] = { ...userProfiles[id], ...data };
    } catch (error) {
      console.error(`获取用户 ${id} 头像失败:`, error);
    }
  };


  const sendMessage = (groupId, content) => {
    sendWebSocketMessage({
      type: 'chatMessage',
      payload: { content }
    }, groupId);
  };

  const handleNewMessage = (groupId, message) => {
    if (!messages[groupId]) {
      messages[groupId] = [];
    }
    messages[groupId] = [...messages[groupId], message];
    const chat = chats.value.find(c => c.id === groupId);
    if (chat) {
      chat.lastMessage = message;
    }
    if (!userProfiles[message.senderId]) {
      userProfiles[message.senderId] = {
        id: message.senderId,
        name: message.senderName || '未知用户'
      };
    }
    fetchUserAvatar(message.senderId);
  };

  const handleHistoryMessages = (groupId, historyMessages) => {
    messages[groupId] = [...historyMessages];
    historyMessages.forEach(msg => fetchUserAvatar(msg.senderId));
  };

  const handleUserEvent = (payload) => {
    const { groupId, userId, eventType, userProfile } = payload;
    if (!groupMembers[groupId]) {
      groupMembers[groupId] = new Set();
    }
    if (eventType === 'join') {
      groupMembers[groupId].add(userId);
      if (userProfile) {
        userProfiles[userId] = { ...userProfiles[userId], ...userProfile };
      }
      fetchUserAvatar(userId);
    } else if (eventType === 'leave') {
      groupMembers[groupId].delete(userId);
    }
  };

  const setCurrentChat = (chatId) => {
    currentChatId.value = chatId;
    if (chatId) {
      fetchGroupMembers(chatId);
      if (window.innerWidth < 768) {
        isChatAreaVisible.value = true;
      }
    }
  };

  const showSidebar = () => {
    isChatAreaVisible.value = false;
  };

  const handleBackendStatus = (payload) => {
    const { backendId, status, message } = payload;
    console.log(`Backend ${backendId} status: ${status} - ${message}`);
    setBackendConnectionStatus(backendId, status);
  };

  const init = () => {
    if (cookies.isKey("ua.sid")) {
      axios.post(constant.uniauthurl + "/webapi/validate", {
        token: cookies.get("ua.sid")
      }).then(res => {
        console.log(res.data)
        if (res.data["success"] == true) {
          userId.value = res.data["username"]
          session.value = cookies.get("ua.sid")
          constant.username.value = res.data["username"]

          fetchGroups();
        } else {
          cookies.remove("ua.sid")
          document.location = "/auth/login"
        }
      })
    } else {
      document.location = "/auth/login"
    }
  };

  init();

  return {
    chats,
    messages,
    currentChatId,
    groupMembers,
    userProfiles,
    userId,
    isChatAreaVisible,
    setCurrentChat,
    sendMessage,
    fetchGroups,
    fetchGroupMembers,
    fetchUserAvatar,
    showSidebar,
    backendConnections,
    getBackendForGroup
  }
})
