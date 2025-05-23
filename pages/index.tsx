import { useAccount } from 'wagmi'
import { ConnectButton } from '../components/ConnectButton'
import { AuraChat } from '../components/AuraChat'

export default function Home() {
  const { isConnected } = useAccount()

  console.log('AURA HOME: isConnected =', isConnected)

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Aura Web</h1>

      {!isConnected && (
        <>
          <p className="mb-4">Connect your wallet to start using AURA Chat</p>
          <ConnectButton />
        </>
      )}

      {isConnected && <AuraChat />}
    </main>
  )
}