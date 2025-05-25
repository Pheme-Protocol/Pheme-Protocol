# Quickstart Guide

This guide will help you get Aura Chat up and running in your local environment quickly.

## Prerequisites

- Node.js 18.x or higher
- Git
- A Web3 wallet (MetaMask, WalletConnect, etc.)
- OpenAI API key

## Quick Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/aura-chat.git
cd aura-chat
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.template .env.local
```

Edit `.env.local` with your configuration:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
OPENAI_API_KEY=your_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Next Steps

- Read the [Installation Guide](02-installation.md) for detailed setup instructions
- Explore the [Architecture Overview](03-architecture.md)
- Check out our [Developer Guide](../developer-guide/05-frontend.md) for frontend development

## Troubleshooting

If you encounter any issues during setup:

1. Ensure all prerequisites are installed
2. Check that environment variables are properly set
3. Clear your browser cache and node_modules
4. Refer to our [FAQ](../ecosystem/03-faq.md) for common issues 