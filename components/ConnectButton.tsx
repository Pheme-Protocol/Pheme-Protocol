/**
 * Aura Chat - A Web3-enabled chat application with wallet integration
 * Copyright (C) 2024 Aura Chat
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