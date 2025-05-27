# 🚀 Quick Start Guide

{% hint style="info" %}
This guide will help you get started with Pheme AI in minutes. For detailed setup, see the [Installation Guide](02-installation.md).
{% endhint %}

## Choose Your Path

{% tabs %}
{% tab title="🖥️ Developer" %}
### Developer Quick Start

1. Clone and Setup
```bash
git clone https://github.com/PhemeAI/Pheme-Protocol.git
cd Pheme-Protocol
npm install
```

2. Configure Environment
```bash
cp .env.example .env
```

{% hint style="warning" %}
Remember to update the `.env` file with your credentials!
{% endhint %}

3. Start Development Server
```bash
npm run dev
```
{% endtab %}

{% tab title="🤝 Integration Partner" %}
### Integration Quick Start

1. Get API Key
   * Register on [Pheme Dashboard](coming soon)
   * Generate API key from settings

2. Install SDK
```bash
npm install @pheme-protocol/sdk
```

3. Initialize SDK
```typescript
import { PhemeSDK } from '@pheme-protocol/sdk';

const pheme = new PhemeSDK({
  apiKey: 'your-api-key'
});
```
{% endtab %}

{% tab title="👥 Community Member" %}
### Community Quick Start

1. Join Community
   * Join [Discord](coming soon)
   * Follow [Twitter](https://twitter.com/phemeai)

2. Create Wallet
   * Install MetaMask
   * Connect to Base network

3. Get Started
   * Visit [Pheme App](https://phemeai.xyz)
   * Create your Skill Wallet (coming soon)
{% endtab %}
{% endtabs %}

## Core Features

{% accordion %}
{% accordion-item title="🎯 Skill Validation" %}
Validate and verify skills using AI-powered assessment:

```typescript
const result = await pheme.skills.validate({
  skill: 'javascript',
  evidence: 'https://github.com/user/project'
});
```
{% endaccordant-item %}

{% accordion-item title="💼 Skill Wallet" %}
Manage your digital identity and credentials:

```typescript
const wallet = await pheme.wallet.create({
  address: '0x...',
  skills: ['javascript', 'solidity']
});
```
{% endaccordant-item %}

{% accordion-item title="🏆 Reputation System" %}
Build and track your reputation:

```typescript
const score = await pheme.reputation.getScore({
  address: '0x...',
  category: 'development'
});
```
{% endaccordant-item %}
{% endaccordion %}

## Configuration Options

<details>
<summary>Environment Variables</summary>

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `DATABASE_URL` | Yes | Database connection |
| `JWT_SECRET` | Yes | JWT signing key |

</details>

<details>
<summary>Network Configuration</summary>

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Base Mainnet | 8453 | https://mainnet.base.org |
| Base Testnet | 84531 | https://testnet.base.org |

</details>

## Quick Links

{% hint style="tip" %}
Check out these resources to learn more:
* [📚 Documentation](coming soon)
* [💻 GitHub](https://github.com/PhemeAI/Pheme-Protocol)
* [🎮 Discord](coming soon)
* [🐦 Twitter](https://twitter.com/phemeai)
{% endhint %}

## Troubleshooting

{% hint style="warning" %}
Common issues and solutions:

1. **Connection Issues**
   ```bash
   curl -X GET http://localhost:3000/health
   ```

2. **API Errors**
   Check your API key and network connection

3. **Smart Contract Errors**
   Ensure you have sufficient funds and correct network
{% endhint %}

## Next Steps

{% hint style="success" %}
Ready to dive deeper? Check out:
* [📖 Full Installation Guide](02-installation.md)
* [🏗️ Architecture Overview](03-architecture.md)
* [👨‍💻 Developer Guide](../developer-guide/00-development-setup.md)
{% endhint %}

{% hint style="info" %}
Need help? Join our [Discord community](coming soon) for support!
{% endhint %} 