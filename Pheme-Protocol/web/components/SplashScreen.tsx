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
  "Initializing neural network...",
  "Analyzing contribution patterns...",
  "Validating skill assertions...",
  "Calculating trust metrics...",
  "Building reputation graph..."
];

const aiProcessingSteps = [
  "Data Collection",
  "Pattern Recognition",
  "Trust Validation",
  "Reputation Scoring",
  "Skill Verification"
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
  const [processingStep, setProcessingStep] = useState(0);
  const [neuralNodes, setNeuralNodes] = useState<{ x: number; y: number; active: boolean; layer: number }[]>([]);

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
    const particleCount = isMobile ? 8 : 12;
    const newParticles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4
    }));
    setParticles(newParticles);
    
    // Connect particles only if they're within range
    const newLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const MAX_DISTANCE = 35;
    
    for (let i = 0; i < newParticles.length; i++) {
      for (let j = i + 1; j < newParticles.length; j++) {
        const dx = newParticles[i].x - newParticles[j].x;
        const dy = newParticles[i].y - newParticles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < MAX_DISTANCE && Math.random() > 0.92) {
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

  // Generate neural network nodes
  useEffect(() => {
    const layers = 3;
    const nodesPerLayer = isMobile ? 4 : 6;
    const nodes: { x: number; y: number; active: boolean; layer: number }[] = [];
    
    for (let layer = 0; layer < layers; layer++) {
      for (let i = 0; i < nodesPerLayer; i++) {
        nodes.push({
          x: (layer + 1) * (100 / (layers + 1)),
          y: (i + 1) * (100 / (nodesPerLayer + 1)),
          active: false,
          layer
        });
      }
    }
    setNeuralNodes(nodes);
  }, [isMobile]);

  useEffect(() => {
    // Sequence timing
    const sequenceTiming = {
      identityMesh: 1800,
      aiReputation: 800,
      skillWallet: 800,
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
    color: '#ffffff',
    textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)',
    letterSpacing: '0.04em',
  };

  const renderSequence = () => {
    switch (currentSequence) {
      case 0: // Neural Network Visualization
        return (
          <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="w-full h-full relative">
              {/* Neural Network Connections */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                {neuralNodes.map((node, i) => {
                  return neuralNodes.slice(i + 1).map((targetNode, j) => {
                    if (targetNode.layer > node.layer) {
                      return (
                        <motion.line
                          key={`${i}-${j}`}
                          x1={`${node.x}%`}
                          y1={`${node.y}%`}
                          x2={`${targetNode.x}%`}
                          y2={`${targetNode.y}%`}
                          stroke="#00ffe7"
                          strokeWidth={0.8}
                          initial={{ opacity: 0.05 }}
                          animate={{ 
                            opacity: node.active && targetNode.active ? [0.05, 0.3, 0.05] : [0.05, 0.1, 0.05]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      );
                    }
                    return null;
                  });
                })}
              </svg>
              
              {/* Neural Nodes */}
              {neuralNodes.map((node, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    width: 8,
                    height: 8,
                    background: node.active 
                      ? 'radial-gradient(circle, rgba(0, 255, 231, 0.4) 0%, rgba(0, 255, 231, 0.1) 100%)'
                      : 'radial-gradient(circle, rgba(0, 255, 231, 0.2) 0%, rgba(0, 255, 231, 0.05) 100%)',
                    boxShadow: node.active
                      ? '0 0 12px 3px rgba(0, 255, 231, 0.2)'
                      : '0 0 8px 2px rgba(0, 255, 231, 0.1)',
                    zIndex: 2,
                  }}
                  animate={{
                    scale: node.active ? [1, 1.2, 1] : 1,
                    opacity: node.active ? [0.4, 0.6, 0.4] : [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}

              <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 4 }}>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ 
                    opacity: [0.9, 1, 0.9],
                    y: 0 
                  }}
                  transition={{
                    opacity: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    y: {
                      duration: 1,
                      ease: "easeOut"
                    }
                  }}
                  style={taglineStyle}
                >
                  Reputation is earned, not assumed.
                </motion.p>
              </div>
            </div>
          </motion.div>
        );
      case 1: // AI Processing Steps
        return (
          <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="w-full max-w-md p-8 relative">
              <div className="space-y-4">
                {aiProcessingSteps.map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: processingStep >= index ? 1 : 0.3,
                      x: processingStep >= index ? 0 : -20
                    }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`w-2 h-2 rounded-full ${processingStep >= index ? 'bg-[#00ffe7]' : 'bg-gray-600'}`} />
                    <span className="text-white font-mono">{step}</span>
                    {processingStep === index && (
                      <motion.div
                        className="w-4 h-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-full h-full border-2 border-[#00ffe7] border-t-transparent rounded-full" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 2: // Skill Verification
        return (
          <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="w-full max-w-md p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800/50 rounded-xl p-6 shadow-xl"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {skillTags.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, y: 30, scale: 0.7 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: [0.7, 1.1, 1],
                        backgroundColor: index % 2 === 0 ? 'rgba(0, 255, 231, 0.1)' : 'rgba(58, 28, 113, 0.1)'
                      }}
                      transition={{ delay: index * 0.12, type: 'tween', duration: 0.7 }}
                      className="px-3 py-1 rounded-full text-[#00ffe7] text-sm shadow-md"
                      style={{
                        fontFamily: 'Orbitron, Fira Mono, monospace',
                        fontWeight: 600,
                        textShadow: '0 0 8px #00ffe7',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
                <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full"
                    style={{ background: 'linear-gradient(90deg, #00ffe7 0%, #3a1c71 100%)' }}
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
      case 3: // Final Taglines
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