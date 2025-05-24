import { useAccount } from 'wagmi'
import { ConnectButton } from '../components/ConnectButton'
import { AuraChat } from '../components/AuraChat'
import Image from 'next/image'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="mb-8 flex items-center justify-center">
        <Image 
          src="/logo.png" 
          alt="AURA Logo" 
          width={280} 
          height={100} 
          priority 
          className="w-[280px] h-auto sm:w-[320px] transition-transform hover:scale-105" 
          quality={100}
          style={{
            objectFit: 'contain'
          }}
        />
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