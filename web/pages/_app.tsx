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

// pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Web3ModalProvider } from '@/components/Web3ModalProvider';
import { Inter, Orbitron, Fira_Mono } from 'next/font/google';
import Head from 'next/head';
import { ThemeProvider } from '../contexts/ThemeContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron'
});

const firaMono = Fira_Mono({ 
  weight: ['400', '700'], 
  subsets: ['latin'],
  variable: '--font-fira-mono'
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>PHEME - Earn Trust Onchain</title>
        <meta name="description" content="Pheme is a peer-to-peer AI validator network that verifies real contributions and builds onchain reputation." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/Pheme_wave.svg" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:title" content="PHEME - Earn Trust Onchain" />
        <meta property="og:description" content="Pheme is a peer-to-peer AI validator network that verifies real contributions and builds onchain reputation." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/Pheme_wave.svg" />
        <meta name="theme-color" content="#60A5FA" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a4bbd" media="(prefers-color-scheme: dark)" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="application-name" content="PHEME" />
        <meta name="apple-mobile-web-app-title" content="PHEME" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <ThemeProvider>
        <Web3ModalProvider>
          <main className={`${inter.variable} ${orbitron.variable} ${firaMono.variable} font-sans antialiased`}>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black">
              Skip to main content
            </a>
            <main id="main-content" className="min-h-screen" role="main">
              <Component {...pageProps} />
            </main>
          </main>
        </Web3ModalProvider>
      </ThemeProvider>
    </>
  );
} 