'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p>Loading application...</p>
    </div>
  )
}

// Dynamically import the inner provider with SSR disabled
const Web3Provider = dynamic<{ children: ReactNode }>(
  () => import('@/components/Web3ModalProviderInner'),
  {
    ssr: false,
    loading: LoadingScreen
  }
)

interface Props {
  children: ReactNode
}

export function Web3ModalProvider({ children }: Props) {
  return <Web3Provider>{children}</Web3Provider>
} 