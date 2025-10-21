# Multi-Backend Chat Protocol Documentation

## Overview

The chat system has been reorganized to support multiple pre-defined chat backends, where each group is essentially its own backend with a specific URL path. This allows for integration with different chat systems like Minecraft servers, Discord, Telegram, etc., all running on the same server but with different endpoints.

## Protocol Changes

### WebSocket Connection Changes

**Before (Single Backend):**
```javascript
const socket = new WebSocket('ws://localhost:3000?userId=session123');
```

**After (Multiple Backends):**
```javascript
// Each group maintains its own connection with path-based URLs
const groupId = 'group1';
const socket = new WebSocket(`ws://localhost:3000/${groupId}?userId=session123&backend=${groupId}`);
```

### Message Routing

**Before:**
- All messages go through a single WebSocket connection
- Backend handles routing internally

**After:**
- Messages are routed to the appropriate group backend based on URL path
- Each group maintains its own connection state and message queue

### New Message Types

**Backend Status Updates:**
```javascript
{
  type: 'backendStatus',
  payload: {
    backendId: 'group1',
    status: 'connected', // 'connected', 'disconnected', 'error'
    message: 'Connection established'
  }
}
```

## Backend Configuration

### Backend Types

The system supports multiple backend types, with type and display name fetched from each backend:

1. **default** - Default chat backend
2. **minecraft** - Minecraft server integration
3. **discord** - Discord bridge
4. **telegram** - Telegram bridge

### Configuration Structure

```javascript
{
  'group1': {
    id: 'group1',
    name: 'Group 1', // Initial name, can be updated from info endpoint
    apiUrl: 'http://localhost:3000/group1',
    wsUrl: 'ws://localhost:3000/group1',
    type: 'default',
    authRequired: true
  },
  'group2': {
    id: 'group2',
    name: 'Group 2',
    apiUrl: 'http://localhost:3000/group2',
    wsUrl: 'ws://localhost:3000/group2',
    type: 'minecraft',
    authRequired: true
  }
  // ... other groups
}
```

### Info Endpoint

Each backend must implement an info endpoint to provide group metadata:

**Request:**
```
GET /{groupId}/info
```

**Response:**
```javascript
{
  "id": "group1",
  "displayName": "Minecraft Server Chat",
  "type": "minecraft",
  "avatar": "https://example.com/avatar.png",
  "description": "Main Minecraft server chat"
}
```

## Implementation Details

### Connection Management

- Each group maintains its own WebSocket connection with path-based URLs
- Connections are established on-demand when groups are loaded
- Automatic reconnection with exponential backoff
- Independent connection state tracking per group

### Message Flow

1. **Sending Messages:**
   - Determine group backend URL
   - Route message to appropriate WebSocket connection
   - Queue messages if group backend is disconnected

2. **Receiving Messages:**
   - Messages are processed based on group source
   - Group-specific message handling
   - Unified message storage and display

### State Management

- Separate message queues per group backend
- Independent connection states per group
- Group-specific user profiles and members
- Unified UI with backend indicators

## Backend Integration Requirements

### Required Endpoints

Each group backend must implement:

1. **Info API:** `GET /{groupId}/info` - Returns group metadata
2. **Users API:** `GET /{groupId}/users` - Returns group members
3. **User Avatar API:** `GET /{groupId}/avatar/{userId}` - Returns user avatar
4. **WebSocket Interface:** For real-time messaging at `ws://host/{groupId}`

### WebSocket Protocol

Group backends must support:

```javascript
// Message types
{
  type: 'chatMessage',
  payload: { groupId, message }
}

{
  type: 'historyMessages', 
  payload: { groupId, messages }
}

{
  type: 'userEvent',
  payload: { groupId, userId, eventType, userProfile }
}

{
  type: 'backendStatus',
  payload: { backendId, status, message }
}
```

## UI Changes

### Visual Indicators

- **Status Dots:** Color-coded connection status indicators
- **Backend Badges:** Short identifiers (MC, DC, TG, CH)
- **Backend Names:** Full backend names in chat headers
- **Connection Status:** Real-time backend connection monitoring

### User Experience

- Seamless switching between groups from different backends
- Clear indication of which backend each group uses
- Graceful handling of backend connection issues
- Unified message display regardless of backend source

## Migration Guide

### For Existing Backends

1. Update to use path-based URLs (e.g., `/group1` instead of root)
2. Implement the info endpoint to provide group metadata
3. Update API endpoints to use group-specific paths
4. Add support for backend status messages

### For New Group Integration

1. Add group configuration to `backendConfigs` with path-based URLs
2. Implement required API endpoints with group-specific paths
3. Add info endpoint to provide group type and display name
4. Test connection and message flow

## Error Handling

- Backend-specific error messages
- Graceful degradation when backends are unavailable
- Automatic reconnection attempts
- User-friendly error indicators

## Security Considerations

- Backend-specific authentication requirements
- Secure WebSocket connections
- Input validation for all backend communications
- Proper session management across backends
