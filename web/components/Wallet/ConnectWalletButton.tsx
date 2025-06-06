import React from 'react';
import { useWallet } from '../../contexts/WalletContext';

export function ConnectWalletButton() {
  const { address, isConnected, connect, disconnect, error } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <button
        onClick={isConnected ? disconnect : connect}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isConnected ? `Disconnect (${formatAddress(address!)})` : 'Connect Wallet'}
      </button>
    </div>
  );
} 