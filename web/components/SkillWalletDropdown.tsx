import React, { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Wallet } from 'lucide-react';
import { useSkillWallet } from '../hooks/useSkillWallet';

export function SkillWalletDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  const { hasMinted } = useSkillWallet();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!hasMinted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
      >
        <Wallet className="w-4 h-4" />
        View Skill Wallet
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-primary-light/20 to-primary-dark/20 dark:from-primary-light/10 dark:to-primary-dark/10 rounded-xl p-3">
                <Wallet className="h-8 w-8 text-primary-light dark:text-primary-dark" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Skill Wallet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Soulbound NFT</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">Owner</span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">Status</span>
                <span className="text-green-600 dark:text-green-400">Active</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">Type</span>
                <span className="text-gray-900 dark:text-white">Non-transferable</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href={`https://sepolia.basescan.org/token/${process.env.NEXT_PUBLIC_SKILL_WALLET_ADDRESS}?a=${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                View on Explorer
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 