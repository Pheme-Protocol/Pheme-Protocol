# 🔑 Key Concepts

{% hint style="info" %}
This guide explains the core concepts and components of the Pheme AI. Understanding these concepts is essential for both users and developers.
{% endhint %}

## Core Components

{% tabs %}
{% tab title="💼 Skill Wallet" %}
A digital identity container that holds validated skills, reputation scores, and achievements.

```mermaid
graph TB
    A[Skill Wallet] --> B[Skills]
    A --> C[Reputation]
    A --> D[Achievements]
    B --> E[Validated]
    B --> F[In Progress]
    C --> G[Overall Score]
    C --> H[Category Scores]
    D --> I[Badges]
    D --> J[Certificates]
```

{% hint style="tip" %}
Your Skill Wallet is soulbound (non-transferable) and represents your unique identity in the Pheme ecosystem.
{% endhint %}
{% endtab %}

{% tab title="🎯 Skill Validation" %}
AI-powered system for validating and verifying user skills.

```mermaid
sequenceDiagram
    participant User
    participant Protocol
    participant AI
    participant Validators
    
    User->>Protocol: Submit Evidence
    Protocol->>AI: Analyze Evidence
    AI->>Validators: Validation Request
    Validators->>Protocol: Consensus
    Protocol->>User: Validation Result
```

{% hint style="warning" %}
Evidence must be verifiable and meet our quality standards for successful validation.
{% endhint %}
{% endtab %}

{% tab title="🏆 Reputation System" %}
A merit-based scoring system that reflects user contributions and validated skills.

```mermaid
graph LR
    A[Actions] --> B[Reputation Score]
    C[Skills] --> B
    D[Validations] --> B
    B --> E[Rewards]
    B --> F[Access]
```

{% hint style="success" %}
Higher reputation scores unlock additional features and opportunities in the ecosystem.
{% endhint %}
{% endtab %}
{% endtabs %}

## Skill Categories

{% accordion %}
{% accordion-item title="💻 Technical Skills" %}
### Development Skills
- Programming Languages
- Frameworks & Libraries
- System Architecture
- DevOps & Infrastructure

### Validation Criteria
```typescript
interface TechnicalValidation {
  codeQuality: "Code review and best practices",
  systemDesign: "Architecture and scalability",
  problemSolving: "Algorithm and solution efficiency",
  documentation: "Code documentation and clarity"
}
```
{% endaccordant-item %}

{% accordion-item title="🎨 Creative Skills" %}
### Creative Areas
- UI/UX Design
- Graphic Design
- Content Creation
- Digital Art

### Validation Criteria
```typescript
interface CreativeValidation {
  design: "Visual appeal and consistency",
  userExperience: "Usability and interaction",
  innovation: "Creativity and originality",
  execution: "Technical implementation"
}
```
{% endaccordant-item %}

{% accordion-item title="📊 Business Skills" %}
### Business Areas
- Project Management
- Marketing
- Business Development
- Finance

### Validation Criteria
```typescript
interface BusinessValidation {
  strategy: "Planning and execution",
  results: "Measurable outcomes",
  leadership: "Team management",
  innovation: "Market approach"
}
```
{% endaccordant-item %}
{% endaccordion %}

## Validation Process

{% tabs %}
{% tab title="📝 Submission" %}
### Evidence Requirements

| Type | Examples | Format |
|------|----------|---------|
| Code | GitHub repos, PRs | Link + Description |
| Design | Portfolio, Projects | Images + Context |
| Business | Case Studies | Document + Metrics |

{% hint style="info" %}
All submissions should include context and measurable outcomes.
{% endhint %}
{% endtab %}

{% tab title="🔍 Validation" %}
### Validation Steps

1. **AI Analysis**
   - Code review
   - Pattern recognition
   - Quality assessment

2. **Validator Review**
   - Expert verification
   - Consensus building
   - Final approval

{% hint style="warning" %}
Multiple validators must reach consensus for approval.
{% endhint %}
{% endtab %}

{% tab title="✅ Results" %}
### Outcomes

| Result | Description | Next Steps |
|--------|-------------|------------|
| Approved | Skill validated | Receive NFT |
| Pending | Under review | Wait for validation |
| Rejected | Did not meet criteria | Improve and resubmit |

{% hint style="success" %}
Approved skills are permanently recorded on-chain.
{% endhint %}
{% endtab %}
{% endtabs %}

## Reputation Mechanics

{% accordion %}
{% accordion-item title="📈 Scoring System" %}
### Reputation Formula

```typescript
interface ReputationScore {
  base: number;        // Base score from validations
  multiplier: number;  // Activity multiplier
  bonus: number;       // Special achievements
  decay: number;       // Time-based decay
}

totalScore = (base * multiplier + bonus) * (1 - decay)
```

### Score Components
- Validated skills
- Community contributions
- Task completion
- Peer endorsements
{% endaccordant-item %}

{% accordion-item title="🎮 Gamification" %}
### Experience System

| Level | XP Required | Benefits |
|-------|-------------|----------|
| Novice | 0 - 1000 | Basic access |
| Advanced | 1001 - 5000 | Enhanced features |
| Expert | 5001 - 10000 | Special privileges |
| Master | 10000+ | Full benefits |

### Achievement Types
- Skill milestones
- Contribution streaks
- Community recognition
- Special events
{% endaccordant-item %}

{% accordion-item title="🏅 Rewards" %}
### Reward Types

1. **Token Rewards**
   - Validation rewards
   - Contribution bonuses
   - Staking returns

2. **Non-Token Rewards**
   - Special badges
   - Access rights
   - Governance power
   - Premium features
{% endaccordant-item %}
{% endaccordion %}

## Governance Participation

{% tabs %}
{% tab title="🗳️ Voting" %}
### Voting Power

```typescript
votingPower = tokenBalance * (1 + reputationScore/100)
```

{% hint style="info" %}
Higher reputation scores amplify your voting power.
{% endhint %}
{% endtab %}

{% tab title="📋 Proposals" %}
### Proposal Types

- Protocol upgrades
- Parameter changes
- Feature requests
- Fund allocation

{% hint style="warning" %}
Proposals require minimum token holdings and reputation.
{% endhint %}
{% endtab %}

{% tab title="💰 Treasury" %}
### Treasury Management

- Development funding
- Reward distribution
- Protocol maintenance
- Community initiatives

{% hint style="success" %}
Treasury decisions require community approval.
{% endhint %}
{% endtab %}
{% endtabs %}

## Next Steps

{% hint style="success" %}
Ready to dive deeper?
* [🚀 Quick Start Guide](../get-started/01-quickstart.md)
* [📖 Developer Guide](../developer-guide/00-development-setup.md)
* [🤝 Community Guide](04-community-guides.md)
{% endhint %}

{% hint style="info" %}
Need help understanding these concepts? Join our [Discord community](coming soon)!
{% endhint %}
