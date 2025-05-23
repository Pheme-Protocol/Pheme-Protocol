// pages/_app.tsx
'use client';

import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit/react';
import { cookieStorage, createStorage } from 'wagmi';
import { type Config, cookieToInitialState } from 'wagmi';
import type { Chain } from 'viem';

// ✅ Create the required QueryClient
const queryClient = new QueryClient();

// ✅ WalletConnect Project ID - Get this from https://cloud.reown.com
const projectId = 'd1f17d2a950ed5ae72e2378345aeba58';

// ✅ Set up metadata
const metadata = {
  name: 'Aura Web',
  description: 'Aura Web Application',
  url: 'https://aura-web.com',
  icons: ['https://aura-web.com/icon.png']
};

// ✅ Set up networks
const networks = [base] as [Chain, ...Chain[]];

// ✅ Create Wagmi Adapter
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

// ✅ Create AppKit instance
const appKit = createAppKit({
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

// ✅ Main App
export default function App({ Component, pageProps }: AppProps) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
