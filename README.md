# Pheme Protocol Documentation

Welcome to the official documentation for **Pheme**, a decentralized, AI-powered protocol for skill verification and onchain reputation.

---

## Overview

Pheme Protocol is a decentralized skill verification platform that enables users to prove their abilities and build verifiable reputation using AI validation and Web3 infrastructure.

---

## Documentation Structure

- **Overview**: Introduction, key concepts, and community guides  
- **Get Started**: Installation and environment setup  
- **Technical Details**: Smart contracts, frontend/backend architecture  
- **Developer Guide**: Integration guides and implementation  
- **Governance**: Token-based decision making and platform control  
- **Ecosystem**: Use cases, partners, and FAQs  

---

## Core Components

### 1. Skill Wallet
- Soulbound NFT (SBT) representing verifiable skills  
- Immutable, onchain skill attestations  
- Owned by the user, non-transferable by design  

### 2. Reputation Oracle
- AI-powered validation engine  
- Transparent contribution scoring  
- Publicly queryable onchain reputation  

### 3. Community Governance
- Token-based proposal and voting mechanism  
- Decentralized protocol updates and decision making  
- Transparent and auditable governance process  

---

## Technical Architecture

### Smart Contracts
- Skill Badge NFTs (SBTs)  
- Contribution tracking and scoring  
- Governance logic and parameter control  

### Frontend
- React + Next.js application  
- Web3 wallet integration (e.g. MetaMask)  
- Real-time chat interface with AI validation  

### Backend
- AI validation engine  
- API endpoints for chat, wallet, and verification  
- Data persistence and audit logs  

---

## Getting Started

### Prerequisites
- Node.js 18+  
- Git  
- Web3 wallet (MetaMask recommended)  

### Installation
1. Clone the repository  
2. Install dependencies  
3. Configure environment variables  
4. Run the development server  

📖 See the [Environment Setup Guide](../README.md#environment-setup) for full details.

---

## Development

### Local Development
```bash
yarn install
yarn dev
```

### Linting & Testing (Monorepo)
To lint and test all workspaces, run:
```bash
yarn lint
yarn test
```
These commands will run lint and test scripts across all packages using Yarn workspaces.

```bash
npm install
npm run dev