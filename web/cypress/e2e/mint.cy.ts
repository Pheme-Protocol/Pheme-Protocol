// Add type definitions at the top of the file
type StubFunction = (...args: any[]) => any;

interface Web3ModalInstance {
  connect: StubFunction;
  disconnect: StubFunction;
  getProvider: StubFunction;
}

interface Web3Modal {
  init: StubFunction;
}

interface EthereumProvider {
  request: StubFunction;
  on: StubFunction;
  removeListener: StubFunction;
  isMetaMask: boolean;
  selectedAddress: string;
  networkVersion: string;
  chainId: string;
  provider: {
    request: StubFunction;
    on: StubFunction;
    removeListener: StubFunction;
  };
  enable: StubFunction;
  send: StubFunction;
  sendAsync: StubFunction;
  addListener: StubFunction;
  removeAllListeners: StubFunction;
  getNetwork: StubFunction;
  getProvider: StubFunction;
}

// Extend the Window interface
declare global {
  interface Window {
    Web3Modal: Web3Modal;
  }
}

// Make this a module
export {};

describe('Mint Skill Wallet', () => {
  // Setup Web3 stubs before each test
  const setupWeb3Stubs = () => {
    // Create a more complete ethereum mock with proper method stubs
    const provider = {
      request: cy.stub().as('providerRequest'),
      on: cy.stub().as('providerOn'),
      removeListener: cy.stub().as('providerRemoveListener'),
    }

    const ethereum = {
      request: cy.stub().as('ethereumRequest'),
      on: cy.stub().as('ethereumOn'),
      removeListener: cy.stub().as('ethereumRemoveListener'),
      isMetaMask: true,
      selectedAddress: '0x123...',
      networkVersion: '1',
      chainId: '0x14a33', // Base Sepolia chainId
      provider,
      enable: cy.stub().as('enable').resolves(['0x123...']),
      send: cy.stub().as('send'),
      sendAsync: cy.stub().as('sendAsync'),
      addListener: cy.stub().as('addListener'),
      removeAllListeners: cy.stub().as('removeAllListeners'),
      getNetwork: cy.stub().as('getNetwork').resolves({ chainId: '0x14a33' }),
      getProvider: cy.stub().as('getProvider').returns(provider),
    }

    // Set up request method stubs
    ethereum.request.withArgs({ method: 'eth_chainId' }).resolves('0x14a33')
    ethereum.request.withArgs({ method: 'eth_requestAccounts' }).resolves(['0x123...'])
    ethereum.request.withArgs({ method: 'eth_accounts' }).resolves(['0x123...'])
    ethereum.request.withArgs({ method: 'eth_getBalance' }).resolves('0x56BC75E2D63100000') // 100 ETH
    ethereum.request.withArgs({ method: 'eth_blockNumber' }).resolves('0x1234')
    ethereum.request.withArgs({ method: 'eth_gasPrice' }).resolves('0x4A817C800') // 20 Gwei

    // Mock contract interaction responses
    ethereum.request.withArgs({ 
      method: 'eth_sendTransaction',
      params: [{
        to: Cypress.env('SKILL_WALLET_CONTRACT_ADDRESS'),
        data: Cypress.env('MINT_FUNCTION_SIGNATURE'),
      }]
    }).resolves('0x123...') // Transaction hash

    // Mock transaction receipt
    ethereum.request.withArgs({ 
      method: 'eth_getTransactionReceipt',
      params: ['0x123...']
    }).resolves({
      transactionHash: '0x123...',
      blockNumber: '0x1234',
      status: '0x1', // Success
      contractAddress: Cypress.env('SKILL_WALLET_CONTRACT_ADDRESS'),
      gasUsed: '0x123456',
      logs: []
    })

    // Set up the window object before visiting the page
    cy.window().then((win) => {
      // Set test flag to disable modal
      win.localStorage.setItem('__TEST__', 'true');
      
      // Mock the connected state
      win.ethereum = ethereum;
      
      // Mock the Web3Modal state
      win.localStorage.setItem('wagmi.wallet', 'metaMask');
      win.localStorage.setItem('wagmi.connected', 'true');
      win.localStorage.setItem('wagmi.account', '0x123...');
      win.localStorage.setItem('wagmi.chainId', '0x14a33');
    });
  }

  beforeEach(() => {
    // Intercept Web3Modal API calls
    cy.intercept('GET', 'https://api.web3modal.org/*', {
      statusCode: 200,
      body: {}
    }).as('web3ModalApi');
    
    cy.intercept('POST', 'https://pulse.walletconnect.org/*', {
      statusCode: 202,
      body: {}
    }).as('walletConnectPulse');

    // Intercept any attempts to load MetaMask
    cy.intercept('GET', '**/metamask/**', {
      statusCode: 404,
      body: {}
    }).as('metamaskLoad');

    // Setup Web3 stubs before visiting the page
    setupWeb3Stubs()

    // Visit the page
    cy.visit('/mint-skill-wallet')
    
    // Wait for the page to load
    cy.get('body').should('be.visible')

    // Handle uncaught exceptions from RainbowKit
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('Transaction hooks must be used within RainbowKitProvider')) {
        return false; // Prevent Cypress from failing the test
      }
      return true; // Let other errors fail the test
    });
  })

  it('should show network warning when not on Base Sepolia', () => {
    // Mock being on wrong network
    cy.window().then((win) => {
      if (win.ethereum) {
        win.ethereum.chainId = '0x1' // Mainnet
        win.ethereum.request.withArgs({ method: 'eth_chainId' }).resolves('0x1')
        win.ethereum.getNetwork.resolves({ chainId: '0x1' })
        win.localStorage.setItem('wagmi.chainId', '0x1');
      }
    })

    // Wait for and check network warning
    cy.contains('Please switch to Base Sepolia network to continue', { timeout: 30000 })
      .should('be.visible')
  })

  it('should enable mint button after connecting wallet', () => {
    // Mock being on Base Sepolia
    cy.window().then((win) => {
      if (win.ethereum) {
        win.ethereum.chainId = '0x14a33'
        win.ethereum.request.withArgs({ method: 'eth_chainId' }).resolves('0x14a33')
        win.ethereum.getNetwork.resolves({ chainId: '0x14a33' })
        win.localStorage.setItem('wagmi.chainId', '0x14a33');
      }
    })

    // Wait for the page to load and check if mint button is enabled
    cy.contains('Mint Skill Wallet', { timeout: 30000 })
      .should('be.visible')
      .and('not.be.disabled')
  })

  it('should show success modal after successful mint', () => {
    // Mock being on Base Sepolia
    cy.window().then((win) => {
      if (win.ethereum) {
        win.ethereum.chainId = '0x14a33'
        win.ethereum.request.withArgs({ method: 'eth_chainId' }).resolves('0x14a33')
        win.ethereum.getNetwork.resolves({ chainId: '0x14a33' })
        win.localStorage.setItem('wagmi.chainId', '0x14a33');
      }
    })

    // Mock successful mint transaction
    cy.window().then((win) => {
      if (win.ethereum) {
        win.ethereum.request.withArgs({ 
          method: 'eth_sendTransaction',
          params: [{
            to: Cypress.env('SKILL_WALLET_CONTRACT_ADDRESS'),
            data: Cypress.env('MINT_FUNCTION_SIGNATURE'),
          }]
        }).resolves('0x123...') // Transaction hash

        win.ethereum.request.withArgs({ 
          method: 'eth_getTransactionReceipt',
          params: ['0x123...']
        }).resolves({
          transactionHash: '0x123...',
          blockNumber: '0x1234',
          status: '0x1', // Success
          contractAddress: Cypress.env('SKILL_WALLET_CONTRACT_ADDRESS'),
          gasUsed: '0x123456',
          logs: []
        })
      }
    })

    // Click mint button and wait for success
    cy.contains('Mint Skill Wallet', { timeout: 30000 }).click()

    // Check for success modal
    cy.contains('✨ Skill Wallet Minted!', { timeout: 30000 })
      .should('be.visible')
  })

  it('should show error when trying to mint again', () => {
    // Mock being on Base Sepolia
    cy.window().then((win) => {
      if (win.ethereum) {
        win.ethereum.chainId = '0x14a33'
        win.ethereum.request.withArgs({ method: 'eth_chainId' }).resolves('0x14a33')
        win.ethereum.getNetwork.resolves({ chainId: '0x14a33' })
        win.localStorage.setItem('wagmi.chainId', '0x14a33');
      }
    })

    // Mock already minted error
    cy.window().then((win) => {
      if (win.ethereum) {
        win.ethereum.request.withArgs({ 
          method: 'eth_sendTransaction',
          params: [{
            to: Cypress.env('SKILL_WALLET_CONTRACT_ADDRESS'),
            data: Cypress.env('MINT_FUNCTION_SIGNATURE'),
          }]
        }).rejects(new Error('Already minted'))
      }
    })

    // Click mint button and wait for error
    cy.contains('Mint Skill Wallet', { timeout: 30000 }).click()

    // Check for error message
    cy.contains('You already own a Skill Wallet', { timeout: 30000 })
      .should('be.visible')
  })
}); 