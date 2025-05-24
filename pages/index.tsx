import { useAccount } from 'wagmi'
import { ConnectButton } from '../components/ConnectButton'
import { AuraChat } from '../components/AuraChat'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="mb-8 flex items-center justify-center">
        <div className="w-[280px] sm:w-[320px] transition-transform hover:scale-105 duration-300">
          <svg viewBox="0 0 1200 400" className="w-full h-auto">
            <g transform="translate(50, 50)">
              {/* Circle with waves */}
              <circle cx="150" cy="150" r="150" fill="#0084FF"/>
              <path
                d="M75 150 C 75 75, 225 75, 225 150 C 225 225, 75 225, 75 150"
                fill="none"
                stroke="white"
                strokeWidth="30"
                strokeLinecap="round"
              />
              <path
                d="M100 150 C 100 100, 200 100, 200 150 C 200 200, 100 200, 100 150"
                fill="none"
                stroke="white"
                strokeWidth="30"
                strokeLinecap="round"
              />
              
              {/* AURA text */}
              <text
                x="400"
                y="180"
                fontSize="160"
                fontFamily="Arial, sans-serif"
                fill="white"
                fontWeight="bold"
                letterSpacing="5"
              >
                AURA
              </text>
            </g>
          </svg>
        </div>
      </div>

      {!isConnected && (
        <div className="text-center">
          <p className="mb-4">Connect your wallet to start using AURA Chat</p>
          <ConnectButton />
        </div>
      )}

      {isConnected && <AuraChat />}
    </main>
  )
}