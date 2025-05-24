'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()

  if (!isConnected) {
    return (
      <button
        onClick={() => open()}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <button
      onClick={() => disconnect()}
      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold flex items-center gap-2"
    >
      <span>Disconnect</span>
      {address && (
        <span className="text-sm opacity-80">
          ({address.slice(0, 6)}...{address.slice(-4)})
        </span>
      )}
    </button>
  )
}