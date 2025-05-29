'use client'

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { base, mainnet } from 'viem/chains'
import '@rainbow-me/rainbowkit/styles.css'
import { type ReactNode } from 'react'

const queryClient = new QueryClient()

const config = getDefaultConfig({
  appName: 'PHEME',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  chains: [base, mainnet],
  ssr: true
})

function ErrorScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p>Failed to load Web3 components. Please refresh the page.</p>
    </div>
  )
}

type Props = {
  children: ReactNode
}

export default function Web3ModalProviderInner({ children }: Props) {
  if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
    console.error('WalletConnect Project ID is not set')
    return <ErrorScreen />
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={base}
          showRecentTransactions={true}
          appInfo={{
            appName: 'PHEME',
            learnMoreUrl: 'https://pheme.app',
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 