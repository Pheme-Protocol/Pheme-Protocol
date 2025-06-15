import { http } from 'wagmi'
import { walletConnect, injected } from 'wagmi/connectors'
import { base, baseSepolia } from 'wagmi/chains'
import { createConfig } from 'wagmi'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID');
}

// Use testnet for development, mainnet for production
const targetChain = process.env.NODE_ENV === 'production' ? base : baseSepolia;

export const wagmiConfig = createConfig({
  chains: [targetChain],
  connectors: [
    walletConnect({
      projectId,
      showQrModal: true,
      metadata: {
        name: 'PHEME Protocol',
        description: 'Decentralized skill verification platform',
        url: 'https://pheme.app',
        icons: ['https://pheme.app/icon.png']
      }
    }),
    injected()
  ],
  transports: {
    84532: http(),
    8453: http()
  },
})
