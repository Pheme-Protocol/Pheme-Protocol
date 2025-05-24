import { useAccount } from 'wagmi'
import { ConnectButton } from '../components/ConnectButton'
import { AuraChat } from '../components/AuraChat'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="mb-8 flex items-center justify-center">
        <div className="w-[280px] sm:w-[320px] transition-transform hover:scale-105">
          <svg viewBox="0 0 1024 1024" className="w-full h-auto">
            <circle cx="512" cy="512" r="400" fill="#0066FF"/>
            <path
              d="M412 412 C 462 362, 562 362, 612 412 C 662 462, 662 562, 612 612 C 562 662, 462 662, 412 612 C 362 562, 362 462, 412 412"
              fill="white"
              strokeWidth="20"
            />
            <text
              x="700"
              y="512"
              fontSize="240"
              fontFamily="Arial, sans-serif"
              fill="white"
              fontWeight="bold"
              textAnchor="start"
              alignmentBaseline="middle"
            >
              AURA
            </text>
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