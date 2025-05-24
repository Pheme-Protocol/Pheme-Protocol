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

// pages/_app.tsx
import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { WagmiProvider } from 'wagmi';
import { base } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit/react';
import { cookieStorage, createStorage } from 'wagmi';
import { type Config, cookieToInitialState } from 'wagmi';
import type { Chain } from 'viem';
import { http } from 'viem';

// Create the QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

// WalletConnect Project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID');
}

// Set up metadata
const metadata = {
  name: 'AURA CHATBOT',
  description: 'AURA CHATBOT - Your AI Assistant',
  url: 'https://aura-chatbot.com',
  icons: ['https://aura-chatbot.com/icon.png']
};

// Set up networks
const networks = [base] as [Chain, ...Chain[]];

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  projectId,
  networks,
  transports: {
    [base.id]: http()
  },
  ssr: true
});

// Create AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'x', 'github', 'discord', 'apple'],
    emailShowWallets: true
  }
});

// Main App
export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false);
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {mounted && <Component {...pageProps} />}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
