# System Architecture

## Overview

PHEME's architecture is designed to be scalable, secure, and maintainable while supporting decentralized skill verification and reputation building.

```plaintext
    +----------------+       +--------------------+       +---------------+
    |   Frontend     | <---> |  API Gateway       | <---> |  Backend      |
    | (Next.js +     |       | (NestJS + Apollo)  |       | (NestJS +     |
    |  React + Tail.)|       |                    |       |  Prisma +     |
    +----------------+       +--------------------+       |  PostgreSQL)  |
           |                       |      ^   ^            +---------------+
           v                       v      |   |                    |
  +----------------+      +---------------+   +-----------+   +-----------+
  | Wallet &       |      | Redis Cache   |   | The Graph |   | IPFS/S3   |
  | Auth Service   |      +---------------+   +-----------+   +-----------+
  +----------------+           |                                  |
           |                   v                                  v
           v         +---------------------+               +----------------+
    +---------------+| RabbitMQ / BullMQ   |               | Smart Contracts|
    | Monitoring &  |+---------------------+               | (Hardhat, OZ)  |
    | Logging & APM |                                       +----------------+
    +---------------+
```

## Core Components

### 1. Smart Contract Layer

#### Contracts

* **$PHEME Token (ERC-20)**
  * Governance functionality
  * Staking mechanisms
  * Reward distribution
* **Skill Wallet (ERC-721 Soulbound)**
  * Non-transferable NFT
  * Dynamic metadata
  * Skill progression tracking
* **Badge NFT (ERC-1155)**
  * Achievement tokens
  * Tiered badge system
  * Some tradeable variants
* **Reputation Oracle**
  * Score registry
  * Validator updates
  * Offchain oracle integration

### 2. Backend Services

#### API Gateway

* Request routing
* Authentication
* Rate limiting
* GraphQL/REST endpoints

#### Core Services

* Task matching engine
* AI validation workflow
* Reputation calculation
* Event processing

#### Data Layer

* PostgreSQL for relational data
* Redis for caching
* IPFS/S3 for content storage

### 3. Frontend Applications

#### Main dApp

* User dashboard
* Quest interface
* Profile management
* Wallet integration

#### Components

* Reusable UI library
* Web3 hooks
* State management
* Analytics integration

## Service Communication

### Event Flow

1. User initiates action (frontend)
2. Request validated (API Gateway)
3. Business logic processed (Backend)
4. Blockchain interaction if needed
5. Response returned to user

### Data Flow

1. On-chain data indexed by The Graph
2. Cached in Redis for quick access
3. Combined with off-chain data
4. Served via GraphQL/REST API

## Security Architecture

### Authentication

* Wallet-based authentication
* JWT session management
* Role-based access control

### Data Protection

* Encryption at rest
* Secure communication
* Rate limiting
* Input validation

## Scalability Features

### Horizontal Scaling

* Stateless services
* Load balancing
* Database sharding
* Cache distribution

### Performance Optimization

* CDN integration
* Query optimization
* Background processing
* Smart caching

## Monitoring & Reliability

### Observability

* Prometheus metrics
* Grafana dashboards
* Error tracking
* Performance monitoring

### High Availability

* Service redundancy
* Database replication
* Failover mechanisms
* Backup strategies

## Development Workflow

### Environment Setup

1. Local development
2. Staging environment
3. Production deployment

### Deployment Process

1. CI/CD pipeline
2. Automated testing
3. Infrastructure as Code
4. Blue-green deployment

## Future Considerations

### Scalability

* Layer 2 integration
* Cross-chain support
* Improved indexing

### Features

* Enhanced AI validation
* Advanced analytics
* Mobile applications
* Integration APIs
