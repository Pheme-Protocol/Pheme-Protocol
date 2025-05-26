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
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { Web3ModalProvider } from '../components/Web3ModalProvider';
import { ThemeProvider } from '../contexts/ThemeContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Web3ModalProvider>
        <main className={`${inter.variable} font-sans antialiased`}>
          <Head>
            <title>AURA - Earn Trust Onchain</title>
            <link rel="icon" href="/Aura_wave.svg" type="image/svg+xml" />
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            <link rel="shortcut icon" type="image/svg+xml" href="/Aura_wave.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#60A5FA" />
            <meta name="description" content="AURA is a peer-to-peer AI validator network that verifies real contributions and builds onchain reputation." />
            <meta property="og:title" content="AURA - Earn Trust Onchain" />
            <meta property="og:description" content="AURA is a peer-to-peer AI validator network that verifies real contributions and builds onchain reputation." />
            <meta property="og:image" content="/Aura_wave.svg" />
            <meta name="twitter:card" content="summary_large_image" />
          </Head>
          <Component {...pageProps} />
        </main>
      </Web3ModalProvider>
    </ThemeProvider>
  );
}

export default App; 