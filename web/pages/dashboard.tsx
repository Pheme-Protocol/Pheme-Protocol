import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ConnectButton } from '../components/ConnectButton';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Wallet, UserCheck, Users } from 'lucide-react';
import PhemeLogo from '../components/PhemeLogo';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { SupportChat } from '../components/SupportChat';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PhemeChat from '../components/PhemeChat';
import { Message } from '../types/Message';

export default function Dashboard() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [email, setEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [walletConnectAttempted, setWalletConnectAttempted] = useState(false);
  const [walletConnectError, setWalletConnectError] = useState<string | null>(null);
  const [walletConnectInitiated, setWalletConnectInitiated] = useState(false);
  const [connectClicked, setConnectClicked] = useState(false);

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected && router.isReady) {
      router.replace('/');
    }
  }, [isConnected, router.isReady, router]);

  // Check if the page was loaded via reload
  useEffect(() => {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
      if (navEntry.type === 'reload' && !isConnected) {
        // Only redirect if user is not connected
        router.replace('/');
      }
    }
  }, [router, isConnected]);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && isConnected) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isMobile, isConnected]);

  // Clear error if user connects
  useEffect(() => {
    if (isConnected) {
      setWalletConnectError(null);
      setWalletConnectAttempted(false);
      setConnectClicked(false);
    }
  }, [isConnected]);

  // Auto-hide wallet connect error after 5 seconds
  useEffect(() => {
    if (walletConnectAttempted && walletConnectError && !isConnected) {
      const timer = setTimeout(() => {
        setWalletConnectAttempted(false);
        setWalletConnectError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [walletConnectAttempted, walletConnectError, isConnected]);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          walletAddress: address || '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join waitlist');
      }

      setWaitlistStatus('success');
      setTimeout(() => {
        setShowWaitlistModal(false);
        setWaitlistStatus('idle');
        setEmail('');
      }, 2000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to join waitlist');
      setWaitlistStatus('error');
    }
  };

  // Main content component
  const MainContent = () => (
    <div className="card bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-3xl p-10 transition-all duration-300">
      {/* Headline and Tagline */}
      <h2 className="text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight text-white">Earn Trust Onchain</h2>
      <p className="text-xl lg:text-2xl font-medium text-white mb-4 lg:mb-6">
        The bridge between who you are and who you want to become.
      </p>
      <p className="text-base lg:text-lg text-white mb-6 lg:mb-8">
        Pheme is a peer-to-peer AI validator network that verifies real contributions and builds onchain reputation.
      </p>

      {/* Call-to-Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 lg:mb-12">
        <ConnectButton 
          onClick={() => setConnectClicked(true)}
          onConnectClick={() => setWalletConnectInitiated(true)}
          onError={(err: unknown) => {
            let msg = '';
            if (typeof err === 'string') {
              msg = err.toLowerCase();
            } else if (err && typeof err === 'object') {
              if ('message' in err && typeof (err as { message?: unknown }).message === 'string') {
                msg = ((err as { message: string }).message).toLowerCase();
              } else if ('reason' in err && typeof (err as { reason?: unknown }).reason === 'string') {
                msg = ((err as { reason: string }).reason).toLowerCase();
              }
            }
            if (
              walletConnectInitiated &&
              msg &&
              (msg.includes('rejected') ||
                msg.includes('user denied') ||
                msg.includes('cancel') ||
                msg.includes('user closed') ||
                msg.includes('user closed modal'))
            ) {
              setWalletConnectError('You rejected the wallet connection. Please connect your wallet to continue.');
            }
            setWalletConnectInitiated(false);
          }}
        />
        {waitlistStatus !== 'success' && (
          <button 
            onClick={() => setShowWaitlistModal(true)}
            className="btn-primary bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl border-2 border-blue-700 hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Join Waitlist
          </button>
        )}
      </div>

      {/* Blockchain Logos */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-6 sm:gap-8 items-center opacity-90 dark:opacity-100">
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
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
      </div>
    </div>
  );

  // iPhone interface component
  const IPhoneInterface = () => {
    // Lock body scroll when chat is active on mobile
    useEffect(() => {
      if (isMobile && isConnected) {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = 'auto';
        };
      }
    }, []);

    // For mobile: only show PhemeChat when connected
    if (isMobile) {
      if (!isConnected) return null;

      return (
        <div className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col overflow-hidden">
          {/* Disconnect button at the top */}
          <div className="px-4 py-3 flex justify-end border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <button
              onClick={() => {
                disconnect();
              }}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors"
            >
              Disconnect
            </button>
          </div>
          {/* Chat interface */}
          <div className="flex-1 overflow-hidden">
            <PhemeChat messages={messages} setMessages={setMessages} />
          </div>
        </div>
      );
    }

    // For desktop: show iPhone interface demo before connection, PhemeChat after connection
    return (
      <div className="lg:sticky lg:top-8 w-full max-w-md mx-auto lg:max-w-none h-[600px]">
        {isConnected ? (
          <div className="h-full">
            <PhemeChat messages={messages} setMessages={setMessages} />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-[40px] text-gray-900 dark:text-white p-3 shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_0_60px_-15px_rgba(255,255,255,0.1)] border-[12px] border-gray-900 dark:border-gray-950 relative overflow-hidden ring-2 ring-gray-900/30 dark:ring-white/20">
            {/* Device Frame Details */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-gray-800/20 to-transparent pointer-events-none" 
              aria-hidden="true"
              tabIndex={-1}
            ></div>
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gray-200/40 to-transparent"></div>
            
            {/* iPhone Notch */}
            <div className="bg-gray-950 h-6 w-40 rounded-b-2xl mx-auto mb-2 relative shadow-xl">
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
                <div className="animate-fade-in-1">
                  <div className="flex justify-start">
                    <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                      <div className="typing-indicator mb-2" aria-hidden="true">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                      <span className="block">Hi! I'd like to verify my smart contract development skills.</span>
                    </div>
                  </div>
                </div>
                
                <div className="animate-fade-in-2">
                  <div className="flex justify-end">
                    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="typing-indicator mb-2" aria-hidden="true">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                      <span className="block">I can help with that! Please share your GitHub profile or project repositories.</span>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in-3">
                  <div className="flex justify-start">
                    <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                      <div className="typing-indicator mb-2" aria-hidden="true">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                      <span className="block">Here's my GitHub: https://github.com/user/project</span>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in-4">
                  <div className="flex justify-start">
                    <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                      <div className="typing-indicator mb-2" aria-hidden="true">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                      <span className="block">https://github.com/user/project-2</span>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in-5">
                  <div className="flex justify-end">
                    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="typing-indicator mb-2" aria-hidden="true">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                      <span className="block">Your skills look promising! Let's connect your wallet to start the verification process.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={openConnectModal}
                  className={`w-full px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    isLoading
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed'
                      : 'bg-blue-700 text-white hover:bg-blue-900 dark:hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  }`}
                  disabled={isLoading}
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
    );
  };

  return (
    <>
      <Head>
        <title>PHEME - Earn Trust Onchain</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="description" content="PHEME is a peer-to-peer AI validator network that verifies real contributions and builds onchain reputation." />
        <meta property="og:title" content="PHEME - Earn Trust Onchain" />
        <meta property="og:description" content="PHEME is a peer-to-peer AI validator network that verifies real contributions and builds onchain reputation." />
        <meta property="og:image" content="/Pheme_wave.svg" />
      </Head>

      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-gray-900 dark:text-white transition-colors">
        {/* Header with Navigation */}
        <header className={`container mx-auto px-4 py-6 flex justify-between items-center ${
          isMobile && isConnected ? 'hidden' : ''
        }`}>
          <div className="flex items-center gap-3">
            <PhemeLogo width={80} height={80} />
            <h1 className="text-4xl font-bold text-primary-light dark:text-primary-dark">PHEME</h1>
          </div>
          <Navigation />
        </header>

        {/* Error Banner for wallet connect - top center, not shown by default */}
        {connectClicked && walletConnectError && !isConnected && (
          <div className="w-full flex justify-center mt-2 z-50">
            <div className="bg-yellow-200 text-yellow-900 px-4 py-3 rounded shadow-lg w-full max-w-md text-center flex justify-between items-center">
              <span>{walletConnectError}</span>
              <button onClick={() => { setConnectClicked(false); setWalletConnectError(null); }} className="ml-4 text-lg font-bold">&times;</button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8 md:py-16">
            {/* Top section with main content and iPhone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left side: Main content */}
              <div className="max-w-2xl mx-auto lg:mx-0">
                {(!isMobile || !isConnected) && <MainContent />}
              </div>
              {/* Right side: iPhone interface */}
              <div>
                <IPhoneInterface />
              </div>
            </div>

            {/* Features section */}
            {(!isMobile || !isConnected) && (
              <div className="mt-32 lg:mt-48 -mx-4 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
                  {/* Skill Wallet */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6 group">
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
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6 group">
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
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6 group">
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
            )}
          </div>
        </main>

        {/* Footer */}
        <Footer className={isMobile && isConnected ? 'hidden' : ''} />

        {/* Support Chat */}
        <SupportChat className={isMobile && isConnected ? 'hidden' : ''} />

        {/* Waitlist Modal */}
        {showWaitlistModal && (
          <div className="fixed inset-0 bg-black/75 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full mx-4 sm:mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Join the Waitlist</h3>
              <form onSubmit={handleWaitlist} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border-2 rounded-lg p-2.5 sm:p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Wallet Address
                  </label>
                  {address ? (
                    <div className="w-full border-2 rounded-lg p-2.5 sm:p-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 break-all">
                      {address}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={openConnectModal}
                      className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg p-2.5 sm:p-3 font-medium transition-colors"
                    >
                      Connect Wallet
                    </button>
                  )}
                </div>

                {errorMessage && (
                  <div className="text-red-500 dark:text-red-400 text-sm">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={waitlistStatus === 'loading'}
                  className={`w-full bg-primary-light dark:bg-primary-dark text-white rounded-lg p-2.5 sm:p-3 font-semibold ${
                    waitlistStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark dark:hover:bg-primary-light'
                  } transition-colors`}
                >
                  {waitlistStatus === 'loading' ? 'Joining...' : 
                   waitlistStatus === 'success' ? 'Joined!' : 
                   'Join Waitlist'}
                </button>
              </form>
              <button
                onClick={() => setShowWaitlistModal(false)}
                className="mt-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 