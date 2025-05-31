import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConnectButton } from '../ConnectButton'

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useDisconnect: () => ({
    disconnect: jest.fn(),
  }),
}))

// Mock RainbowKit components
const mockOpenConnectModal = jest.fn()
interface MockAccount {
  address: string
  displayName: string
}
let mockAccount: MockAccount | null = null

jest.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: ({ children }: { children: (props: any) => React.ReactNode }) => children({
      account: mockAccount,
      openConnectModal: mockOpenConnectModal,
      mounted: true,
      chain: { id: 1, name: 'Ethereum' },
    }),
  },
}))

describe('ConnectButton', () => {
  beforeEach(() => {
    mockOpenConnectModal.mockClear()
    mockAccount = null
  })

  it('renders connect button when not connected', () => {
    render(<ConnectButton />)
    const button = screen.getByRole('button', { name: /connect wallet/i })
    expect(button).toBeInTheDocument()
  })

  it('renders disconnect button when connected', () => {
    mockAccount = {
      address: '0x123',
      displayName: '0x123...456',
    }
    
    render(<ConnectButton />)
    const button = screen.getByRole('button', { name: /disconnect/i })
    expect(button).toBeInTheDocument()
    expect(screen.getByText(/0x123...456/)).toBeInTheDocument()
  })

  it('calls openConnectModal when connect button is clicked', () => {
    render(<ConnectButton />)
    const button = screen.getByRole('button', { name: /connect wallet/i })
    fireEvent.click(button)
    expect(mockOpenConnectModal).toHaveBeenCalled()
  })
}) 