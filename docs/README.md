# Pheme Protocol Documentation

## Overview

Pheme Protocol is a decentralized skill verification platform that helps users build and verify their onchain reputation through AI-powered validation.

## Core Components

### 1. Skill Wallet
- Non-transferable proof of skill (SBT)
- Onchain verification records
- Immutable skill attestations

### 2. Reputation Oracle
- AI-powered skill validation
- Real contribution verification
- Transparent scoring system

### 3. Community Governance
- Token-based voting
- Protocol parameter control
- Transparent decision making

## Technical Architecture

### Smart Contracts
- Skill Badge NFTs (SBTs)
- Reputation scoring
- Governance mechanisms

### Frontend
- React/Next.js application
- Web3 wallet integration
- Real-time chat interface

### Backend
- AI validation engine
- API endpoints
- Data persistence

## Getting Started

### Prerequisites
- Node.js 18+
- Git
- Web3 wallet (MetaMask recommended)

### Installation
1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run development server

For detailed setup instructions, see our [Environment Setup Guide](../README.md#environment-setup).

## Development

### Local Development
```bash
npm install
npm run dev
```

### Testing
```bash
npm run test
```

### Deployment
```bash
npm run build
npm start
```

## API Reference

### Chat Endpoints
- POST `/api/chat` - Send messages to Pheme AI
- GET `/api/chat/history` - Retrieve chat history

### Wallet Integration
- POST `/api/wallet/connect` - Connect Web3 wallet
- POST `/api/wallet/verify` - Verify wallet ownership

### Skill Verification
- POST `/api/skills/verify` - Submit skills for verification
- GET `/api/skills/status` - Check verification status

## Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details.

## Security

For security concerns, please review our [Security Policy](../SECURITY.md).

## License

This project is licensed under the GNU AGPL-3.0 License - see the [LICENSE](../LICENSE) file for details.

## Contact

- Website: https://pheme.app
- GitHub: https://github.com/PhemeAI/Pheme-Protocol
- Discord: [Join our community](https://discord.gg/pheme) 