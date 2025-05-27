# Blockchain Integration

## Overview

PHEME Protocol is designed to operate across multiple EVM-compatible chains, with Base as the primary network. This guide covers deployment, management, and integration across different chains.

## Supported Networks

### Primary Network

* **Base**
  * Mainnet: `8453`
  * Testnet: `84531`

### Secondary Networks

* **Ethereum**
  * Mainnet: `1`
  * Goerli: `5`
* **Arbitrum**
  * Mainnet: `42161`
  * Testnet: `421613`
* **Polygon**
  * Mainnet: `137`
  * Mumbai: `80001`

## Smart Contract Configuration

### Network Configuration

```typescript
// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Primary Network
    base: {
      url: process.env.BASE_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453
    },
    "base-testnet": {
      url: process.env.BASE_TESTNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84531
    },
    
    // Secondary Networks
    ethereum: {
      url: process.env.ETH_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1
    },
    arbitrum: {
      url: process.env.ARB_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 42161
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 137
    }
  },
  etherscan: {
    apiKey: {
      base: process.env.BASE_ETHERSCAN_API_KEY,
      mainnet: process.env.ETH_ETHERSCAN_API_KEY,
      arbitrum: process.env.ARB_ETHERSCAN_API_KEY,
      polygon: process.env.POLYGON_ETHERSCAN_API_KEY
    }
  }
};

export default config;
```

### Deployment Script

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";
import { getNetworkConfig } from "../config";

async function main() {
  const networkName = hre.network.name;
  const config = getNetworkConfig(networkName);
  
  // Deploy Skill Wallet
  const SkillWallet = await ethers.getContractFactory("SkillWallet");
  const skillWallet = await SkillWallet.deploy(config.params);
  await skillWallet.deployed();
  
  console.log(`SkillWallet deployed to ${skillWallet.address} on ${networkName}`);
  
  // Verify contract
  if (config.verify) {
    await hre.run("verify:verify", {
      address: skillWallet.address,
      constructorArguments: [config.params],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Network-Specific Configuration

### Chain Configuration

```typescript
// config/networks.ts
export interface NetworkConfig {
  rpcUrl: string;
  chainId: number;
  params: any;
  verify: boolean;
  subgraph: string;
}

export const networkConfigs: Record<string, NetworkConfig> = {
  base: {
    rpcUrl: "https://mainnet.base.org",
    chainId: 8453,
    params: {
      // Base-specific parameters
    },
    verify: true,
    subgraph: "pheme-protocol/pheme-base"
  },
  arbitrum: {
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    chainId: 42161,
    params: {
      // Arbitrum-specific parameters
    },
    verify: true,
    subgraph: "pheme-protocol/pheme-arbitrum"
  }
  // Add other networks...
};
```

### Environment Variables

```bash
# .env.example
# ⚠️ IMPORTANT: Never commit actual values to version control
# Replace these placeholders with your actual values in .env

# Base
BASE_RPC_URL=<your-base-rpc-url>
BASE_TESTNET_RPC_URL=<your-base-testnet-rpc-url>
BASE_ETHERSCAN_API_KEY=<your-base-etherscan-key>

# Ethereum
ETH_RPC_URL=<your-eth-rpc-url>
ETH_TESTNET_RPC_URL=<your-eth-testnet-rpc-url>
ETH_ETHERSCAN_API_KEY=<your-eth-etherscan-key>

# Arbitrum
ARB_RPC_URL=<your-arbitrum-rpc-url>
ARB_TESTNET_RPC_URL=<your-arbitrum-testnet-rpc-url>
ARB_ETHERSCAN_API_KEY=<your-arbitrum-etherscan-key>

# Polygon
POLYGON_RPC_URL=<your-polygon-rpc-url>
POLYGON_TESTNET_RPC_URL=<your-polygon-testnet-rpc-url>
POLYGON_ETHERSCAN_API_KEY=<your-polygon-etherscan-key>

# Deployment
# ⚠️ CRITICAL: Use different keys for development and production
PRIVATE_KEY=<your-deployment-key>
```

## Security Best Practices

### Private Key Management

1. **Development vs Production**
   * Use separate keys for development and production
   * Never use production keys in development environment
   * Consider using hardware wallets for production deployments
2. **Key Storage**
   * Store private keys in secure environment variables
   * Never commit private keys to version control
   * Use key management services in production
3. **Access Control**
   * Implement multi-sig for critical operations
   * Regular key rotation
   * Audit logs for deployment activities

### API Key Security

1. **Key Management**
   * Use separate API keys for each environment
   * Regular rotation of API keys
   * Restrict API key permissions to minimum required
2. **Storage**
   * Store API keys in environment variables
   * Use secrets management in production
   * Never expose keys in client-side code

## Subgraph Deployment

### Subgraph Manifest

```yaml
# subgraph.yaml
specVersion: 0.0.4
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: SkillWallet
    network: {{network}}
    source:
      address: "{{address}}"
      abi: SkillWallet
      startBlock: {{startBlock}}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - Skill
        - User
      abis:
        - name: SkillWallet
          file: ./abis/SkillWallet.json
      eventHandlers:
        - event: SkillValidated(address,uint256,uint256)
          handler: handleSkillValidated
      file: ./src/mapping.ts
```

### Deployment Script

```typescript
// scripts/deploy-subgraph.ts
import { exec } from "child_process";
import { networkConfigs } from "../config";

async function deploySubgraph(network: string) {
  const config = networkConfigs[network];
  
  // Prepare manifest
  exec(`
    cat subgraph.yaml.template \
    | sed 's/{{network}}/${network}/g' \
    | sed 's/{{address}}/${config.contractAddress}/g' \
    | sed 's/{{startBlock}}/${config.startBlock}/g' \
    > subgraph.yaml
  `);
  
  // Deploy subgraph
  exec(`
    graph deploy --node https://api.thegraph.com/deploy/ \
    ${config.subgraph}
  `);
}
```

## Frontend Integration

### Chain Configuration

```typescript
// config/chains.ts
import { Chain } from 'wagmi';

export const baseChain: Chain = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  },
};

export const supportedChains = [baseChain, /* other chains */];
```

### Wallet Configuration

```typescript
// config/wagmi.ts
import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { supportedChains } from './chains';

export const { chains, publicClient } = configureChains(
  supportedChains,
  [publicProvider()]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
});
```

### Network Switching

```typescript
// hooks/useNetwork.ts
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { networkConfigs } from '../config';

export function useChainSwitch() {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  
  const switchToNetwork = async (networkName: string) => {
    const config = networkConfigs[networkName];
    if (chain?.id !== config.chainId) {
      await switchNetwork?.(config.chainId);
    }
  };
  
  return { switchToNetwork };
}
```

## Backend Integration

### Chain-Specific Services

```typescript
// services/ChainService.ts
import { ethers } from 'ethers';
import { networkConfigs } from '../config';

export class ChainService {
  private providers: Record<string, ethers.providers.JsonRpcProvider> = {};
  
  constructor() {
    Object.entries(networkConfigs).forEach(([network, config]) => {
      this.providers[network] = new ethers.providers.JsonRpcProvider(
        config.rpcUrl
      );
    });
  }
  
  async getSkillWallet(network: string, address: string) {
    const provider = this.providers[network];
    const contract = new ethers.Contract(
      networkConfigs[network].contractAddress,
      SkillWalletABI,
      provider
    );
    
    return contract;
  }
}
```

### GraphQL Integration

```typescript
// services/SubgraphService.ts
import { GraphQLClient } from 'graphql-request';
import { networkConfigs } from '../config';

export class SubgraphService {
  private clients: Record<string, GraphQLClient> = {};
  
  constructor() {
    Object.entries(networkConfigs).forEach(([network, config]) => {
      this.clients[network] = new GraphQLClient(
        `https://api.thegraph.com/subgraphs/name/${config.subgraph}`
      );
    });
  }
  
  async getUserSkills(network: string, address: string) {
    const client = this.clients[network];
    const query = `
      query GetUserSkills($address: String!) {
        user(id: $address) {
          skills {
            id
            level
            validatedAt
          }
        }
      }
    `;
    
    return client.request(query, { address });
  }
}
```

## Monitoring & Analytics

### Chain-Specific Metrics

```typescript
// monitoring/metrics.ts
import { Prometheus } from 'prom-client';

