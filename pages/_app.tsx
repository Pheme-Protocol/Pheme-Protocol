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
import React from 'react';
import '../styles/globals.css';
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
import Head from 'next/head';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { WalletKitProvider } from '@reown/walletkit';

// Create the QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

// Configure chains & providers
const { chains, provider, webSocketProvider } = configureChains(
  [base],
  [publicProvider()]
);

// Set up wagmi client
const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

// WalletConnect Project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID');
}

// Set up metadata
const metadata = {
  name: 'Aura Web',
  description: 'Aura Web Application',
  url: 'https://aura-web.com',
  icons: ['https://aura-web.com/icon.png']
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
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <title>Aura Web</title>
      </Head>
      <WagmiConfig client={client}>
        <WalletKitProvider
          projectId={projectId}
          chains={chains}
          metadata={{
            name: 'Aura Web',
            description: 'Aura Web Application',
            url: 'https://aura-web.com',
            icons: ['https://aura-web.com/icon.png']
          }}
        >
          <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
              {mounted && <Component {...pageProps} />}
            </QueryClientProvider>
          </WagmiProvider>
        </WalletKitProvider>
      </WagmiConfig>
    </>
  );
}
