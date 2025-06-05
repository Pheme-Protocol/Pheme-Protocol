//PHEME Splash Screen – Optimized Version
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete?: () => void;
}

const taglines = [
  "Proof, not promises.",
  "Your skills. On-chain.",
  "PHEME is loading..."
];

const skillTags = [
  "Solidity",
  "Design",
  "DevOps",
  "Security",
  "AI/ML",
  "Frontend",
  "Backend",
  "Blockchain"
];

const formulas = [
  "XP = Σ(task_score × weight) / time_decay",
  "Reputation = normalize(XP + endorsements - flags)",
  "Validator Score = f(accuracy, consistency, dispute_rate)",
  "Trust Score = Σ(verified_contributions × weight) / time",
  "Skill Level = log(experience_points) × consistency_factor"
];

const verificationMessages = [
  "Verifying submission...",
  "AI review in progress...",
  "Analyzing contribution patterns...",
  "Calculating trust metrics...",
  "Scoring complete..."
];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentSequence, setCurrentSequence] = useState(0);
  const [currentTagline, setCurrentTagline] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; size: number }[]>([]);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [reputationScore, setReputationScore] = useState(0);
  const [formulaStream, setFormulaStream] = useState<string[]>([]);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [validatorNodes, setValidatorNodes] = useState<{ x: number; y: number; active: boolean }[]>([]);
  const meshRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted before any client-side operations
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate particles and connecting lines for mesh
  useEffect(() => {
    const particleCount = isMobile ? 16 : 32;
    const newParticles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3
    }));
    setParticles(newParticles);
    // Connect each particle to 2-3 others
    const newLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < newParticles.length; i++) {
      for (let j = i + 1; j < newParticles.length; j++) {
        if (Math.random() > 0.85) {
          newLines.push({
            x1: newParticles[i].x,
            y1: newParticles[i].y,
            x2: newParticles[j].x,
            y2: newParticles[j].y
          });
        }
      }
    }
    setLines(newLines);
    // Validator nodes
    const nodes = Array.from({ length: 8 }, (_, i) => ({
      x: Math.cos(i * Math.PI / 4) * 150,
      y: Math.sin(i * Math.PI / 4) * 150,
      active: false
    }));
    setValidatorNodes(nodes);
  }, [isMobile]);

  useEffect(() => {
    // Sequence timing
    const sequenceTiming = {
      identityMesh: 1800,
      aiReputation: 800,
      taglines: 800
    };
    // Start sequences
    const sequenceInterval = setInterval(() => {
      setCurrentSequence(prev => {
        if (prev >= 3) {
          clearInterval(sequenceInterval);
          setShowLogo(true);
          setIsReady(true);
          return prev;
        }
        return prev + 1;
      });
    }, sequenceTiming.identityMesh);

    // Show each tagline only once, then finish splash
    const taglineTimeouts: NodeJS.Timeout[] = [];
    if (currentSequence === 3) {
      setCurrentTagline(0);
      for (let i = 1; i < taglines.length; i++) {
        taglineTimeouts.push(setTimeout(() => {
          setCurrentTagline(i);
        }, i * sequenceTiming.taglines));
      }
      taglineTimeouts.push(setTimeout(() => {
        setShowLogo(true);
        setIsReady(true);
      }, taglines.length * sequenceTiming.taglines));
    }

    // Animate reputation score
    const reputationInterval = setInterval(() => {
      setReputationScore(prev => {
        if (prev >= 100) {
          clearInterval(reputationInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 13);
    // Formula stream animation
    const formulaInterval = setInterval(() => {
      setFormulaStream(prev => {
        const newStream = [...prev, formulas[Math.floor(Math.random() * formulas.length)]];
        if (newStream.length > 5) newStream.shift();
        return newStream;
      });
    }, 800);
    // Verification progress
    const verificationInterval = setInterval(() => {
      setVerificationProgress(prev => {
        if (prev >= 100) {
          clearInterval(verificationInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 13);
    // Animate validator nodes
    const nodeInterval = setInterval(() => {
      setValidatorNodes(prev => 
        prev.map(node => ({
          ...node,
          active: Math.random() > 0.7
        }))
      );
    }, 300);
    return () => {
      clearInterval(sequenceInterval);
      taglineTimeouts.forEach(clearTimeout);
      clearInterval(reputationInterval);
      clearInterval(formulaInterval);
      clearInterval(verificationInterval);
      clearInterval(nodeInterval);
    };
  }, [currentSequence]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleTap = () => {
    setIsSkipped(true);
  };

  const handleLaunch = () => {
    if (onComplete) onComplete();
  };

  // Neon/Chalk style for formulas (responsive)
  const formulaStyle = {
    fontFamily: 'Fira Mono, Menlo, monospace',
    fontSize: isMobile ? '1.1rem' : '1.2rem',
    color: '#00ffe7',
    textShadow: '0 0 8pxrgb(0, 51, 255), 0 0 16pxrgb(0, 51, 255)',
    letterSpacing: '0.02em',
    opacity: 0.85,
    whiteSpace: 'nowrap' as const,
  };
  // Futuristic font for taglines (responsive)
  const taglineStyle = {
    fontFamily: 'Orbitron, Fira Mono, monospace',
    fontWeight: 700,
    fontSize: isMobile ? '1.2rem' : '2rem',
    color: '#fff',
    textShadow: '0 0 12pxrgb(0, 51, 255), 0 0 24px #3a1c71',
    letterSpacing: '0.04em',
  };

  const renderSequence = () => {
    switch (currentSequence) {
      case 0: // Animated Mesh
        return (
          <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div ref={meshRef} className="relative w-full h-full">
              {/* SVG mesh lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                {lines.map((line, i) => (
                  <motion.line
                    key={i}
                    x1={`${line.x1}%`} y1={`${line.y1}%`} x2={`${line.x2}%`} y2={`${line.y2}%`}
                    stroke="#00ffe7"
                    strokeWidth={1.2}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </svg>
              {/* Glowing mesh particles */}
              {particles.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full shadow-lg"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: particle.size,
                    height: particle.size,
                    background: 'radial-gradient(circle, rgb(0, 13, 255) 0%, #3a1c71 100%)',
                    boxShadow: '0 0 16px 4pxrgb(0, 89, 255)',
                    zIndex: 2,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
              {/* Spinning floating formulas */}
              {Array.from({ length: isMobile ? 5 : 10 }).map((_, i) => {
                const formula = formulas[i % formulas.length];
                // Random position and animation params
                const left = Math.random() * 80 + 5;
                const top = Math.random() * 70 + 10;
                const rotateDir = Math.random() > 0.5 ? 1 : -1;
                const floatY = Math.random() * 30 - 15;
                return (
                  <motion.div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${left}%`,
                      top: `${top}%`,
                      ...formulaStyle,
                      zIndex: 5,
                      pointerEvents: 'none',
                    }}
                    initial={{ opacity: 0, rotate: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      rotate: [0, rotateDir * 360],
                      y: [0, floatY, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  >
                    {formula}
                  </motion.div>
                );
              })}
              {/* Animated formula stream */}
              <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 3 }}>
                {formulaStream.map((formula, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: '100vw', opacity: 0 }}
                    animate={{ x: '-60vw', opacity: [0, 1, 0] }}
                    transition={{ duration: 4, ease: 'linear', delay: i * 0.5 }}
                    style={{ ...formulaStyle, position: 'absolute', top: `${20 + i * 15}%` }}
                  >
                    {formula}
                  </motion.div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 4 }}>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={taglineStyle}>
                  Reputation is earned, not assumed.
                </motion.p>
              </div>
            </div>
          </motion.div>
        );
      case 1: // AI + Reputation with Validator Nodes
        return (
          <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="w-full max-w-md p-8 relative">
              {/* Removed SVG validator node orbits (large decorative circles) */}
              {validatorNodes.map((node, i) => (
                <motion.div
                  key={i}
                  className="absolute w-6 h-6 rounded-full"
                  style={{
                    left: `calc(50% + ${node.x}px - 12px)`,
                    top: `calc(50% + ${node.y}px - 12px)`,
                    background: node.active
                      ? 'radial-gradient(circle, rgb(0, 13, 255) 0%, #3a1c71 100%)'
                      : 'radial-gradient(circle, #3a1c71 60%, #222 100%)',
                    boxShadow: node.active
                      ? '0 0 24px 8pxrgb(0, 98, 255), 0 0 8px 2px #fff'
                      : '0 0 8px 2px #3a1c71',
                    zIndex: 2,
                  }}
                  animate={{
                    scale: node.active ? [1, 1.3, 1] : 1,
                    opacity: node.active ? [0.7, 1, 0.7] : 0.5,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
              {/* Removed concentric SVG circles */}
              <div className="w-32 h-32 mx-auto mb-8 relative z-10"></div>
              <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden relative z-10">
                <motion.div
                  className="h-full"
                  style={{ background: 'linear-gradient(90deg,rgb(0, 13, 255) 0%, #3a1c71 100%)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${reputationScore}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={taglineStyle}
                className="mt-4 relative z-10"
              >
                AI-validated. Community-trusted.
              </motion.p>
            </div>
          </motion.div>
        );
      case 2: // Skill Wallet with Matrix Effect
        return (
          <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="w-full max-w-md p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800 rounded-xl p-6 shadow-xl"
              >
                {/* Matrix-style skill tags with fly-in bounce */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {skillTags.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, y: 30, scale: 0.7 }}
                      animate={{ opacity: 1, y: 0, scale: [0.7, 1.1, 1] }}
                      transition={{ delay: index * 0.12, type: 'tween', duration: 0.7 }}
                      className="px-3 py-1 bg-primary-light/20 dark:bg-primary-dark/20 rounded-full text-primary-light dark:text-primary-dark text-sm shadow-md"
                      style={{
                        fontFamily: 'Orbitron, Fira Mono, monospace',
                        fontWeight: 600,
                        color: '#00ffe7',
                        textShadow: '0 0 8px #00ffe7',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
                {/* Verification progress */}
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full"
                    style={{ background: 'linear-gradient(90deg,rgb(0, 13, 255) 0%, #3a1c71 100%)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${verificationProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={taglineStyle}
                >
                  {verificationMessages[Math.floor(verificationProgress / 20)]}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        );
      case 3: // Taglines
        return (
          <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.p
              key={currentTagline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={taglineStyle}
            >
              {taglines[currentTagline]}
            </motion.p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Don't render anything until component is mounted
  if (!isMounted) {
    return null;
  }

  if (!isVisible || isSkipped) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black min-h-screen px-4">
        <div className="text-center w-full max-w-xs mx-auto flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <Image
              src="/Pheme_wave.svg"
              alt="PHEME Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLaunch}
            className="px-8 py-3 rounded-lg text-lg font-semibold bg-primary-light dark:bg-primary-dark text-white hover:bg-primary-dark dark:hover:bg-primary-light cursor-pointer w-full max-w-xs"
          >
            Launch PHEME
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden min-h-screen px-4"
      style={{
        background: '#000000',
      }}
      onClick={handleTap}
    >
      <div className="w-full h-full relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!showLogo ? (
            renderSequence()
          ) : (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center w-full max-w-xs mx-auto flex flex-col items-center justify-center">
                <Image
                  src="/Pheme_wave.svg"
                  alt="PHEME Logo"
                  fill
                  priority
                  className="object-contain"
                />
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLaunch}
                  disabled={!isReady}
                  className={`px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 w-full max-w-xs mt-8 mb-4 ${
                    isReady 
                      ? 'bg-primary-light dark:bg-primary-dark text-white hover:bg-primary-dark dark:hover:bg-primary-light cursor-pointer'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Launch PHEME
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}