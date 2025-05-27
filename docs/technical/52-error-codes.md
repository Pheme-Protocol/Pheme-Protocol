# 🚨 Error Code Reference

This document provides a comprehensive list of error codes used throughout the AURA Protocol system.

## Error Code Format

Error codes follow this format: `[CATEGORY][CODE]`

Categories:
- `AUTH`: Authentication/Authorization
- `API`: API-related
- `CHAIN`: Blockchain
- `VAL`: Validation
- `DATA`: Data handling
- `SYS`: System
- `SEC`: Security

## Authentication Errors (AUTH)

| Code      | Message                        | Description                                           | Resolution                                            |
|-----------|--------------------------------|-------------------------------------------------------|-------------------------------------------------------|
| AUTH001   | Invalid signature              | Wallet signature verification failed                   | Ensure correct message signing                         |
| AUTH002   | Token expired                  | JWT or session token has expired                      | Re-authenticate                                        |
| AUTH003   | Invalid token                  | Token format or signature invalid                     | Check token format and signing                         |
| AUTH004   | Insufficient permissions       | User lacks required role or permission                | Request appropriate access                             |
| AUTH005   | Rate limit exceeded           | Too many requests                                     | Reduce request frequency                               |

## API Errors (API)

| Code      | Message                        | Description                                           | Resolution                                            |
|-----------|--------------------------------|-------------------------------------------------------|-------------------------------------------------------|
| API001    | Invalid request                | Request format or parameters invalid                  | Check request format and parameters                    |
| API002    | Resource not found             | Requested resource doesn't exist                      | Verify resource ID or path                             |
| API003    | Method not allowed             | HTTP method not supported                             | Use correct HTTP method                                |
| API004    | Validation failed              | Request validation failed                             | Check input data                                       |
| API005    | Rate limit exceeded            | API rate limit reached                                | Implement rate limiting                                |

## Blockchain Errors (CHAIN)

| Code      | Message                        | Description                                           | Resolution                                            |
|-----------|--------------------------------|-------------------------------------------------------|-------------------------------------------------------|
| CHAIN001  | Transaction failed             | Contract transaction failed                           | Check gas and parameters                               |
| CHAIN002  | Network error                  | Blockchain network unreachable                        | Check network connection                               |
| CHAIN003  | Contract error                 | Smart contract execution error                        | Review contract interaction                            |
| CHAIN004  | Insufficient funds             | Wallet has insufficient funds                         | Add funds to wallet                                    |
| CHAIN005  | Nonce error                    | Transaction nonce incorrect                           | Reset nonce or wait for pending tx                     |

## Validation Errors (VAL)

| Code      | Message                        | Description                                           | Resolution                                            |
|-----------|--------------------------------|-------------------------------------------------------|-------------------------------------------------------|
| VAL001    | Invalid input                  | Input data validation failed                          | Check input format                                     |
| VAL002    | Required field missing         | Required data field not provided                      | Provide all required fields                            |
| VAL003    | Format error                   | Data format incorrect                                 | Check data format requirements                         |
| VAL004    | Business rule violation        | Business logic validation failed                      | Review business rules                                  |
| VAL005    | Duplicate entry                | Unique constraint violation                           | Remove duplicate                                       |

## Data Errors (DATA)

| Code      | Message                        | Description                                           | Resolution                                            |
|-----------|--------------------------------|-------------------------------------------------------|-------------------------------------------------------|
| DATA001   | Database error                 | Database operation failed                             | Check database connection                              |
| DATA002   | Cache error                    | Cache operation failed                                | Verify cache service                                   |
| DATA003   | Storage error                  | File storage operation failed                         | Check storage service                                  |
| DATA004   | Query error                    | Database query error                                  | Review query syntax                                    |
| DATA005   | Integrity error                | Data integrity constraint violated                    | Check data relationships                               |

## System Errors (SYS)

| Code      | Message                        | Description                                           | Resolution                                            |
|-----------|--------------------------------|-------------------------------------------------------|-------------------------------------------------------|
| SYS001    | Internal error                 | Unexpected system error                               | Contact support                                        |
| SYS002    | Service unavailable            | Required service not available                        | Check service status                                   |
| SYS003    | Configuration error            | System configuration issue                            | Review configuration                                   |
| SYS004    | Resource exhausted             | System resources depleted                             | Scale resources                                        |
| SYS005    | Dependency failure             | External dependency failed                            | Check external services                                |

## Security Errors (SEC)

| Code      | Message                        | Description                                           | Resolution                                            |
|-----------|--------------------------------|-------------------------------------------------------|-------------------------------------------------------|
| SEC001    | Invalid CSRF token             | CSRF token validation failed                          | Refresh page or token                                  |
| SEC002    | Invalid origin                 | Request origin not allowed                            | Check CORS configuration                               |
| SEC003    | Rate limit exceeded            | Security rate limit reached                           | Reduce request frequency                               |
| SEC004    | Blocked IP                     | IP address blocked                                    | Contact support                                        |
| SEC005    | Security violation             | Security policy violated                              | Review security requirements                           |

## Error Handling Best Practices

### Frontend

```typescript
try {
  const result = await api.call();
} catch (error) {
  if (error.code === 'AUTH001') {
    // Handle signature error
    await requestNewSignature();
  } else if (error.code === 'API001') {
    // Handle invalid request
    showValidationErrors(error.details);
  } else {
    // Handle unexpected errors
    reportError(error);
  }
}
```

### Backend

```typescript
try {
  await processRequest();
} catch (error) {
  if (error instanceof ValidationError) {
    throw new ApiError('VAL001', 'Validation failed', error.details);
  } else if (error instanceof DatabaseError) {
    throw new ApiError('DATA001', 'Database operation failed');
  } else {
    // Log unexpected errors
    logger.error('Unexpected error', { error });
    throw new ApiError('SYS001', 'Internal server error');
  }
}
```

### Smart Contracts

```solidity
require(msg.sender == owner, "AUTH004: Insufficient permissions");
require(balance >= amount, "CHAIN004: Insufficient funds");
```

## Error Response Format

All API errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {
      "field": "Additional error context"
    }
  }
}
```

## Logging Standards

Error logging should include:
- Error code
- Stack trace
- Request context
- User context (if available)
- Timestamp
- Correlation ID

Example log format:
```json
{
  "level": "error",
  "code": "API001",
  "message": "Invalid request format",
  "timestamp": "2024-01-20T10:30:00Z",
  "correlationId": "req-123",
  "context": {
    "userId": "user-456",
    "path": "/api/v1/resource",
    "method": "POST"
  }
}
``` 