export const chainMetrics = {
  transactionCount: new Prometheus.Counter({
    name: 'aura_transactions_total',
    help: 'Total number of transactions',
    labelNames: ['network', 'status']
  }),
  
  gasUsed: new Prometheus.Histogram({
    name: 'aura_gas_used',
    help: 'Gas used by transactions',
    labelNames: ['network', 'operation']
  })
};
```

### Network Health Checks

```typescript
// monitoring/health.ts
import { networkConfigs } from '../config';

export async function checkNetworkHealth() {
  const results = await Promise.all(
    Object.entries(networkConfigs).map(async ([network, config]) => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
        const blockNumber = await provider.getBlockNumber();
        
        return {
          network,
          status: 'healthy',
          blockNumber
        };
      } catch (error) {
        return {
          network,
          status: 'unhealthy',
          error: error.message
        };
      }
    })
  );
  
  return results;
}
```

## Error Handling

### Chain-Specific Errors

```typescript
// errors/ChainError.ts
export class ChainError extends Error {
  constructor(
    public readonly network: string,
    public readonly code: string,
    message: string
  ) {
    super(`[${network}] ${message}`);
    this.name = 'ChainError';
  }
}

export function handleChainError(error: any, network: string) {
  if (error.code === 'NETWORK_ERROR') {
    throw new ChainError(network, 'NETWORK_ERROR', 'Network connection failed');
  }
  // Handle other chain-specific errors...
}
```

## Documentation

### Chain-Specific Documentation

```markdown
# Network Integration Guide

## Base Network
- RPC Endpoint: https://mainnet.base.org
- Chain ID: 8453
- Block Explorer: https://basescan.org
- Gas Token: ETH

### Configuration
1. Add network to MetaMask
2. Configure RPC endpoints
3. Set up contract verification

### Deployment Steps
1. Deploy core contracts
2. Deploy subgraph
3. Update frontend configuration
4. Test integration

## Other Networks
[Similar documentation for each supported network]
```
