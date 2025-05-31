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

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { useDisconnect } from 'wagmi'

export function ConnectButton() {
  const { disconnect } = useDisconnect()
  
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
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
              onClick={openConnectModal}
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