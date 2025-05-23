import { http, createConfig } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'
import { base } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    walletConnect({
      projectId: '3d44d5da3ee637236301d71b7ed34b40', // ✅ your real WC Project ID
      showQrModal: true, // 🔥 this MUST be true!
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})
