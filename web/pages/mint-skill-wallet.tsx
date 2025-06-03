import React, { useState } from 'react';
import { useAccount, useReadContract, useDisconnect } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ConnectButton } from '../components/ConnectButton';
import { getSkillWalletContract } from '../utils/contracts';
import Link from 'next/link';

export default function MintSkillWallet() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const contractAddress = process.env.NEXT_PUBLIC_SKILL_WALLET_ADDRESS as `0x${string}` | undefined;

  const result = useReadContract({
    address: (contractAddress ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
    abi: getSkillWalletContract().abi,
    functionName: 'hasMinted',
    args: [(address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`],
    query: {
      enabled: Boolean(contractAddress && address),
    }
  });
  const hasMinted = result.data as boolean | undefined;
  const isChecking = result.isLoading;

  if (!contractAddress) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark px-4">
        <h1 className="text-3xl font-bold mb-6">Mint Skill Wallet</h1>
        <p className="text-red-500">Skill Wallet contract address is not set. Please check your environment variables.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Mint Skill Wallet | Pheme Protocol</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Mint Your Skill Wallet</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Get your soulbound NFT that represents your on-chain reputation
            </p>
          </div>

          {!isConnected ? (
            <div className="text-center">
              <p className="mb-4 text-gray-600 dark:text-gray-400">Connect your wallet to get started</p>
              <ConnectButton />
            </div>
          ) : isChecking ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Checking wallet status...</p>
            </div>
          ) : hasMinted ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">Skill Wallet Already Minted</h2>
                <p className="text-green-600 dark:text-green-400 mb-4">
                  You have already minted your Skill Wallet, which represents your on-chain reputation in the Pheme Protocol.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/dashboard', undefined, { shallow: true })}
                  className="w-full sm:w-auto bg-primary-light dark:bg-primary-dark text-white px-6 py-2.5 rounded-md font-semibold hover:bg-primary-dark dark:hover:bg-primary-light focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:outline-none transition-colors text-center"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    disconnect();
                    router.push('/');
                  }}
                  className="w-full sm:w-auto border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white px-6 py-2.5 rounded-md font-semibold hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">You have already minted a Skill Wallet</p>
              <button
                onClick={() => router.push('/dashboard', undefined, { shallow: true })}
                className="inline-block w-full px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 