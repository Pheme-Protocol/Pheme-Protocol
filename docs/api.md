# Pheme Protocol API Documentation

## Authentication

All API requests require authentication using a valid Web3 wallet signature.

### Headers
```
Authorization: Bearer <wallet_signature>
Content-Type: application/json
```

## Endpoints

### Chat API

#### Send Message
```http
POST /api/chat
```

Request body:
```json
{
  "message": "string",
  "context": {
    "githubUrls": ["string"],
    "skills": ["string"]
  }
}
```

Response:
```json
{
  "id": "string",
  "reply": "string",
  "timestamp": "string"
}
```

#### Get Chat History
```http
GET /api/chat/history
```

Response:
```json
{
  "messages": [
    {
      "id": "string",
      "sender": "string",
      "text": "string",
      "timestamp": "string"
    }
  ]
}
```

### Skill Verification

#### Submit Skills
```http
POST /api/skills/verify
```

Request body:
```json
{
  "skills": ["string"],
  "evidence": {
    "github": ["string"],
    "projects": ["string"]
  }
}
```

Response:
```json
{
  "verificationId": "string",
  "status": "pending",
  "timestamp": "string"
}
```

#### Check Verification Status
```http
GET /api/skills/status/:verificationId
```

Response:
```json
{
  "id": "string",
  "status": "string",
  "skills": ["string"],
  "score": "number",
  "timestamp": "string"
}
```

### Wallet Integration

#### Connect Wallet
```http
POST /api/wallet/connect
```

Request body:
```json
{
  "address": "string",
  "signature": "string",
  "message": "string"
}
```

Response:
```json
{
  "token": "string",
  "expiresAt": "string"
}
```

#### Verify Wallet
```http
POST /api/wallet/verify
```

Request body:
```json
{
  "address": "string",
  "signature": "string"
}
```

Response:
```json
{
  "verified": "boolean",
  "address": "string"
}
```

## Rate Limiting

API requests are rate limited to:
- 60 requests per minute for chat endpoints
- 10 requests per minute for skill verification
- 5 requests per minute for wallet operations

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "string"
  }
}
```

### Common Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 429: Too Many Requests
- 500: Internal Server Error

## Websocket API

### Chat Events
```javascript
// Connect to chat
const ws = new WebSocket('wss://pheme.app/ws/chat')

// Subscribe to messages
ws.onmessage = (event) => {
  const message = JSON.parse(event.data)
  console.log(message)
}

// Send message
ws.send(JSON.stringify({
  type: 'message',
  content: 'Hello Pheme!'
}))
```

## SDK Integration

### JavaScript/TypeScript
```typescript
import { PhemeProtocol } from '@pheme/sdk'

const pheme = new PhemeProtocol({
  apiKey: 'your_api_key',
  network: 'mainnet'
})

// Send chat message
const response = await pheme.chat.send('Verify my smart contract skills')

// Submit skills for verification
const verification = await pheme.skills.verify({
  skills: ['Solidity', 'Web3.js'],
  evidence: {
    github: ['https://github.com/user/project']
  }
})
``` 