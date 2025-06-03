describe('Mint Skill Wallet', () => {
  beforeEach(() => {
    // Mock Web3Modal
    cy.window().then((win) => {
      const requestStub = cy.stub()
      win.ethereum = {
        request: requestStub,
        on: cy.stub(),
        removeListener: cy.stub(),
        isMetaMask: true,
        selectedAddress: '0x123...',
        networkVersion: '1',
      }
    })

    // Visit the page
    cy.visit('/mint-skill-wallet')
    
    // Wait for the page to load
    cy.get('body').should('be.visible')
  })

  it('should show network warning when not on Base Sepolia', () => {
    // Mock being on wrong network
    cy.window().then((win) => {
      win.ethereum.request.resolves('0x1')
    })

    // Wait for and check network warning
    cy.contains('Please switch to Base Sepolia network to continue', { timeout: 10000 })
      .should('be.visible')
  })

  it('should enable mint button after connecting wallet', () => {
    // Mock being on Base Sepolia
    cy.window().then((win) => {
      win.ethereum.request.resolves('0x14a34')
    })

    // Click connect button and wait for connection
    cy.contains('Connect Wallet').click()
    
    // Wait for Web3Modal to appear and handle connection
    cy.get('[data-testid="w3m-modal"]', { timeout: 10000 }).should('be.visible')
    
    // Mock successful connection
    cy.window().then((win) => {
      win.ethereum.request.resolves('0x14a34')
    })

    // Check if mint button is enabled
    cy.contains('Mint Skill Wallet', { timeout: 10000 })
      .should('be.visible')
      .and('not.be.disabled')
  })

  it('should show success modal after successful mint', () => {
    // Mock being on Base Sepolia
    cy.window().then((win) => {
      win.ethereum.request.resolves('0x14a34')
    })

    // Click connect button and wait for connection
    cy.contains('Connect Wallet').click()
    
    // Wait for Web3Modal to appear and handle connection
    cy.get('[data-testid="w3m-modal"]', { timeout: 10000 }).should('be.visible')
    
    // Mock successful mint transaction
    cy.window().then((win) => {
      win.ethereum.request.resolves({
        hash: '0x123...',
        wait: cy.stub().resolves({
          hash: '0x123...',
          from: '0x123...',
          to: '0x456...',
        }),
      })
    })

    // Click mint button and wait for success
    cy.contains('Mint Skill Wallet', { timeout: 10000 }).click()

    // Check for success modal
    cy.contains('✨ Skill Wallet Minted!', { timeout: 10000 })
      .should('be.visible')
  })

  it('should show error when trying to mint again', () => {
    // Mock being on Base Sepolia
    cy.window().then((win) => {
      win.ethereum.request.resolves('0x14a34')
    })

    // Click connect button and wait for connection
    cy.contains('Connect Wallet').click()
    
    // Wait for Web3Modal to appear and handle connection
    cy.get('[data-testid="w3m-modal"]', { timeout: 10000 }).should('be.visible')
    
    // Mock already minted error
    cy.window().then((win) => {
      win.ethereum.request.rejects(new Error('Already minted'))
    })

    // Click mint button and wait for error
    cy.contains('Mint Skill Wallet', { timeout: 10000 }).click()

    // Check for error message
    cy.contains('You already own a Skill Wallet', { timeout: 10000 })
      .should('be.visible')
  })
}) 