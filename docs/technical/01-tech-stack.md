# 🛠️ Technology Stack

PHEME's technology stack is carefully chosen to provide a robust, scalable, and secure foundation for decentralized skill verification and reputation building.

## Core Technology Stack

| Layer              | Technology & Tools                                           | Rationale                                              |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------ |
| **Blockchain**     | Solidity, Hardhat, OpenZeppelin, Ethers.js                   | EVM compatibility, security-tested libraries, tooling  |
| **Indexing**       | The Graph (Graph Protocol)                                   | Fast, reliable subgraph queries                        |
| **Backend**        | Node.js, TypeScript, NestJS, Apollo GraphQL / REST (Express) | Scalable, modular, type-safe, enterprise patterns      |
| **Database**       | PostgreSQL, Prisma ORM                                       | ACID compliance, complex queries, type-safe migrations |
| **Cache & Queue**  | Redis (cache, rate-limiting), RabbitMQ / BullMQ (job queue)  | Low-latency data, async processing                     |
| **Frontend**       | Next.js, React, TypeScript, Tailwind CSS                     | SSR/SSG, fast iteration, consistent styling            |
| **AI Services**    | OpenAI API, LangChain                                        | Flexible LLM integration, prompt management            |
| **Storage**        | IPFS (Pinata/Filebase), AWS S3 (fallback)                    | Decentralized asset storage + scalable fallback        |
| **Auth & Wallet**  | Coinbase OnchainKit, WalletConnect, JWT                      | Secure wallet integration, session management          |
| **CI/CD & DevOps** | GitHub Actions, Docker, Kubernetes (EKS/GKE)                 | Automated pipelines, container orchestration           |
| **Logging & APM**  | Winston / Pino, Sentry, Prometheus, Grafana                  | Real-time tracing, error monitoring, metrics           |
| **Security Tools** | Slither, MythX, Echidna, SonarQube                           | Static analysis, smart contract audits, code quality   |

## Key Components

### Smart Contract Layer
- ERC-20 token implementation for $PHEME
- Soulbound NFT (ERC-721) for Skill Wallets
- ERC-1155 for Badge System
- Custom Reputation Oracle contracts

### Backend Services
- GraphQL API Gateway
- Task Processing Engine
- AI Validation Service
- Reputation Calculator
- Event Indexer

### Frontend Applications
- Main dApp Interface
- Wallet Integration
- Analytics Dashboard
- Community Portal

### Developer Tools
- SDK & API Libraries
- Smart Contract Templates
- Testing Framework
- Documentation Generator

## Version Control & Package Management

### Git Workflow
- Feature branching
- Conventional commits
- Pull request templates
- Automated code review

### Package Management
- NPM/Yarn for JavaScript/TypeScript
- Cargo for Rust components
- Poetry for Python AI services

## Infrastructure

### Cloud Services
- Kubernetes clusters
- Load balancers
- CDN integration
- Database clusters

### Monitoring
- Real-time metrics
- Error tracking
- Performance monitoring
- Security alerts

## Development Environment

### Required Tools
- Node.js (v16+)
- Docker
- Hardhat
- PostgreSQL
- Redis

### Recommended IDEs
- VSCode with Solidity extensions
- WebStorm for TypeScript
- Remix IDE for quick contract testing 
