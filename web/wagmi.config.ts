import { http, createConfig } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'
import { base } from 'viem/chains'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID');
}

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    walletConnect({
      projectId,
      showQrModal: true, // 🔥 this MUST be true!
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})
