import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ConnectButton } from '../components/ConnectButton';
import { useAccount } from 'wagmi';
import { AuraChat } from '../components/AuraChat';
import { Wallet, UserCheck, Users } from 'lucide-react';
import AuraLogo from '../components/AuraLogo';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { SupportChat } from '../components/SupportChat';

export default function Home() {
  const { isConnected } = useAccount();
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [email, setEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [key, setKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistStatus('loading');
    // TODO: Implement waitlist API
    setTimeout(() => {
      setWaitlistStatus('success');
      setTimeout(() => {
        setShowWaitlistModal(false);
        setWaitlistStatus('idle');
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-gray-900 dark:text-white transition-colors">
      {/* Header with Navigation */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image 
            src="/Aura_wave.svg" 
            alt="PHEME Logo" 
            width={38} 
            height={38}
            priority
            quality={100}
            className="flex-shrink-0"
            style={{
              transform: 'translateZ(0)'
            }}
          />
          <h1 className="text-4xl font-bold text-primary-light dark:text-primary-dark">PHEME</h1>
        </div>
        <Navigation />
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="max-w-2xl">
              {/* Headline and Tagline */}
              <h2 className="text-5xl font-bold mb-6 leading-tight">Earn Trust Onchain</h2>
              <p className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-6">
                The bridge between who you are and who you want to become.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Pheme is a peer-to-peer AI validator network that verifies real contributions and builds onchain reputation.
              </p>

              {/* Call-to-Action Buttons */}
              <div className="flex gap-4 mb-12">
                <ConnectButton />
                <button 
                  onClick={() => setShowWaitlistModal(true)}
                  className="border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white px-6 py-2.5 rounded-md font-semibold hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors"
                >
                  Join Waitlist
                </button>
              </div>

              {/* Blockchain Logos */}
              <div className="flex flex-wrap gap-8 items-center opacity-90 dark:opacity-100">
                <Image 
                  src="/logos/base.svg" 
                  alt="base" 
                  width={32} 
                  height={32} 
                  className="hover:opacity-80 hover:scale-110 transform transition-all duration-300 hover:brightness-110"
                />
                <Image 
                  src="/logos/polygon.svg" 
                  alt="polygon" 
                  width={32} 
                  height={32} 
                  className="hover:opacity-80 hover:scale-110 transform transition-all duration-300 hover:brightness-110"
                />
                <Image 
                  src="/logos/ethereum.svg" 
                  alt="ethereum" 
                  width={32} 
                  height={32} 
                  className="hover:opacity-80 hover:scale-110 transform transition-all duration-300 hover:brightness-110"
                />
                <Image 
                  src="/logos/optimism.png"
                  alt="Optimism" 
                  width={32}
                  height={32}
                  className="hover:opacity-80 hover:scale-110 transform transition-all duration-300 hover:brightness-110"
                  priority
                  quality={100}
                  style={{
                    transform: 'translateZ(0)',
                    willChange: 'transform',
                    imageRendering: 'crisp-edges'
                  }}
                />
                <Image 
                  src="/logos/binance.svg" 
                  alt="BNB Chain" 
                  width={32} 
                  height={32} 
                  className="hover:opacity-80 hover:scale-110 transform transition-all duration-300 hover:brightness-110"
                  priority
                  quality={100}
                  style={{
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                  }}
                />
              </div>
            </div>

            {/* Right Content - Chat Interface */}
            <div className="lg:sticky lg:top-8">
              {isConnected ? (
                <AuraChat />
              ) : (
                <div key={key} className="bg-white dark:bg-gray-900 rounded-[40px] text-gray-900 dark:text-white p-3 shadow-2xl border-8 border-gray-900 dark:border-black relative overflow-hidden">
                  {/* Device Frame Details */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-b from-gray-800/5 to-transparent pointer-events-none" 
                    aria-hidden="true"
                    tabIndex={-1}
                  ></div>
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200/20 to-transparent"></div>
                  
                  {/* iPhone Notch */}
                  <div className="bg-black h-6 w-40 rounded-b-2xl mx-auto mb-2 relative shadow-lg">
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-1 w-16 h-3 bg-black rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-800 rounded-full absolute left-3"></div>
                      <div className="w-1.5 h-1.5 bg-gray-700 rounded-full absolute right-3"></div>
                    </div>
                  </div>
                  
                  {/* Chat Content */}
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 min-h-[500px] shadow-inner relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/50 dark:from-white/5 to-transparent opacity-50 rounded-3xl pointer-events-none"></div>
                    <h3 className="font-bold text-center text-xl mb-6">Talk to PHEME</h3>
                    <div className="space-y-4" role="log" aria-live="polite">
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                        <div className="typing-indicator mb-2" aria-hidden="true">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                        <span className="block text-gray-900 dark:text-gray-100">Verify my smart contract development skills.</span>
                      </div>
                      
                      <div className="bg-blue-700 text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%] ml-auto shadow-sm">
                        <div className="typing-indicator mb-2" aria-hidden="true">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                        <span className="block">Please provide links to your projects or repository</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          isLoading || !input.trim()
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed'
                            : 'bg-blue-700 text-white hover:bg-blue-800 dark:hover:bg-blue-600'
                        }`}
                        disabled={isLoading || !input.trim()}
                      >
                        {isLoading ? 'Connecting...' : 'Connect Wallet'}
                      </button>
                    </div>
                  </div>

                  {/* iPhone Home Bar */}
                  <div className="h-1 w-32 bg-black rounded-full mx-auto mt-4 opacity-80"></div>
                  
                  {/* Device Edge Highlights */}
                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200/20 to-transparent"></div>
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-gray-200/20 to-transparent"></div>
                  <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-gray-200/20 to-transparent"></div>
                </div>
              )}
            </div>
          </div>

          {/* Features Section - Full Width */}
          <div className="mt-24 -mx-4 px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
              {/* Skill Wallet */}
              <div className="flex items-start space-x-6 group">
                <div className="bg-gradient-to-br from-primary-light/20 to-primary-dark/20 dark:from-primary-light/10 dark:to-primary-dark/10 rounded-xl p-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:from-primary-light/30 group-hover:to-primary-dark/30">
                  <Wallet className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-primary-light dark:group-hover:text-primary-dark">Skill Wallet</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">
                    Immutable, non-transferable proof of skill stored onchain.
                  </p>
                </div>
              </div>

              {/* Reputation Oracle */}
              <div className="flex items-start space-x-6 group">
                <div className="bg-gradient-to-br from-primary-light/20 to-primary-dark/20 dark:from-primary-light/10 dark:to-primary-dark/10 rounded-xl p-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:from-primary-light/30 group-hover:to-primary-dark/30">
                  <UserCheck className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-primary-light dark:group-hover:text-primary-dark">Reputation Oracle</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">
                    AI-reviewed scores to filter real contributors.
                  </p>
                </div>
              </div>

              {/* Community Governance */}
              <div className="flex items-start space-x-6 group">
                <div className="bg-gradient-to-br from-primary-light/20 to-primary-dark/20 dark:from-primary-light/10 dark:to-primary-dark/10 rounded-xl p-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:from-primary-light/30 group-hover:to-primary-dark/30">
                  <Users className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-primary-light dark:group-hover:text-primary-dark">Community Governance</p>
                  <p className="text-base text-gray-700 dark:text-gray-300">
                    Decisions made by token holders in full transparency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Waitlist Modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 bg-black/75 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Join the Waitlist</h3>
            <form onSubmit={handleWaitlist}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border-2 rounded-lg p-3 mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={waitlistStatus === 'loading'}
                className={`w-full bg-primary-light dark:bg-primary-dark text-white rounded-lg p-3 font-semibold ${
                  waitlistStatus === 'loading' ? 'opacity-50' : 'hover:bg-primary-dark dark:hover:bg-primary-light'
                } transition-colors`}
              >
                {waitlistStatus === 'loading' ? 'Joining...' : 
                 waitlistStatus === 'success' ? 'Joined!' : 
                 'Join Waitlist'}
              </button>
            </form>
            <button
              onClick={() => setShowWaitlistModal(false)}
              className="mt-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Support Chat */}
      <SupportChat />
    </div>
  );
} 