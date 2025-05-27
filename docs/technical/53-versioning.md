# Version Management

This document outlines the versioning strategy for all components of the PHEME Protocol.

## Semantic Versioning

PHEME Protocol follows [Semantic Versioning 2.0.0](https://semver.org/) for all components:

```
MAJOR.MINOR.PATCH
```

* **MAJOR**: Incompatible API changes
* **MINOR**: Backward-compatible new functionality
* **PATCH**: Backward-compatible bug fixes

## Component Versioning

### Smart Contracts

```solidity
// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

contract PhemeProtocol {
    string public constant VERSION = "1.0.0";
    
    event Upgraded(string version);
    
    function getVersion() public pure returns (string memory) {
        return VERSION;
    }
}
```

### API Versioning

#### REST API

```typescript
// API version in URL
app.use('/api/v1/users', usersRouter);
app.use('/api/v2/users', usersRouterV2);

// Version header
app.use((req, res, next) => {
  res.setHeader('X-API-Version', '1.0.0');
  next();
});
```

#### GraphQL API

```graphql
type Query {
  # v1 query
  userById(id: ID!): UserV1
  
  # v2 query with new fields
  userByIdV2(id: ID!): UserV2
}

type UserV1 {
  id: ID!
  name: String!
}

type UserV2 {
  id: ID!
  name: String!
  profile: Profile!  # New in v2
}
```

### Frontend Versioning

```typescript
// package.json
{
  "name": "@pheme/frontend",
  "version": "1.0.0",
  "dependencies": {
    "@aura/sdk": "^1.0.0"
  }
}

// Version display
const AppVersion: React.FC = () => {
  return <div>Version: {process.env.REACT_APP_VERSION}</div>;
};
```

### SDK Versioning

```typescript
export class PhemeSDK {
  public readonly version = '1.0.0';
  
  constructor(config: PhemeConfig) {
    this.validateVersion(config.minVersion);
  }
  
  private validateVersion(minVersion: string): void {
    if (semver.lt(this.version, minVersion)) {
      throw new Error(`SDK version ${this.version} is below minimum required version ${minVersion}`);
    }
  }
}
```

## Version Compatibility Matrix

| Component       | Current Version | Minimum Compatible Version | Notes                    |
| --------------- | --------------- | -------------------------- | ------------------------ |
| Smart Contracts | 1.0.0           | 1.0.0                      | No breaking changes yet  |
| REST API        | 2.1.0           | 1.0.0                      | v1 maintained for legacy |
| GraphQL API     | 1.5.0           | 1.0.0                      | Backward compatible      |
| Frontend        | 3.0.0           | 2.0.0                      | Major UI refresh         |
| SDK             | 2.0.0           | 1.5.0                      | New features added       |

## Version Lifecycle

### 1. Development Phase

```bash
# Development versions
1.0.0-alpha.1
1.0.0-beta.1
1.0.0-rc.1
```

### 2. Release Phase

```bash
# Release versions
1.0.0
1.0.1  # Bug fixes
1.1.0  # New features
2.0.0  # Breaking changes
```

### 3. Maintenance Phase

```bash
# Long-term support versions
1.0.0-lts.1
```

## Version Control Guidelines

### Git Tags

```bash
# Create version tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tags
git push origin v1.0.0
```

### Branch Strategy

```plaintext
main
  ├── develop
  │   ├── feature/new-feature
  │   └── bugfix/issue-123
  ├── release/1.0.0
  └── hotfix/1.0.1
```

## Breaking Changes

### Identifying Breaking Changes

1. API endpoint removal/modification
2. Data structure changes
3. Contract function signature changes
4. Required parameter changes
5. Response format changes

### Handling Breaking Changes

```typescript
// Deprecation notice
@Deprecated('Use newEndpoint() instead. Will be removed in v2.0.0')
async function oldEndpoint() {
  return await newEndpoint();
}

// Version check
if (semver.gte(clientVersion, '2.0.0')) {
  // Use new implementation
} else {
  // Use legacy implementation
}
```

## Migration Support

### Version Migration Tools

```typescript
// Migration helper
async function migrateToV2(data: V1Data): Promise<V2Data> {
  return {
    ...data,
    newField: computeNewField(data),
  };
}

// Database migration
async function migrateDatabase() {
  const migrations = await getMigrationFiles();
  for (const migration of migrations) {
    await executeMigration(migration);
  }
}
```

### Documentation Requirements

1. Migration guides for each major version
2. Changelog updates
3. API compatibility notes
4. Breaking change notifications

## Version Deprecation

### Deprecation Policy

1. Announce deprecation 6 months in advance
2. Maintain deprecated versions for 12 months
3. Provide migration tools and documentation
4. Send deprecation notices in API responses

### Deprecation Notice

```typescript
// API response header
res.setHeader('Deprecation', 'version="1.0.0", sunset="2024-12-31"');
res.setHeader('Link', '</api/v2/users>; rel="successor-version"');

// Documentation notice
/**
 * @deprecated Since version 1.5.0
 * Will be removed in version 2.0.0
 * Use {@link newFunction} instead
 */
```

## Version Monitoring

### Version Checks

```typescript
// Runtime version check
function checkCompatibility() {
  const currentVersion = getAppVersion();
  const minVersion = getMinRequiredVersion();
  
  if (semver.lt(currentVersion, minVersion)) {
    throw new VersionError('Upgrade required');
  }
}

// API version monitoring
app.use((req, res, next) => {
  const clientVersion = req.headers['x-client-version'];
  logVersionUsage(clientVersion);
  next();
});
```

### Usage Analytics

```typescript
interface VersionMetrics {
  version: string;
  activeUsers: number;
  errorRate: number;
  deprecationStatus: string;
}

async function trackVersionUsage(version: string): Promise<void> {
  await metrics.increment(`version.${version}.usage`);
}
```
