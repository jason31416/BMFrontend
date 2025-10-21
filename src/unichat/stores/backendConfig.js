import { ref, reactive } from 'vue'

// Backend configuration for different chat systems
// Now each group is essentially its own backend with a specific URL
export const backendConfigs = {
  // Example group configurations - these would be populated from server
  'group1': {
    id: 'group-1',
    apiUrl: 'http://localhost:3000/group-1',
    wsUrl: 'ws://localhost:3000/group-1',
    type: 'default'
  }
}

// Backend connection states
export const backendConnections = reactive({})

// Get backend config for a specific group
export const getBackendForGroup = (groupId) => {
  return backendConfigs[groupId]
}

// Get all available backends (groups)
export const getAvailableBackends = () => {
  return Object.values(backendConfigs)
}

// Update backend configuration
export const updateBackendConfig = (groupId, config) => {
  backendConfigs[groupId] = { ...backendConfigs[groupId], ...config }
}

// Get connection status for a backend
export const getBackendConnectionStatus = (backendId) => {
  const connection = backendConnections[backendId]
  if (!connection) return 'disconnected'
  return connection.status || 'disconnected'
}

// Set connection status for a backend
export const setBackendConnectionStatus = (backendId, status) => {
  if (!backendConnections[backendId]) {
    backendConnections[backendId] = {}
  }
  backendConnections[backendId].status = status
}

// Fetch group info from backend
export const fetchGroupInfo = async (groupId) => {
  try {
    const backend = getBackendForGroup(groupId)
    if (!backend) {
      console.error(`No backend configuration found for group ${groupId}`)
      return null
    }
    
    const response = await fetch(`${backend.apiUrl}/info`)
    if (!response.ok) {
      throw new Error(`Failed to fetch group info: ${response.status}`)
    }
    
    const groupInfo = await response.json()
    
    // Update backend config with fetched info
    updateBackendConfig(groupId, {
      name: groupInfo.displayName || groupInfo.name,
      type: groupInfo.type || 'default'
    })
    
    return groupInfo
  } catch (error) {
    console.error(`Error fetching group info for ${groupId}:`, error)
    return null
  }
}
