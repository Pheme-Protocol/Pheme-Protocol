# 🧪 Testing Guidelines

## Testing Strategy

### Test Pyramid
```plaintext
     /\
    /  \
   /E2E \
  /------\
 /  Int.  \
/----------\
/ Unit Tests \
--------------
```

1. **Unit Tests**: 70% coverage
2. **Integration Tests**: 20% coverage
3. **E2E Tests**: 10% coverage

## Smart Contract Testing

### Unit Tests
```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SkillWallet", function() {
  let skillWallet;
  let owner;
  let user;

  beforeEach(async function() {
    const SkillWallet = await ethers.getContractFactory("SkillWallet");
    [owner, user] = await ethers.getSigners();
    skillWallet = await SkillWallet.deploy();
    await skillWallet.deployed();
  });

  describe("Minting", function() {
    it("Should mint a new skill wallet", async function() {
      await skillWallet.connect(user).mint();
      expect(await skillWallet.balanceOf(user.address)).to.equal(1);
    });

    it("Should revert if user already has a wallet", async function() {
      await skillWallet.connect(user).mint();
      await expect(
        skillWallet.connect(user).mint()
      ).to.be.revertedWith("Already has wallet");
    });
  });
});
```

### Integration Tests
```typescript
describe("Protocol Integration", function() {
  let skillWallet;
  let reputationOracle;
  let validator;

  beforeEach(async function() {
    // Deploy contracts
    const SkillWallet = await ethers.getContractFactory("SkillWallet");
    const ReputationOracle = await ethers.getContractFactory("ReputationOracle");
    
    skillWallet = await SkillWallet.deploy();
    reputationOracle = await ReputationOracle.deploy(skillWallet.address);
    
    // Setup roles and permissions
    await skillWallet.grantRole(VALIDATOR_ROLE, reputationOracle.address);
  });

  it("Should update reputation after skill validation", async function() {
    // Test full validation flow
    await skillWallet.connect(user).mint();
    await reputationOracle.validateSkill(user.address, skillId);
    
    const reputation = await skillWallet.getReputation(user.address);
    expect(reputation.score).to.be.gt(0);
  });
});
```

### Property-Based Testing
```typescript
import { assert } from "chai";
import fc from "fast-check";

describe("ReputationCalculator Properties", function() {
  it("Score should always be between 0 and 100", async function() {
    await fc.assert(
      fc.property(fc.array(fc.integer(0, 100)), (activities) => {
        const score = calculator.calculateScore(activities);
        return score >= 0 && score <= 100;
      })
    );
  });
});
```

## Backend Testing

### Unit Tests
```typescript
import { Test } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      save: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('getUser', () => {
    it('should return user by wallet address', async () => {
      const mockUser = { wallet: '0x123', reputation: 100 };
      mockRepository.find.mockResolvedValue([mockUser]);

      const result = await service.getUser('0x123');
      expect(result).toEqual(mockUser);
    });
  });
});
```

### Integration Tests
```typescript
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

describe('User Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users/:wallet (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/0x123')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('wallet');
        expect(res.body).toHaveProperty('reputation');
      });
  });
});
```

## Frontend Testing

### Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillCard } from './SkillCard';

describe('SkillCard', () => {
  const mockSkill = {
    id: '1',
    name: 'Solidity',
    level: 'Advanced',
  };

  it('renders skill details correctly', () => {
    render(<SkillCard skill={mockSkill} />);
    
    expect(screen.getByText('Solidity')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('handles validation click', () => {
    const onValidate = jest.fn();
    render(<SkillCard skill={mockSkill} onValidate={onValidate} />);
    
    fireEvent.click(screen.getByText('Validate'));
    expect(onValidate).toHaveBeenCalledWith(mockSkill.id);
  });
});
```

### Hook Tests
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useSkillValidation } from './useSkillValidation';

describe('useSkillValidation', () => {
  it('should handle validation state', async () => {
    const { result } = renderHook(() => useSkillValidation());

    expect(result.current.isValidating).toBe(false);

    act(() => {
      result.current.startValidation('1');
    });

    expect(result.current.isValidating).toBe(true);
  });
});
```

## E2E Testing

### Cypress Tests
```typescript
describe('Skill Validation Flow', () => {
  beforeEach(() => {
    cy.connectWallet();
    cy.visit('/dashboard');
  });

  it('should complete skill validation process', () => {
    // Submit evidence
    cy.get('[data-testid="skill-card"]').first().click();
    cy.get('[data-testid="evidence-input"]')
      .type('https://github.com/user/project');
    cy.get('[data-testid="submit-button"]').click();

    // Check validation status
    cy.get('[data-testid="validation-status"]')
      .should('contain', 'Pending');

    // Wait for validation
    cy.waitForValidation();

    // Verify success
    cy.get('[data-testid="validation-status"]')
      .should('contain', 'Validated');
  });
});
```

## Performance Testing

### Load Testing
```typescript
import { check } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
};

export default function() {
  const res = http.get('https://api.phemeai.xyz/users');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

### Smart Contract Gas Testing
```typescript
describe("Gas Usage", function() {
  it("Should optimize mint function gas usage", async function() {
    const tx = await skillWallet.connect(user).mint();
    const receipt = await tx.wait();
    
    expect(receipt.gasUsed).to.be.below(200000);
  });
});
```

## Test Coverage

### Coverage Goals
- Smart Contracts: 100%
- Backend Services: 85%
- Frontend Components: 80%
- Integration Tests: 70%

### Coverage Report
```bash
# Smart Contracts
npx hardhat coverage

# Backend
npm run test:cov

# Frontend
npm run test:coverage
```

## Continuous Testing

### CI Pipeline
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Unit Tests
        run: npm run test
        
      - name: Integration Tests
        run: npm run test:integration
        
      - name: E2E Tests
        run: npm run test:e2e
        
      - name: Coverage Report
        run: npm run coverage
```

## Test Environment

### Local Setup
```bash
# Install dependencies
npm install

# Start local blockchain
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.ts --network localhost

# Start API server
npm run start:dev

# Run test suite
npm run test:all
```

### Test Data
```typescript
export const mockUsers = [
  {
    wallet: '0x123',
    skills: ['solidity', 'react'],
    reputation: 85,
  },
  // More mock data...
];
```

## Test Documentation

### Test Case Template
```markdown
## Test Case: [ID]

### Description
[Brief description of what is being tested]

### Prerequisites
- [Required setup]
- [Required permissions]

### Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Results
- [Expected outcome 1]
- [Expected outcome 2]

### Actual Results
- [Actual outcome 1]
- [Actual outcome 2]

### Pass/Fail Criteria
- [ ] Criteria 1
- [ ] Criteria 2
