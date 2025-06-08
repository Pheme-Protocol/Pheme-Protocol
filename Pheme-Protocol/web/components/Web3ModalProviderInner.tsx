'use client'

import { getDefaultWallets, RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { base } from '@reown/appkit/networks'
import { ReactNode, useEffect, useState } from 'react'
import '@rainbow-me/rainbowkit/styles.css'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
if (!projectId) throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')

// Update base network configuration with required fees structure
const updatedBase = {
  ...base,
  fees: {
    defaultPriorityFee: BigInt(0),
    defaultMaxFeePerGas: BigInt(0),
    defaultMaxPriorityFeePerGas: BigInt(0),
  },
}

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
  appUrl: 'https://pheme.app'
})

const config = createConfig({
  chains: [updatedBase],
  transports: {
    [updatedBase.id]: http()
  },
  connectors
})

const queryClient = new QueryClient()

interface Props {
  children: ReactNode
}

export default function Web3ModalProviderInner({ children }: Props) {
  const [isTestMode, setIsTestMode] = useState(false)

  useEffect(() => {
    // Check if we're in test mode
    const testMode = localStorage.getItem('__TEST__') === 'true'
    setIsTestMode(testMode)
  }, [])

  if (isTestMode) {
    // In test mode, render children without RainbowKit
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    )
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          appInfo={{
            appName: 'PHEME',
            learnMoreUrl: 'https://pheme.app',
          }}
          modalSize="compact"
          showRecentTransactions={true}
          initialChain={updatedBase}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 