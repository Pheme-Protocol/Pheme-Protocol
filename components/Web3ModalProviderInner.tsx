'use client'

import { getDefaultWallets, RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { base } from '@reown/appkit/networks'
import { ReactNode } from 'react'
import '@rainbow-me/rainbowkit/styles.css'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
if (!projectId) throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')

const { wallets } = getDefaultWallets({
  appName: 'PHEME',
  projectId
})

const connectors = connectorsForWallets([
  ...wallets,
], {
  projectId,
  appName: 'PHEME',
  appDescription: 'PHEME - Web3 Chat Platform',
  appUrl: 'https://aurabot.app'
})

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http()
  },
  connectors
})

const queryClient = new QueryClient()

interface Props {
  children: ReactNode
}

export default function Web3ModalProviderInner({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          appInfo={{
            appName: 'PHEME',
            learnMoreUrl: 'https://aurabot.app',
          }}
          modalSize="compact"
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 