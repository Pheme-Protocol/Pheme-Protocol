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
import { Web3ModalProvider } from '../components/Web3ModalProvider';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ModalProvider>
      <Head>
        <title>AuraBot - AI Chat Assistant</title>
        <link rel="icon" href="/Aura_wave.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/Aura_wave.svg" />
        <link rel="shortcut icon" type="image/svg+xml" href="/Aura_wave.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </Head>
      <Component {...pageProps} />
    </Web3ModalProvider>
  );
}
