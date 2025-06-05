import React, { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Wallet, ExternalLink, Shield, CheckCircle2 } from 'lucide-react';
import { useSkillWallet } from '../hooks/useSkillWallet';
import { createPortal } from 'react-dom';

export function SkillWalletDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  const { hasMinted } = useSkillWallet();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!hasMinted) return null;

  const buttonRect = buttonRef.current?.getBoundingClientRect();

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Wallet className="w-4 h-4" />
        View Skill Wallet
      </button>

      {isOpen && buttonRect && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 9999 }}>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div 
            ref={dropdownRef}
            className="fixed w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            style={{ 
              top: `${buttonRect.bottom + 8}px`,
              right: `${window.innerWidth - buttonRect.right}px`
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 dark:bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <Wallet className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Skill Wallet</h3>
                  <p className="text-blue-100 text-sm">Soulbound NFT</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                <span>Active</span>
              </div>

              {/* Wallet Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Owner</span>
                  <span className="text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Type</span>
                  <span className="text-gray-900 dark:text-white font-medium">Non-transferable</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Security</span>
                  <span className="text-gray-900 dark:text-white font-medium flex items-center gap-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Soulbound
                  </span>
                </div>
              </div>

              {/* Explorer Link */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={`https://sepolia.basescan.org/token/${process.env.NEXT_PUBLIC_SKILL_WALLET_ADDRESS}?a=${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View on Explorer
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
} 