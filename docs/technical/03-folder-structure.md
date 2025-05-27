# 📁 Project Structure

## Overview

The AURA Protocol codebase follows a monorepo structure, organizing code by functionality and maintaining clear separation of concerns.

## Root Structure

```
aura-chat/
├── apps/                  # Application frontends
├── packages/             # Shared packages and contracts
├── services/            # Backend services
├── tools/               # Development and deployment tools
├── docs/                # Documentation
├── scripts/             # Utility scripts
└── config/              # Global configuration
```

## Applications

```
apps/
├── web/                 # Main web application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Next.js pages
│   │   ├── styles/      # CSS and styling
│   │   ├── utils/       # Utility functions
│   │   └── config/      # App configuration
│   ├── public/          # Static assets
│   ├── tests/           # Frontend tests
│   └── package.json
│
└── admin/              # Admin dashboard
    ├── src/
    │   ├── components/
    │   ├── views/
    │   ├── services/
    │   └── store/
    ├── public/
    └── package.json
```

## Smart Contracts

```
packages/contracts/
├── contracts/           # Smart contract source files
│   ├── core/           # Core protocol contracts
│   │   ├── SkillWallet.sol
│   │   ├── ReputationOracle.sol
│   │   └── AuraToken.sol
│   ├── governance/     # Governance contracts
│   │   ├── AuraGovernor.sol
│   │   ├── MeritMultiplier.sol
│   │   ├── TimelockController.sol
│   │   └── TreasuryVault.sol
│   ├── interfaces/     # Contract interfaces
│   └── libraries/      # Shared libraries
├── test/               # Contract tests
│   ├── unit/
│   └── integration/
├── scripts/            # Deployment scripts
├── tasks/              # Hardhat tasks
└── types/              # TypeScript types
```

## Backend Services

```
services/
├── api/                # Main API service
│   ├── src/
│   │   ├── modules/    # Feature modules
│   │   ├── common/     # Shared code
│   │   ├── config/     # Service config
│   │   └── types/      # TypeScript types
│   ├── test/
│   └── package.json
│
├── validator/          # AI validation service
│   ├── src/
│   │   ├── models/     # AI models
│   │   ├── services/   # Core services
│   │   └── utils/      # Utilities
│   ├── test/
│   └── package.json
│
└── indexer/           # Blockchain indexing service
    ├── src/
    │   ├── handlers/   # Event handlers
    │   ├── schema/     # GraphQL schema
    │   └── mappings/   # Subgraph mappings
    └── package.json
```

## Shared Packages

```
packages/
├── tsconfig/          # Shared TypeScript config
├── eslint-config/    # Shared ESLint config
├── ui/               # Shared UI components
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── styles/
│   └── package.json
│
└── sdk/              # JavaScript/TypeScript SDK
    ├── src/
    │   ├── client/
    │   ├── types/
    │   └── utils/
    ├── examples/
    └── package.json
```

## Documentation

```
docs/
├── overview/          # Protocol overview
├── technical/        # Technical documentation
│   ├── 01-tech-stack.md
│   ├── 02-architecture.md
│   ├── 03-folder-structure.md
│   ├── 04-coding-standards.md
│   ├── 05-security.md
│   ├── 06-testing.md
│   ├── 07-ci-cd.md
│   ├── 08-multichain.md
│   ├── 09-governance.md
│   ├── 10-developer-setup.md
│   └── 11-contribution-guidelines.md
├── developer-guide/  # Developer guides
├── get-started/     # Getting started guides
├── governance/      # User governance guides
└── assets/          # Documentation assets
```

## Development Tools

```
tools/
├── hardhat/          # Hardhat configuration and plugins
├── deployment/       # Deployment tools
│   ├── terraform/    # Infrastructure as Code
│   └── kubernetes/   # K8s configuration
├── monitoring/       # Monitoring setup
│   ├── grafana/
│   └── prometheus/
└── scripts/          # Development scripts
```

## Configuration

```
config/
├── default.json      # Default configuration
├── development.json  # Development environment
├── staging.json     # Staging environment
├── production.json  # Production environment
└── test.json       # Test configuration
```

## Important Files

```
./
├── package.json      # Root package.json
├── turbo.json       # Turborepo configuration
├── .env.example     # Environment variables example
├── .gitignore       # Git ignore rules
├── .eslintrc.js     # ESLint configuration
├── .prettierrc      # Prettier configuration
├── tsconfig.json    # TypeScript configuration
└── README.md        # Project documentation
```

## Module Organization

### Components
```
components/
├── common/           # Shared components
│   ├── Button/
│   ├── Input/
│   └── Card/
├── layout/          # Layout components
│   ├── Header/
│   ├── Footer/
│   └── Sidebar/
└── features/        # Feature-specific components
    ├── skills/
    ├── validation/
    └── reputation/
```

### API Modules
```
modules/
├── users/
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   └── entities/
├── skills/
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   └── entities/
└── validation/
    ├── controllers/
    ├── services/
    ├── dto/
    └── entities/
```

## Testing Organization

```
test/
├── unit/            # Unit tests
│   ├── components/
│   ├── services/
│   └── utils/
├── integration/     # Integration tests
│   ├── api/
│   ├── contracts/
│   └── e2e/
└── fixtures/        # Test data
```

## Style Organization

```
styles/
├── theme/           # Theme configuration
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
├── components/      # Component styles
├── layouts/         # Layout styles
└── globals.css     # Global styles
```

## Script Organization

```
scripts/
├── deploy/          # Deployment scripts
├── test/            # Test scripts
├── build/           # Build scripts
└── utils/           # Utility scripts
```

## Best Practices

1. **Module Organization**
   - Group related files together
   - Use clear, descriptive names
   - Maintain consistent structure

2. **File Naming**
   - Use kebab-case for files
   - Use PascalCase for components
   - Use camelCase for utilities

3. **Import Organization**
   - Group imports by type
   - Use absolute imports
   - Maintain consistent order

4. **Code Organization**
   - Follow single responsibility
   - Use appropriate abstractions
   - Maintain clean architecture

5. **Testing Organization**
   - Mirror source structure
   - Group by test type
   - Use meaningful names
