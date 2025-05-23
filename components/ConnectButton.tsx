import { useConnect, useDisconnect, useAccount } from 'wagmi'

export function ConnectButton() {
  const { connect, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()

  console.log('ConnectButton: isConnected:', isConnected)

  if (isConnected) {
    return (
      <div className="text-center">
        <p>Connected as: {address}</p>
        <button
          onClick={() => disconnect()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="text-center">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Connect with {connector.name}
        </button>
      ))}

      {error && <div className="text-red-400 mt-2">Error: {error.message}</div>}
    </div>
  )
}
