# 🤖 AI Worker Development Guide

> 🔗 **Related**: See [Architecture Guide](../get-started/03-architecture.md) for system overview.

## Overview

The PHEME Protocol AI Worker system validates task completions, assesses skill levels, and provides intelligent task recommendations using advanced language models and specialized validation networks.

### Architecture
```mermaid
graph TD
    A[Task Queue] --> B[Worker Pool]
    B --> C[GPT-4 API]
    B --> D[Custom Models]
    B --> E[Validation Network]
    F[Results] --> G[Database]
    F --> H[Blockchain]
    
    subgraph "Worker System"
        B
        C
        D
        E
    end
```

## Development Environment

### Prerequisites
- Node.js v18+
- Redis
- PostgreSQL
- OpenAI API key
- Docker

### Setup
```bash
# Install dependencies
yarn add @pheme/ai-worker @openai/api redis bull

# Setup environment
cp .env.example .env
cp config/worker.example.yml config/worker.yml

# Start development services
docker-compose up -d redis postgres
```

## Worker Configuration

### Environment Variables
```bash
# AI Configuration
OPENAI_API_KEY=sk-...
MODEL_ENDPOINT=https://api.openai.com/v1
DEFAULT_MODEL=gpt-4

# Queue Configuration
REDIS_URL=redis://localhost:6379
QUEUE_PREFIX=pheme:worker

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/pheme

# Validation Network
VALIDATOR_ENDPOINT=https://validator.phemeai.xyz
VALIDATOR_KEY=...
```

### Worker Settings
```yaml
# config/worker.yml
worker:
  concurrency: 5
  maxJobsPerWorker: 100
  timeout: 30000
  retryLimit: 3
  
models:
  gpt4:
    temperature: 0.7
    maxTokens: 2000
    topP: 1
  
validation:
  minConfidence: 0.8
  requiredValidators: 2
  consensusThreshold: 0.7
```

## Task Processing

### Task Queue Setup
```typescript
import Queue from 'bull';
import { TaskProcessor } from '@pheme/ai-worker';

const taskQueue = new Queue('task-validation', REDIS_URL);

taskQueue.process(async (job) => {
    const processor = new TaskProcessor(job.data);
    return processor.validate();
});
```

### Task Processor
```typescript
class TaskProcessor {
    constructor(private task: Task) {}
    
    async validate(): Promise<ValidationResult> {
        // 1. Prepare context
        const context = await this.prepareContext();
        
        // 2. Run AI validation
        const aiResult = await this.runAIValidation(context);
        
        // 3. Get validator consensus
        const consensus = await this.getValidatorConsensus(aiResult);
        
        // 4. Process results
        return this.processResults(consensus);
    }
    
    private async prepareContext() {
        // Implementation
    }
    
    private async runAIValidation(context: Context) {
        // Implementation
    }
    
    private async getValidatorConsensus(result: AIResult) {
        // Implementation
    }
    
    private processResults(consensus: Consensus) {
        // Implementation
    }
}
```

### Task Types

#### Code Review
```typescript
interface CodeReviewTask {
    type: 'CODE_REVIEW';
    pullRequest: {
        url: string;
        diff: string;
        files: string[];
    };
    requirements: {
        style: boolean;
        security: boolean;
        performance: boolean;
    };
}
```

#### Skill Assessment
```typescript
interface SkillAssessmentTask {
    type: 'SKILL_ASSESSMENT';
    submission: {
        content: string;
        evidence: string[];
    };
    criteria: {
        skill: string;
        level: number;
        requirements: string[];
    };
}
```

## AI Models

### Model Integration
```typescript
class AIModelManager {
    private models: Map<string, AIModel>;
    
    constructor() {
        this.models = new Map();
        this.initializeModels();
    }
    
    async predict(input: AIInput): Promise<AIOutput> {
        const model = this.selectModel(input);
        return model.predict(input);
    }
    
    private selectModel(input: AIInput): AIModel {
        // Model selection logic
    }
}
```

### Custom Models
```typescript
class CustomValidator extends BaseModel {
    async validate(submission: Submission): Promise<ValidationResult> {
        // Custom validation logic
    }
    
    async train(data: TrainingData): Promise<void> {
        // Training implementation
    }
}
```

## Validation Network

### Validator Node
```typescript
class ValidatorNode {
    async validate(task: Task): Promise<ValidationResult> {
        // 1. Run local validation
        const localResult = await this.localValidation(task);
        
        // 2. Get peer validations
        const peerResults = await this.getPeerValidations(task);
        
        // 3. Reach consensus
        return this.reachConsensus(localResult, peerResults);
    }
}
```

### Consensus Protocol
```typescript
interface ConsensusResult {
    approved: boolean;
    confidence: number;
    validators: string[];
    signatures: string[];
}

class ConsensusProtocol {
    async reachConsensus(results: ValidationResult[]): Promise<ConsensusResult> {
        // Consensus implementation
    }
}
```

## Error Handling

### Validation Errors
```typescript
class ValidationError extends Error {
    constructor(
        message: string,
        public code: string,
        public details: Record<string, any>
    ) {
        super(message);
    }
}

try {
    await processor.validate(task);
} catch (error) {
    if (error instanceof ValidationError) {
        // Handle validation error
    }
}
```

### Retry Strategy
```typescript
const retryStrategy = {
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 1000
    },
    shouldRetry: (error: Error) => {
        return error.code !== 'VALIDATION_FAILED';
    }
};
```

## Monitoring

### Metrics
```typescript
interface WorkerMetrics {
    jobsProcessed: number;
    validationSuccess: number;
    validationFailure: number;
    averageProcessingTime: number;
    modelLatency: Record<string, number>;
    validatorHealth: Record<string, boolean>;
}
```

### Health Checks
```typescript
class HealthMonitor {
    async checkHealth(): Promise<HealthStatus> {
        return {
            queue: await this.checkQueue(),
            models: await this.checkModels(),
            validators: await this.checkValidators(),
            database: await this.checkDatabase()
        };
    }
}
```

## Testing

### Unit Tests
```typescript
describe('TaskProcessor', () => {
    it('should validate code review', async () => {
        const task = createMockCodeReviewTask();
        const processor = new TaskProcessor(task);
        const result = await processor.validate();
        
        expect(result.approved).toBe(true);
        expect(result.confidence).toBeGreaterThan(0.8);
    });
});
```

### Integration Tests
```typescript
describe('Validation Network', () => {
    it('should reach consensus', async () => {
        const network = new ValidationNetwork();
        const results = await network.validate(mockTask);
        
        expect(results.consensus).toBe(true);
        expect(results.validators.length).toBeGreaterThan(1);
    });
});
```

## Deployment

### Docker Setup
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

CMD ["yarn", "start:worker"]
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pheme-ai-worker
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: worker
          image: aura/ai-worker:latest
          env:
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: pheme-secrets
                  key: redis-url
```

## Resources

### Documentation
- [OpenAI Documentation](https://platform.openai.com/docs)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md)
- [Validation Protocol Spec](../technical/30-validation.md)

### Tools
- [Model Playground](https://playground.phemeai.xyz)
- [Validator Dashboard](https://validator.phemeai.xyz/dashboard)
- [Metrics Dashboard](https://metrics.phemeai.xyz)

> 🔒 **Security**: Review our [Security Guidelines](../technical/05-security.md) for AI worker security best practices.
