# 🏛️ Governance Model

{% hint style="info" %}
The PHEME Protocol governance model empowers community members to participate in decision-making and protocol evolution through a reputation-weighted voting system.
{% endhint %}

## Governance Overview

{% tabs %}
{% tab title="🔑 Key Components" %}
```mermaid
graph TB
    A[PHEME Governance] --> B[Token Holders]
    A --> C[Reputation Holders]
    A --> D[Validators]
    
    B --> E[Voting Power]
    C --> E
    D --> F[Protocol Security]
    
    E --> G[Decisions]
    F --> G
    
    style A fill:#f9f,stroke:#333
    style G fill:#9ff,stroke:#333
```

### Core Elements
* Token-based voting
* Reputation multipliers
* Validator consensus
* Community proposals
* Treasury management

{% hint style="tip" %}
Your voting power is determined by both your token holdings and reputation score.
{% endhint %}
{% endtab %}

{% tab title="📊 Voting Power" %}
### Voting Power Calculation

```typescript
interface VotingPower {
  baseTokens: number;      // PHEME token holdings
  reputation: number;      // Reputation score (0-100)
  multiplier: number;      // Reputation multiplier
  validatorStatus: boolean; // Active validator bonus
}

// Voting power formula
votingPower = baseTokens * (1 + (reputation * multiplier))
```

{% hint style="warning" %}
Tokens must be staked for at least 7 days before they count towards voting power.
{% endhint %}
{% endtab %}

{% tab title="🎯 Thresholds" %}
### Governance Thresholds

| Action | Requirement | Quorum |
|--------|-------------|--------|
| Create Proposal | 10,000 PHEME | N/A |
| Basic Vote | 1,000 PHEME | 10% |
| Core Changes | 5,000 PHEME | 30% |
| Emergency Actions | 20,000 PHEME | 50% |

{% hint style="info" %}
Thresholds are adjustable through governance proposals.
{% endhint %}
{% endtab %}
{% endtabs %}

## Proposal System

{% accordion %}
{% accordion-item title="📝 Proposal Creation" %}
### Creating a Proposal

1. **Requirements**
   * Minimum token holding
   * Required reputation score
   * Detailed documentation
   * Community discussion

2. **Proposal Types**
   ```typescript
   enum ProposalType {
     PARAMETER_CHANGE,
     PROTOCOL_UPGRADE,
     TREASURY_ALLOCATION,
     VALIDATOR_UPDATE,
     EMERGENCY_ACTION
   }
   ```

3. **Submission Process**
   * Draft proposal
   * Community feedback
   * Formal submission
   * Voting period

{% hint style="tip" %}
Use our [Proposal Template](./templates/proposal-template.md) for structured submissions.
{% endhint %}
{% endaccordant-item %}

{% accordion-item title="🗳️ Voting Process" %}
### Voting Mechanics

```mermaid
sequenceDiagram
    participant P as Proposer
    participant C as Community
    participant V as Validators
    participant G as Governance
    
    P->>G: Submit Proposal
    G->>C: Start Discussion Period
    C->>C: Community Feedback
    G->>V: Validator Review
    V->>G: Technical Assessment
    G->>C: Start Voting Period
    C->>G: Cast Votes
    G->>P: Execute/Reject
```

1. **Voting Options**
   * For
   * Against
   * Abstain

2. **Voting Period**
   * Discussion: 3 days
   * Voting: 5 days
   * Execution: 2 days
{% endaccordant-item %}

{% accordion-item title="⚡ Emergency Actions" %}
### Emergency Procedures

1. **Qualifying Events**
   * Security vulnerabilities
   * Critical bugs
   * Market risks
   * Protocol attacks

2. **Fast-Track Process**
   * Validator alert
   * Emergency proposal
   * Rapid voting
   * Immediate execution

{% hint style="danger" %}
Emergency actions require super-majority approval and validator consensus.
{% endhint %}
{% endaccordant-item %}
{% endaccordion %}

## Treasury Management

{% tabs %}
{% tab title="💰 Treasury Overview" %}
### Treasury Allocation

```mermaid
pie title Treasury Distribution
    "Development" : 40
    "Community Rewards" : 30
    "Security" : 20
    "Operations" : 10
```

{% hint style="info" %}
Treasury allocations are reviewed and adjusted quarterly through governance.
{% endhint %}
{% endtab %}

{% tab title="📈 Fund Management" %}
### Management Strategy

