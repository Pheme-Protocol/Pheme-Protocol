import { http, createConfig } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'
import { base } from 'wagmi/chains'

// Check for required environment variable
if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID');
}

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      showQrModal: true, // 🔥 this MUST be true!
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})
