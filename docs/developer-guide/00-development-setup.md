# 🛠️ Development Environment Setup

This guide will help you set up your development environment for working with the Pheme Protocol.

## Prerequisites

### Required Software

1. **Node.js and npm**
   - Install Node.js v16 or later
   - Recommended: Use [nvm](https://github.com/nvm-sh/nvm) for Node.js version management
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 16
   nvm use 16
   ```

2. **Git**
   - Install latest version
   - Configure Git:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Docker and Docker Compose**
   - Required for local development
   - [Installation Guide](https://docs.docker.com/get-docker/)

4. **Code Editor**
   - Recommended: Visual Studio Code
   - Required Extensions:
     - Solidity
     - TypeScript
     - ESLint
     - Prettier
     - GitLens

### IDE Setup

#### Visual Studio Code Configuration

1. **Install Extensions**
   ```bash
   code --install-extension JuanBlanco.solidity
   code --install-extension dbaeumer.vscode-eslint
   code --install-extension esbenp.prettier-vscode
   code --install-extension eamodio.gitlens
   ```

2. **Workspace Settings**
   Create `.vscode/settings.json`:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "solidity.formatter": "prettier",
     "[solidity]": {
       "editor.defaultFormatter": "JuanBlanco.solidity"
     },
     "[typescript]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode"
     }
   }
   ```

## Project Setup

### 1. Clone Repository
```bash
git clone https://github.com/PhemeAI/Pheme-Protocol.git
cd Pheme-Protocol
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Development Tools

#### Hardhat
```bash
npm install --save-dev hardhat
npx hardhat compile
```

#### TypeChain
```bash
npm install --save-dev typechain
npx typechain --target ethers-v5 --out-dir types "./artifacts/contracts/**/*.json"
```

## Testing Environment

### 1. Local Blockchain
```bash
npx hardhat node
```

### 2. Test Accounts
- Multiple test accounts are created automatically
- Private keys are displayed in console
- First account has test ETH

### 3. Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test test/SkillWallet.test.ts

# Run tests with coverage
npm run coverage
```

## Development Workflow

### 1. Branch Management
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Keep branch updated
git fetch origin
git rebase origin/main
```

### 2. Code Quality Tools

#### Linting
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

#### Formatting
```bash
# Format code
npm run format
```

### 3. Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding/updating tests
- `chore:` Maintenance tasks

## Debugging

### 1. Hardhat Console
```bash
npx hardhat console --network localhost
```

### 2. Contract Verification
```bash
npx hardhat verify --network testnet DEPLOYED_CONTRACT_ADDRESS "Constructor Arg 1"
```

### 3. Gas Reporter
```bash
REPORT_GAS=true npm test
```

## Performance Optimization

### 1. Contract Size
```bash
npx hardhat size-contracts
```

### 2. Gas Optimization
- Use `view` functions where possible
- Batch operations
- Optimize storage usage

## Security Best Practices

1. **Code Review Checklist**
   - Check for reentrancy
   - Validate input parameters
   - Review access control
   - Check error handling

2. **Testing Requirements**
   - 100% test coverage for critical functions
   - Include edge cases
   - Test failure scenarios

3. **Deployment Safety**
   - Use testnet first
   - Verify deployed bytecode
   - Monitor initial transactions

> 📝 **Note**: Keep this guide updated as new development requirements or best practices emerge.

## Additional Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [OpenZeppelin Guides](https://docs.openzeppelin.com/learn/)
- [Ethereum Development Documentation](https://ethereum.org/developers/) 