1. **Investment Categories**
   * Protocol development
   * Community initiatives
   * Security measures
   * Ecosystem growth

2. **Risk Levels**
   * Conservative (40%)
   * Moderate (40%)
   * Growth (20%)

{% hint style="warning" %}
All treasury movements require multi-sig approval and community consensus.
{% endhint %}
{% endtab %}

{% tab title="🎁 Rewards" %}
### Community Rewards

| Activity | Reward Range | Frequency |
|----------|-------------|-----------|
| Proposals | 100-1000 PHEME | Per accepted proposal |
| Validation | 50-200 PHEME | Per validation |
| Development | 500-5000 PHEME | Per milestone |
| Content | 100-500 PHEME | Per piece |

{% hint style="success" %}
Rewards are distributed automatically through smart contracts.
{% endhint %}
{% endtab %}
{% endtabs %}

## Validator System

{% accordion %}
{% accordion-item title="🔍 Validator Requirements" %}
### Becoming a Validator

1. **Technical Requirements**
   * High-availability infrastructure
   * Security measures
   * Performance metrics
   * Monitoring systems

2. **Stake Requirements**
   * Minimum: 50,000 PHEME
   * Lock period: 3 months
   * Slashing conditions
   * Performance bonds

{% hint style="warning" %}
Validators must maintain 99.9% uptime and meet performance metrics.
{% endhint %}
{% endaccordant-item %}

{% accordion-item title="⚖️ Validator Responsibilities" %}
### Core Duties

1. **Network Security**
   * Transaction validation
   * Block production
   * Network monitoring
   * Threat detection

2. **Governance Participation**
   * Proposal review
   * Technical assessment
   * Emergency response
   * Community guidance

3. **Performance Metrics**
   ```typescript
   interface ValidatorMetrics {
     uptime: number;        // 99.9% required
     responseTime: number;  // < 100ms
     validations: number;   // Weekly minimum
     reputation: number;    // Minimum 90/100
   }
   ```
{% endaccordant-item %}

{% accordion-item title="🎯 Validator Selection" %}
### Selection Process

```mermaid
graph TB
    A[Application] --> B[Technical Review]
    B --> C[Community Vote]
    C --> D[Stake Lock]
    D --> E[Activation]
    
    style A fill:#f9f,stroke:#333
    style E fill:#9ff,stroke:#333
```

1. **Selection Criteria**
   * Technical expertise
   * Community standing
   * Infrastructure quality
   * Security measures

2. **Ongoing Requirements**
   * Regular audits
   * Performance reviews
   * Community feedback
   * Continuous education
{% endaccordant-item %}
{% endaccordion %}

## Participation Guidelines

{% tabs %}
{% tab title="👥 Community Role" %}
### Community Participation

1. **Engagement Levels**
   * Basic voter
   * Active proposer
   * Core contributor
   * Validator node

2. **Responsibilities**
   * Informed voting
   * Constructive feedback
   * Protocol security
   * Community growth

{% hint style="tip" %}
Start with basic voting and gradually increase your involvement.
{% endhint %}
{% endtab %}

{% tab title="📚 Resources" %}
### Governance Resources

1. **Documentation**
   * Governance guides
   * Technical docs
   * Best practices
   * Case studies

2. **Tools**
   * Voting dashboard
   * Proposal creator
   * Analytics tools
   * Simulation tools

{% hint style="info" %}
All governance tools are open-source and community-maintained.
{% endhint %}
{% endtab %}

{% tab title="🤝 Best Practices" %}
### Governance Guidelines

1. **Proposal Creation**
   * Clear objectives
   * Detailed analysis
   * Impact assessment
   * Implementation plan

2. **Voting Conduct**
   * Research thoroughly
   * Discuss openly
   * Vote responsibly
   * Accept outcomes

{% hint style="success" %}
Follow our [Code of Conduct](../../CODE_OF_CONDUCT.md) for all governance activities.
{% endhint %}
{% endtab %}
{% endtabs %}

## Next Steps

{% hint style="success" %}
Ready to participate in governance?
* [🗳️ View Active Proposals](https://governance@phemeai.xyz)
* [📝 Create a Proposal](./templates/proposal-template.md)
* [💬 Join Governance Forum](https://forum@phemeai.xyz)
* [📊 View Analytics](https://analytics@phemeai.xyz)
{% endhint %}

{% hint style="info" %}
Need help with governance? Join our [Governance Working Group](https://discord.gg/pheme-governance) on Discord!
{% endhint %} 
