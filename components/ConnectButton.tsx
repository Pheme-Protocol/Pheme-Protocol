'use client'

import { useAppKit } from '@reown/appkit/react'

export function ConnectButton() {
  const { open } = useAppKit()

  return (
    <button
      onClick={() => open()}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
    >
      Connect Wallet
    </button>
  )
}