import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ConnectButton } from '../components/ConnectButton';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { PhemeChat } from '../components/PhemeChat';
import { Wallet, UserCheck, Users } from 'lucide-react';
import PhemeLogo from '../components/PhemeLogo';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { SupportChat } from '../components/SupportChat';
import Head from 'next/head';
import SplashScreen from "@/components/SplashScreen";
import { ErrorBanner } from '../components/ErrorBanner';
import { useRouter } from 'next/router';

export default function Home() {
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
  const [messages, setMessages] = useState<{ sender: string; text: string; id: string }[]>([]);
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);
  const hasDisconnected = useRef(false);
  const [walletConnectAttempted, setWalletConnectAttempted] = useState(false);
  const [walletConnectError, setWalletConnectError] = useState<string | null>(null);
  const [walletConnectInitiated, setWalletConnectInitiated] = useState(false);
  const [connectClicked, setConnectClicked] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Check if we're coming from the mint page
    if (router.isReady) {
      const fromMint = router.query.from === 'mint';
      setShowSplash(!fromMint);
    }
  }, [router.isReady, router.query.from]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasSeenSplash(true);
    localStorage.setItem('hasSeenSplash', 'true');
  };

  useEffect(() => {
    // Only disconnect once, on first mount, if connected
    if (
      typeof window !== 'undefined' &&
      isConnected &&
      !hasDisconnected.current
    ) {
      disconnect();
      hasDisconnected.current = true;
    }
  }, [isConnected, disconnect]);

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

  // Focus management for modal
  useEffect(() => {
    if (showWaitlistModal) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus the modal
      modalRef.current?.focus();
    } else {
      // Restore focus when modal is closed
      previousFocusRef.current?.focus();
    }
  }, [showWaitlistModal]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showWaitlistModal) {
        setShowWaitlistModal(false);
      }
    };

    if (showWaitlistModal) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showWaitlistModal]);

  // Trap focus within modal
  useEffect(() => {
    const handleTabKey = (event: KeyboardEvent) => {
      if (!showWaitlistModal) return;

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    if (showWaitlistModal) {
      document.addEventListener('keydown', handleTabKey);
    }
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [showWaitlistModal]);

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
    <div className="card bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-3xl p-10 transition-all duration-300">
      {/* Headline and Tagline */}
      <div className="my-24">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight text-gray-900 dark:text-white">Earn Trust Onchain</h2>
        <p className="text-xl lg:text-2xl font-medium text-gray-800 dark:text-white mb-4 lg:mb-6">
          The bridge between who you are and who you want to become.
        </p>
        <p className="text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-6 lg:mb-8">
          Pheme is a peer-to-peer AI validator network that verifies real contributions and builds onchain reputation.
        </p>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 lg:mb-12">
        <ConnectButton 
          onClick={() => setConnectClicked(true)}
          onConnectClick={() => setWalletConnectInitiated(true)}
          onError={(err: unknown) => {
            console.log('Wallet connect error:', err);
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
        <button 
          onClick={() => setShowWaitlistModal(true)}
          className="btn-primary bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl border-2 border-blue-700 hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Join Waitlist
        </button>
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
          <div className="bg-white dark:bg-gray-900 rounded-[40px] text-gray-900 dark:text-white p-3 shadow-[0_0_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_0_60px_-15px_rgba(255,255,255,0.1)] border-[12px] border-gray-200 dark:border-gray-950 relative overflow-hidden ring-2 ring-gray-200/30 dark:ring-white/20">
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
              <h3 className="font-bold text-center text-xl mb-6 text-gray-900 dark:text-white">Talk to PHEME</h3>
              <div className="space-y-4" role="log" aria-live="polite">
                <div className="animate-fade-in-1">
                  <div className="flex justify-start">
                    <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
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
                    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm border border-gray-200 dark:border-gray-700">
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

  if (showSplash && !hasSeenSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

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

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-white to-blue-50 dark:from-background-dark dark:to-background-dark text-gray-900 dark:text-white transition-colors relative overflow-hidden" lang="en">
        {/* Mesh Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200/5 dark:from-blue-500/5 via-transparent to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5/1px_1px_transparent_1px),linear-gradient(to_bottom,#4f46e5/1px_1px_transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-5 dark:opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-100/5 to-blue-100/5 dark:from-transparent dark:via-blue-900/5 dark:to-transparent"></div>
        </div>

        {/* Header with Navigation */}
        <header className={`container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center relative z-10 ${
          isMobile && isConnected ? 'hidden' : ''
        }`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <PhemeLogo width={isMobile ? 60 : 80} height={isMobile ? 60 : 80} />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">PHEME</h1>
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
        <main id="main-content" className="flex-grow relative z-10">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-16">
            {/* Top section with main content and iPhone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
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
              <div className="mt-20 sm:mt-32 lg:mt-40 -mx-4 px-4">
                {/* Headline above features */}
                <div className="my-12 sm:my-16 lg:my-20 text-center">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent max-w-3xl mx-auto px-4">
                    Proving your skills shouldn't be a black box. Build your onchain reputation transparently with AI-powered validation on Pheme.
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto">
                  {/* Feature cards with adjusted padding */}
                  <div className="group bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-500/30">
                    <div className="mb-4 sm:mb-6 flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                      <Wallet className="h-8 w-8 sm:h-10 sm:w-10 text-blue-700 dark:text-blue-300 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                    </div>
                    <p className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-wide">Onchain Identity</p>
                    <p className="text-sm sm:text-base text-gray-800 dark:text-gray-300 font-medium">
                      Your unique onchain identity that represents your contributions and achievements. Immutable and verifiable, it serves as your digital reputation in the Pheme ecosystem.
                    </p>
                  </div>

                  {/* Repeat similar adjustments for other feature cards */}
                  <div className="group bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-500/30">
                    <div className="mb-4 sm:mb-6 flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                      <UserCheck className="h-8 w-8 sm:h-10 sm:w-10 text-blue-700 dark:text-blue-300 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                    </div>
                    <p className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-wide">Reputation Oracle</p>
                    <p className="text-sm sm:text-base text-gray-800 dark:text-gray-300 font-medium">
                      AI-powered engine that scores your contributions, skill breadth, and consistency. Reputation scores are public, onchain, and amplify your influence in governance and access to opportunities.
                    </p>
                  </div>

                  <div className="group bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-500/30">
                    <div className="mb-4 sm:mb-6 flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                      <Users className="h-8 w-8 sm:h-10 sm:w-10 text-blue-700 dark:text-blue-300 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                    </div>
                    <p className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-wide">Community Governance</p>
                    <p className="text-sm sm:text-base text-gray-800 dark:text-gray-300 font-medium">
                      Decisions are made by token holders and reputation leaders through transparent, onchain voting. Propose, discuss, and vote to shape the protocol's future and manage the DAO treasury.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* End-of-page Testnet Coming section */}
        <section className="w-full min-h-[40vh] sm:min-h-[50vh] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-background-dark dark:to-background-dark relative mt-16 sm:mt-24">
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <PhemeLogo width={isMobile ? 60 : 80} height={isMobile ? 60 : 80} />
            <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent text-center drop-shadow-lg leading-tight px-4">Testnet is Coming</h2>
            <button className="mt-4 sm:mt-6 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-base sm:text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl">Follow us for latest updates</button>
          </div>
        </section>

        {/* Footer with adjusted spacing */}
        <footer className="w-full bg-white/90 dark:bg-background-dark/50 backdrop-blur-sm py-12 sm:py-16 px-4 relative z-10 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-gray-600">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Developers</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-600">Docs</span></li>
                <li><a href="https://github.com/Pheme-Protocol" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Community</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-600">Community Forum</span></li>
                <li><span className="text-gray-600">Feature Requests</span></li>
                <li><span className="text-gray-600">Contact Admin</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">About</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-600">Blog</span></li>
                <li><span className="text-gray-600">Jobs</span></li>
              </ul>
            </div>
          </div>
          <div className="flex justify-center items-center mt-8 sm:mt-10 space-x-4 sm:space-x-6">
            <span aria-label="Discord" className="text-2xl text-gray-600">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.2a.117.117 0 0 0-.125.06c-.543.96-1.146 2.217-1.573 3.2a18.524 18.524 0 0 0-5.372 0c-.427-.995-1.03-2.24-1.573-3.2a.117.117 0 0 0-.125-.06A19.736 19.736 0 0 0 3.684 4.369a.105.105 0 0 0-.047.043C.533 9.045-.32 13.579.099 18.057a.12.12 0 0 0 .045.083c2.052 1.507 4.042 2.422 5.992 3.029a.116.116 0 0 0 .127-.043c.462-.63.874-1.295 1.226-1.994a.112.112 0 0 0-.065-.158c-.652-.247-1.27-.549-1.872-.892a.117.117 0 0 1-.012-.194c.126-.094.252-.192.372-.291a.112.112 0 0 1 .114-.013c3.927 1.793 8.18 1.793 12.061 0a.112.112 0 0 1 .115.012c.12.099.246.197.372.291a.117.117 0 0 1-.011.194 12.298 12.298 0 0 1-1.873.892.112.112 0 0 0-.064.159c.36.698.772 1.362 1.225 1.993a.115.115 0 0 0 .127.044c1.95-.607 3.94-1.522 5.993-3.029a.115.115 0 0 0 .045-.083c.5-5.177-.838-9.673-3.573-13.645a.093.093 0 0 0-.047-.043ZM8.02 15.331c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.174 1.095 2.156 2.418 0 1.334-.955 2.419-2.156 2.419Zm7.974 0c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.174 1.095 2.156 2.418 0 1.334-.946 2.419-2.156 2.419Z"/></svg>
            </span>
            <a href="https://twitter.com/phemeai" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-blue-600 transition-colors text-2xl">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 6.47a.75.75 0 0 0-1.06 0L12 10.94 7.53 6.47a.75.75 0 0 0-1.06 1.06L10.94 12l-4.47 4.47a.75.75 0 1 0 1.06 1.06L12 13.06l4.47 4.47a.75.75 0 0 0 1.06-1.06L13.06 12l4.47-4.47a.75.75 0 0 0 0-1.06z"/></svg>
            </a>
            <a href="https://t.me/phemeai" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hover:text-blue-600 transition-colors text-2xl">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.95 1.24-5.5 3.65-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.49.8-.75 3.12-1.36 5.2-2.26 6.24-2.7 2.98-1.24 3.6-1.45 4.01-1.46.09 0 .28.02.4.12.11.08.14.19.15.27-.01.06-.01.12-.02.18z"/>
              </svg>
            </a>
          </div>
          <div className="mt-8 sm:mt-10 text-center text-xs text-gray-600">© 2025 PHEME. All rights reserved.</div>
        </footer>

        {/* Support Chat */}
        <SupportChat className={isMobile && isConnected ? 'hidden' : ''} />

        {/* Waitlist Modal */}
        {showWaitlistModal && (
          <div 
            className="fixed inset-0 bg-black/75 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-title"
            aria-describedby="waitlist-description"
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full mx-4 sm:mx-auto"
              ref={modalRef}
            >
              <h3 id="waitlist-title" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Join the Waitlist</h3>
              <p id="waitlist-description" className="sr-only">Join the PHEME Protocol waitlist to be notified when we launch</p>
              <form onSubmit={handleWaitlist} className="space-y-4" noValidate>
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
                    aria-required="true"
                    aria-invalid={!!errorMessage}
                    aria-describedby={errorMessage ? "email-error" : undefined}
                  />
                  {errorMessage && (
                    <div id="email-error" className="text-red-500 dark:text-red-400 text-sm mt-1" role="alert">
                      {errorMessage}
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="wallet-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Wallet Address
                  </label>
                  {address ? (
                    <div 
                      id="wallet-address"
                      className="w-full border-2 rounded-lg p-2.5 sm:p-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 break-all"
                      aria-label={`Connected wallet address: ${address}`}
                    >
                      {address}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={openConnectModal}
                      className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg p-2.5 sm:p-3 font-medium transition-colors"
                      aria-label="Connect your wallet to continue"
                    >
                      Connect Wallet
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={waitlistStatus === 'loading'}
                  className={`w-full bg-primary-light dark:bg-primary-dark text-white rounded-lg p-2.5 sm:p-3 font-semibold ${
                    waitlistStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark dark:hover:bg-primary-light'
                  } transition-colors`}
                  aria-label={waitlistStatus === 'loading' ? 'Submitting...' : 'Join Waitlist'}
                >
                  {waitlistStatus === 'loading' ? (
                    <>
                      <span aria-hidden="true">Joining...</span>
                      <span className="sr-only">Submitting your waitlist application</span>
                    </>
                  ) : waitlistStatus === 'success' ? (
                    <>
                      <span aria-hidden="true">Joined!</span>
                      <span className="sr-only">Successfully joined the waitlist</span>
                    </>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>
              </form>
              <button
                onClick={() => setShowWaitlistModal(false)}
                className="mt-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium text-sm sm:text-base"
                aria-label="Close waitlist modal"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black"
        >
          Skip to main content
        </a>

        {/* ARIA live regions for dynamic content */}
        <div aria-live="polite" className="sr-only">
          {waitlistStatus === 'loading' && 'Submitting waitlist request...'}
          {waitlistStatus === 'success' && 'Successfully joined the waitlist!'}
          {waitlistStatus === 'error' && `Error: ${errorMessage}`}
        </div>

        <div aria-live="polite" className="sr-only">
          {isConnected && 'Wallet connected successfully'}
          {walletConnectError && `Wallet connection error: ${walletConnectError}`}
        </div>
      </div>
    </>
  );
} 