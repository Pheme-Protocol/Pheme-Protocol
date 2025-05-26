'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function LaunchAURA() {
  const router = useRouter()
  const [launching, setLaunching] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('')

  // Simulated loading messages
  const loadingMessages = [
    'Initializing neural networks...',
    'Calibrating AI systems...',
    'Loading AURA protocols...',
    'Establishing secure connections...',
    'Preparing interface...'
  ]

  useEffect(() => {
    if (launching) {
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 2
        })
      }, 50)

      // Loading text animation
      let messageIndex = 0
      const messageInterval = setInterval(() => {
        setLoadingText(loadingMessages[messageIndex])
        messageIndex = (messageIndex + 1) % loadingMessages.length
      }, 800)

      // Cleanup and navigation
      const navigationTimer = setTimeout(() => {
        clearInterval(progressInterval)
        clearInterval(messageInterval)
        router.push('/home')
      }, 4000)

      return () => {
        clearInterval(progressInterval)
        clearInterval(messageInterval)
        clearTimeout(navigationTimer)
      }
    }
  }, [launching, router])

  const handleLaunch = () => {
    setLaunching(true)
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient-xy"></div>
      </div>

      {/* AURA Logo */}
      <div className="mb-8 relative">
        <Image
          src="/Aura_wave.svg"
          alt="AURA Logo"
          width={120}
          height={120}
          className={`transition-all duration-1000 ${launching ? 'scale-90 opacity-80' : 'scale-100 opacity-100'}`}
        />
      </div>

      {!launching ? (
        // Launch Button
        <button
          onClick={handleLaunch}
          className="relative group px-8 py-4 overflow-hidden rounded-lg bg-transparent border-2 border-white/30 hover:border-white/60 transition-all duration-300"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <span className="relative text-2xl font-bold tracking-wider">
            Launch AURA
          </span>
        </button>
      ) : (
        // Loading Animation
        <div className="flex flex-col items-center space-y-6">
          <div className="text-lg font-light tracking-wider animate-pulse">
            {loadingText}
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Neural Network Animation */}
          <div className="mt-8 grid grid-cols-5 gap-2 opacity-50">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 100}ms`,
                  opacity: Math.random() * 0.5 + 0.25
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 