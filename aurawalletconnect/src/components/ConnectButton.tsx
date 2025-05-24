import React from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect } from 'wagmi';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <appkit-button />
    );
  }

  return (
    <button
      onClick={() => disconnect()}
      className="rounded-full border border-solid transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8"
    >
      Disconnect
      <span className="text-xs opacity-70">
        ({address?.slice(0, 6)}...{address?.slice(-4)})
      </span>
    </button>
  );
} 