'use client'

import dynamic from 'next/dynamic'
import { type ReactNode } from 'react'

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p>Loading application...</p>
    </div>
  )
}

const Web3Provider = dynamic(() => import('./Web3ModalProviderInner'), {
  ssr: false,
  loading: LoadingScreen
})

type Props = {
  children: ReactNode
}

export function Web3ModalProvider({ children }: Props) {
  return <Web3Provider>{children}</Web3Provider>
} 