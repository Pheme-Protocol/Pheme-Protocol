# 🔌 API Specification

> 🔗 **Related**: See [Architecture Guide](../get-started/03-architecture.md) for system overview.

## API Overview

AURA Protocol provides both REST and GraphQL APIs for interacting with the platform. The APIs enable skill wallet management, task validation, guild operations, and analytics.

### Base URLs
- **Production**: `https://api.aurabot.xyz`
- **Staging**: `https://api.staging.aurabot.xyz`
- **Development**: `http://localhost:4000`

## Authentication

### Web3 Authentication
```typescript
interface AuthChallenge {
    message: string;
    timestamp: number;
    nonce: string;
}

interface AuthResponse {
    token: string;
    expiresIn: number;
}
```

### Authentication Flow
1. Request challenge
2. Sign message with wallet
3. Verify signature
4. Receive JWT token

### Example
```typescript
// 1. Get challenge
const challenge = await fetch('/auth/challenge', {
    method: 'POST',
    body: JSON.stringify({ address: userAddress })
});

// 2. Sign message
const signature = await signer.signMessage(challenge.message);

// 3. Verify and get token
const auth = await fetch('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({
        address: userAddress,
        signature,
        nonce: challenge.nonce
    })
});
```

## REST API

### Skill Wallet Endpoints

#### Get Wallet
```http
GET /api/v1/wallets/:address
Authorization: Bearer <token>
```

Response:
```json
{
    "id": "1234",
    "owner": "0x...",
    "level": 5,
    "experience": "1000",
    "badges": [
        {
            "id": "1",
            "type": "CONTRIBUTOR",
            "awardedAt": "1234567890"
        }
    ]
}
```

#### Update Experience
```http
POST /api/v1/wallets/:id/experience
Authorization: Bearer <token>
Content-Type: application/json

{
    "amount": "100",
    "reason": "Task completion",
    "taskId": "789"
}
```

### Task Management

#### Create Task
```http
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Implement Feature",
    "description": "Add new functionality",
    "reward": "100",
    "guildId": "123",
    "requirements": {
        "minLevel": 3,
        "skills": ["solidity", "typescript"]
    }
}
```

#### Submit Task
```http
POST /api/v1/tasks/:id/submit
Authorization: Bearer <token>
Content-Type: application/json

{
    "submission": {
        "content": "PR: #123",
        "evidence": "https://github.com/...",
        "notes": "Completed all requirements"
    }
}
```

### Guild Operations

#### Create Guild
```http
POST /api/v1/guilds
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "DeFi Builders",
    "description": "Building DeFi protocols",
    "requirements": {
        "minLevel": 5,
        "skills": ["defi", "solidity"]
    }
}
```

#### Join Guild
```http
POST /api/v1/guilds/:id/join
Authorization: Bearer <token>
```

## GraphQL API

### Schema Overview
```graphql
type Query {
    wallet(address: String!): SkillWallet
    wallets(filter: WalletFilter): [SkillWallet!]!
    guild(id: ID!): Guild
    guilds(filter: GuildFilter): [Guild!]!
    tasks(filter: TaskFilter): [Task!]!
}

type Mutation {
    createTask(input: CreateTaskInput!): Task!
    submitTask(id: ID!, submission: SubmissionInput!): TaskSubmission!
    createGuild(input: CreateGuildInput!): Guild!
    joinGuild(id: ID!): GuildMember!
}

type Subscription {
    taskCreated: Task!
    taskCompleted: Task!
    guildMemberJoined(guildId: ID!): GuildMember!
}
```

### Query Examples

#### Get User Profile
```graphql
query GetProfile($address: String!) {
    wallet(address: $address) {
        id
        level
        experience
        badges {
            id
            type
            awardedAt
        }
        guilds {
            id
            name
            role
        }
        tasks {
            completed
            inProgress
            validated
        }
    }
}
```

#### Guild Analytics
```graphql
query GuildStats($guildId: ID!) {
    guild(id: $guildId) {
        name
        memberCount
        taskStats {
            total
            completed
            inProgress
        }
        topContributors {
            member {
                address
                level
            }
            contributions
        }
    }
}
```

## Websocket Events

### Event Types
```typescript
interface WebSocketEvents {
    TASK_CREATED: 'task.created';
    TASK_UPDATED: 'task.updated';
    TASK_COMPLETED: 'task.completed';
    GUILD_MEMBER_JOINED: 'guild.member.joined';
    EXPERIENCE_GAINED: 'experience.gained';
    BADGE_AWARDED: 'badge.awarded';
}
```

### Connection Example
```typescript
const ws = new WebSocket('wss://api.aurabot.xyz/ws');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
        case 'task.completed':
            handleTaskCompletion(data.payload);
            break;
        case 'experience.gained':
            updateExperience(data.payload);
            break;
    }
};
```

## Rate Limiting

### Limits
| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| Authentication | 10 | 1 minute |
| GET requests | 100 | 1 minute |
| POST requests | 50 | 1 minute |
| GraphQL queries | 200 | 1 minute |
| WebSocket messages | 60 | 1 minute |

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Error Handling

### Error Format
```typescript
interface APIError {
    code: string;
    message: string;
    details?: Record<string, any>;
    path?: string[];
}
```

### Common Error Codes
| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `INVALID_TOKEN` | Invalid or expired token |
| `RATE_LIMITED` | Rate limit exceeded |
| `INVALID_INPUT` | Invalid request parameters |
| `NOT_FOUND` | Resource not found |
| `FORBIDDEN` | Insufficient permissions |

### Error Example
```json
{
    "error": {
        "code": "INVALID_INPUT",
        "message": "Invalid task submission",
        "details": {
            "evidence": "Required field missing",
            "content": "Must be less than 1000 characters"
        }
    }
}
```

## API Versioning

### Version Format
- URL Path: `/api/v1/...`
- Header: `Accept: application/vnd.aura.v1+json`

### Deprecation
```http
Deprecation: true
Sunset: Sat, 31 Dec 2024 23:59:59 GMT
Link: <https://api.aurabot.xyz/v2/resource>; rel="successor-version"
```

## Development Tools

### API Documentation
- OpenAPI Specification
- GraphQL Schema
- Postman Collection

### Testing Tools
```bash
# Run API tests
yarn test:api

# Generate API documentation
yarn docs:api

# Start mock server
yarn mock:api
```

## Security

### Best Practices
1. Use HTTPS only
2. Implement rate limiting
3. Validate all inputs
4. Set appropriate CORS
5. Monitor for abuse

### Headers
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Resources

### Documentation
- [API Reference](https://docs.aurabot.xyz/api)
- [GraphQL Playground](https://api.aurabot.xyz/graphql)
- [WebSocket Guide](https://docs.aurabot.xyz/websocket)

### Tools
- [Postman Collection](https://www.postman.com/aurabot/workspace)
- [OpenAPI Spec](https://api.aurabot.xyz/swagger.json)
- [GraphQL Schema](https://api.aurabot.xyz/schema.graphql)

> 🔒 **Security**: Review our [Security Guidelines](../technical/05-security.md) for API security best practices.
