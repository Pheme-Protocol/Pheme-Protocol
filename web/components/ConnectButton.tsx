/**
 * Pheme Protocol - A Web3-enabled chat application with wallet integration
 * Copyright (C) 2024 Pheme Protocol
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

'use client'

import { useDisconnect } from 'wagmi'
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'

interface ConnectButtonProps {
  onError?: (error: Error) => void
  onConnectClick?: () => void
  onClick?: () => void
}

export function ConnectButton({ onError, onConnectClick, onClick }: ConnectButtonProps) {
  const { disconnect } = useDisconnect()
  const [isTestMode, setIsTestMode] = useState(false)

  useEffect(() => {
    // Check if we're in test mode
    const testMode = localStorage.getItem('__TEST__') === 'true'
    setIsTestMode(testMode)
  }, [])
  
  if (isTestMode) {
    // In test mode, render a simple button that simulates connection
    return (
      <button
        onClick={() => {
          onClick?.()
          onConnectClick?.()
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-semibold"
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted

        if (!ready) {
          return null
        }

        if (!account) {
          return (
            <button
              onClick={async () => {
                onClick?.();
                onConnectClick?.();
                try {
                  await openConnectModal?.();
                } catch (error) {
                  onError?.(error as Error);
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-semibold"
            >
              Connect Wallet
            </button>
          )
        }

        return (
          <button
            onClick={() => disconnect()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-semibold flex items-center gap-2"
          >
            <span>Disconnect</span>
            <span className="text-sm opacity-80">
              ({account.displayName})
            </span>
          </button>
        )
      }}
    </RainbowConnectButton.Custom>
  )
}