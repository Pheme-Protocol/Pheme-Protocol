import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ConnectButton } from '../components/ConnectButton';
import { getSkillWalletContract } from '../utils/contracts';

// Create public client
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

export default function MintSkillWallet() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_SKILL_WALLET_ADDRESS as `0x${string}` | undefined;

  const [showModal, setShowModal] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [mintTxHash, setMintTxHash] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { writeContract, data, isPending, isSuccess, error, reset: resetWrite } = useWriteContract();

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

  // Fetch the mint transaction hash if the user has minted
  useEffect(() => {
    async function fetchMintTxHash() {
      if (hasMinted && contractAddress && address) {
        try {
          const logs = await publicClient.getLogs({
            address: contractAddress,
            event: {
              name: 'SkillWalletMinted',
              inputs: [
                { indexed: true, name: 'to', type: 'address' },
                { indexed: true, name: 'tokenId', type: 'uint256' }
              ],
              anonymous: false,
              type: 'event',
            },
            args: { to: address },
            fromBlock: 'earliest',
            toBlock: 'latest',
          });
          if (logs.length > 0) {
            setMintTxHash(logs[0].transactionHash);
          }
        } catch (e) {
          console.error('Error fetching mint transaction:', e);
        }
      }
    }
    fetchMintTxHash();
  }, [hasMinted, contractAddress, address]);

  // Wait for transaction receipt and extract tokenId
  let receipt: any = undefined;
  let txConfirmed = false;
  const txHash = (data as any)?.hash;
  if (txHash) {
    const txResult = useWaitForTransactionReceipt({ hash: txHash });
    receipt = txResult.data;
    txConfirmed = txResult.isSuccess;
  }

  React.useEffect(() => {
    if (txConfirmed && receipt && receipt.logs) {
      // Find the SkillWalletMinted event
      const iface = new (require('ethers').utils.Interface)(getSkillWalletContract().abi);
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed.name === 'SkillWalletMinted') {
            setMintedTokenId(parsed.args.tokenId.toString());
            setShowModal(true);
            break;
          }
        } catch (e) {
          // Not the right event, skip
        }
      }
    }
  }, [txConfirmed, receipt]);

  React.useEffect(() => {
    if (error) {
      if (error.message && error.message.toLowerCase().includes('already minted')) {
        setToast('You already own a Skill Wallet.');
      } else if (error.message && error.message.toLowerCase().includes('insufficient funds')) {
        setErrorBanner('Insufficient funds to mint. Please ensure you have enough ETH for gas fees.');
      } else if (error.message && error.message.toLowerCase().includes('user rejected')) {
        setErrorBanner('Transaction rejected. Redirecting to home page...');
        setIsRedirecting(true);
        // Redirect after a short delay to show the message
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setErrorBanner('Please switch to Base Sepolia network to continue');
      }
      // Reset error after a short delay
      setTimeout(() => {
        setToast(null);
        setErrorBanner(null);
        resetWrite();
      }, 4000);
    }
  }, [error, resetWrite, router]);

  const handleMint = () => {
    if (!contractAddress) return;
    setToast(null);
    setErrorBanner(null);
    writeContract?.({
      address: contractAddress,
      abi: getSkillWalletContract().abi,
      functionName: 'mint',
      chainId: baseSepolia.id,
    });
  };

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
            <div className="text-center space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-600 dark:text-green-400 font-medium">You have already minted your Skill Wallet</p>
              </div>
              <a
                href="/dashboard"
                className="inline-block px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-800 transition-colors"
              >
                View Skill Wallet
              </a>
              {mintTxHash && (
                <a
                  href={`https://sepolia.basescan.org/tx/${mintTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
                >
                  View Mint Transaction
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {errorBanner && (
                <div className={`px-4 py-3 rounded-lg ${
                  isRedirecting 
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {errorBanner}
                </div>
              )}
              <button
                className="w-full px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                disabled={!isConnected || isPending || isSuccess || isRedirecting}
                onClick={handleMint}
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Minting...
                  </span>
                ) : isSuccess ? (
                  'Minted!'
                ) : isRedirecting ? (
                  'Redirecting...'
                ) : (
                  'Mint Skill Wallet'
                )}
              </button>
              {isSuccess && (
                <p className="text-center text-green-600 dark:text-green-400">
                  Transaction sent! Waiting for confirmation...
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showModal && mintedTokenId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">✨ Skill Wallet Minted!</h2>
            <p className="mb-2 text-gray-600 dark:text-gray-400">Your Skill Wallet has been successfully minted</p>
            <p className="mb-4 font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">Token ID: {mintedTokenId}</p>
            <div className="space-y-3">
              <a
                href={`https://sepolia.basescan.org/token/${contractAddress}?a=${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View on Explorer
              </a>
              <a
                href="/dashboard"
                className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Go to Dashboard
              </a>
              <button
                className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </>
  );
} 