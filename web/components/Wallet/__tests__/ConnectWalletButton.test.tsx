import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectWalletButton } from '../ConnectWalletButton';
import { WalletProvider } from '../../../contexts/WalletContext';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({
    isConnected: false,
    address: undefined,
  })),
  useConnect: jest.fn(() => ({
    connectAsync: jest.fn(),
  })),
  useDisconnect: jest.fn(() => ({
    disconnect: jest.fn(),
  })),
}));

// Mock the injected connector
jest.mock('wagmi/connectors', () => ({
  injected: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

describe('ConnectWalletButton', () => {
  const mockConnect = jest.fn();
  const mockDisconnect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useConnect as jest.Mock).mockReturnValue({ connectAsync: mockConnect });
    (useDisconnect as jest.Mock).mockReturnValue({ disconnect: mockDisconnect });
  });

  it('renders connect button when not connected', () => {
    (useAccount as jest.Mock).mockReturnValue({ isConnected: false, address: undefined });
    
    render(
      <WalletProvider>
        <ConnectWalletButton />
      </WalletProvider>
    );

    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('renders disconnect button with formatted address when connected', () => {
    (useAccount as jest.Mock).mockReturnValue({ 
      isConnected: true, 
      address: '0x1234567890abcdef1234567890abcdef12345678' 
    });
    
    render(
      <WalletProvider>
        <ConnectWalletButton />
      </WalletProvider>
    );

    expect(screen.getByText('Disconnect (0x12...5678)')).toBeInTheDocument();
  });

  it('shows error message when connection fails', async () => {
    (useAccount as jest.Mock).mockReturnValue({ isConnected: false, address: undefined });
    mockConnect.mockRejectedValueOnce(new Error('Connection failed'));
    
    render(
      <WalletProvider>
        <ConnectWalletButton />
      </WalletProvider>
    );

    fireEvent.click(screen.getByText('Connect Wallet'));
    
    expect(await screen.findByText('🚨 Wallet connection required to continue.')).toBeInTheDocument();
  });

  it('calls disconnect when clicking disconnect button', () => {
    (useAccount as jest.Mock).mockReturnValue({ 
      isConnected: true, 
      address: '0x1234567890abcdef1234567890abcdef12345678' 
    });
    
    render(
      <WalletProvider>
        <ConnectWalletButton />
      </WalletProvider>
    );

    fireEvent.click(screen.getByText('Disconnect (0x12...5678)'));
    expect(mockDisconnect).toHaveBeenCalled();
  });
}); 