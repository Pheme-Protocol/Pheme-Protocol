import { useAccount } from 'wagmi'
import { ConnectButton } from '../components/ConnectButton'
import { AuraChat } from '../components/AuraChat'
import AuraLogo from '../components/AuraLogo'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-full max-w-[320px] mb-8">
        <div className="transition-transform hover:scale-105 duration-300">
          <AuraLogo width={320} height={80} />
        </div>
      </div>

      {!isConnected && (
        <div className="text-center">
          <p className="mb-4">Connect your wallet to start using AURA</p>
          <ConnectButton />
        </div>
      )}

      {isConnected && <AuraChat />}
    </main>
  )
}