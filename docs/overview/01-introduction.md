# Introduction to Pheme AI

> "What Bitcoin did for money, Pheme AI does for skills."

Pheme AI is a decentralized, AI-powered protocol that turns **skills into reputation** and **proof into power**. At its core, Pheme AI enables users to earn reputation through real contributions, scored by AI validators, and stored in non-transferable Skill Wallets.

> 📚 **Related**: For detailed technical concepts, see [Key Concepts](02-key-concepts.md#skill-wallet-system).

## Core Mission

PhemeAI makes skills verifiable, permissionless, and decentralized by:
- Validating actual contributions through AI review
- Building trustless, onchain reputation
- Enabling cross-platform skill verification
- Fostering community-driven learning and growth

> 🎯 **See Also**: Check our detailed [Project Vision & Roadmap](03-roadmap.md#vision) to understand where we're headed.

## Core Components

### 🎒 Skill Wallet (Soulbound NFT)
- Immutable, non-transferable proof-of-skill
- Task history and completion records
- XP tracking by skill domain
- Peer endorsements and validations
- Activity timestamps and verification

> 🔍 **Deep Dive**: Learn more about the [Skill Wallet System](02-key-concepts.md#skill-wallet-system) and [Experience Tracking](02-key-concepts.md#experience-tracking).

### 🧠 AI Validator Network
- Independent AI nodes for contribution evaluation
- DAO-governed models and thresholds
- Upgradeable scoring rules
- Onchain result verification
- Transparent validation process

> 🤖 **Technical Details**: See [AI Integration](02-key-concepts.md#ai-integration) for implementation details.

### 🧮 Reputation Oracle
Public scoring system incorporating:
- Task volume and quality metrics
- Skill breadth assessment
- Consistency tracking
- Peer feedback integration
- DAO/dApp query interface

> 📊 **Learn More**: Explore the [Reputation Oracle](02-key-concepts.md#reputation-oracle) architecture.

### 🪙 Token Utility ($PHEME)

#### Use Cases
- Governance (validator upgrades, funding)
- Contributor rewards
- Reputation staking
- Badge minting
- AI mentor unlocks

> 💡 **Related**: See [Token Utility](02-key-concepts.md#token-utility-pheme) for detailed tokenomics.

#### Initial Tokenomics (1B max supply)
| Category | % | Vesting |
|----------|---|---------|
| Public Sale | 35% | Unlocked at TGE |
| Team & Founders | 15% | 6-month cliff + 24-month linear |
| DAO Treasury | 15% | Proposal-based release |
| Liquidity | 10% | Locked 12 months |
| Community Rewards | 10% | Released over 36 months |
| Marketing | 10% | Fully unlocked at launch |
| Airdrops | 5% | Fully unlocked at launch |

> 📈 **Launch Details**: Check our [Token Launch Timeline](03-roadmap.md#q3-2025-alpha-launch) in the roadmap.

## Community Participation

### Ways to Contribute
- Complete skill quests and earn XP
- Join guilds and participate in events
- Create content and share knowledge
- Help develop and test features
- Participate in governance

> 🤝 **Get Started**: See our [Community Guide](04-community-guides.md#-getting-started) for detailed steps.

### Getting Started
1. Connect your Base wallet at [www.pheme-ai.xyz](https://www.pheme-ai.xyz)
2. Choose your skill path
3. Mint your Skill Wallet
4. Join the community

> 🎮 **Next Steps**: Explore [Community Events](04-community-guides.md#-community-events) to get involved.

## Official Channels
- **Twitter**: [@phemeai](https://twitter.com/phemeai)
- **Telegram**: coming soon
- **Discord**: coming soon
- **GitHub**: [github.com/PhemeAI](https://github.com/PhemeAI/Pheme-Protocol)

> 🌐 **Stay Connected**: Follow our [Updates & Communication](03-roadmap.md#updates--communication) channels.

## Integration Capabilities

### For Developers
```typescript
// Query a user's Skill Wallet
GET /api/skill/:wallet

// Query reputation score
GET /api/reputation/:wallet

// Post verified tasks
POST /api/task/create

// Filter by skill level
GET /api/match?skill=solidity&score>75
```

> 🔧 **Developer Resources**: Check our [Platform Architecture](02-key-concepts.md#platform-architecture) and [Cross-Platform Integration](02-key-concepts.md#cross-platform-integration) guides.

### For DAOs & dApps
- Gate bounties by skill or reputation
- Automatic contributor matching
- Hackathon entry ranking
- Learning module certification
- Reputation-based governance whitelisting

> 🏗️ **Integration Guide**: See [DAO Tools](02-key-concepts.md#dao-tools) for implementation details.

## Security Model

- Validator scores signed and pushed onchain
- DAO-triggered dispute resolution
- Soulbound NFTs prevent Sybil farming
- Open-source models
- Transparency-first approach

> 🔒 **Security Details**: Learn more about our [Security Model](02-key-concepts.md#security-model).

## Roadmap

| Phase | Milestone |
|-------|-----------|
| Month 1 | Brand, GitHub, smart contract setup |
| Month 2–3 | MVP build: wallet, quiz, task engine |
| Month 4 | Closed alpha test + feedback |
| Month 5 | Integrations + token launch |
| Month 6 | Public launch, leaderboard, DAO voting |

> 🗺️ **Full Timeline**: See our detailed [Project Roadmap](03-roadmap.md#roadmap) for complete milestones.

## Next Steps

To start your Pheme AI journey:
- [Read the Community Guide](04-community-guides.md)
- [Follow the Quickstart Guide](../get-started/01-quickstart.md)
- [Check Installation Guide](../get-started/02-installation.md)
- [Explore Developer Documentation](../developer-guide/05-frontend.md)

> 🚀 **Get Involved**: Find more ways to contribute in our [Community Guide](04-community-guides.md#-contribution-paths).



> 📝 **Related Guides**: 
> - [Development Standards](../technical/04-coding-standards.md)
> - [Contribution Workflow](../technical/21-contribution-workflow.md)
> - [Security Guidelines](../technical/05-security.md)

WAGMI ✨ 