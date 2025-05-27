# 📥 Installation Guide

{% hint style="info" %}
For a rapid setup, see our [Quick Start Guide](01-quickstart.md).
{% endhint %}

## System Requirements

{% tabs %}
{% tab title="Minimum Requirements" %}
* **CPU:** 2 cores
* **RAM:** 4GB
* **Storage:** 20GB SSD
* **OS:** Ubuntu 20.04+ / macOS 12+ / Windows 10+
* **Node.js:** v18.x or higher
* **Docker:** Latest stable version
{% endtab %}

{% tab title="Recommended Requirements" %}
* **CPU:** 4+ cores
* **RAM:** 8GB+
* **Storage:** 50GB+ SSD
* **Network:** 100Mbps+
{% endtab %}
{% endtabs %}

{% hint style="tip" %}
For production deployments, see [Architecture Guide](03-architecture.md) for scaling recommendations.
{% endhint %}

## Installation Methods

{% tabs %}
{% tab title="Docker (Recommended)" %}
```bash
# Clone the repository
git clone https://github.com/PhemeAI/Pheme-Protocol.git
cd Pheme-Protocol

# Build and start containers
docker-compose up -d

# Check container status
docker-compose ps
```
{% endtab %}

{% tab title="Local Development" %}
```bash
# Install dependencies
yarn install

# Setup environment
cp .env.example .env
cp apps/web/.env.example apps/web/.env
cp services/api/.env.example services/api/.env

# Initialize database
yarn workspace @pheme-ai/api prisma migrate dev

# Start development servers
yarn dev
```
{% endtab %}

{% tab title="Production" %}
```bash
# Build production assets
yarn build

# Start production servers
yarn start
```
{% endtab %}
{% endtabs %}

## Environment Configuration

{% accordion %}
{% accordion-item title="Required Environment Variables" %}
| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI validation | `sk-...` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `BASE_RPC_URL` | Base network RPC URL | `https://mainnet.base.org` |
{% endaccordant-item %}

{% accordion-item title="Optional Environment Variables" %}
| Variable | Description | Default |
|----------|-------------|---------|
| `LOG_LEVEL` | Logging verbosity | `info` |
| `PORT` | API server port | `4000` |
| `WEB_PORT` | Web app port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
{% endaccordant-item %}
{% endaccordion %}

## Database Setup

{% tabs %}
{% tab title="Local Development" %}
```bash
# Create database
yarn workspace @pheme-protocol/api prisma db push

# Seed initial data
yarn workspace @pheme-protocol/api prisma db seed

# Generate Prisma client
yarn workspace @pheme-protocol/api prisma generate
```
{% endtab %}

{% tab title="Production" %}
```bash
# Run migrations
yarn workspace @pheme-protocol/api prisma migrate deploy

# Verify database
yarn workspace @pheme-protocol/api prisma db seed --preview-feature
```
{% endtab %}
{% endtabs %}

## Service Dependencies

{% accordion %}
{% accordion-item title="Required Services" %}
* PostgreSQL (v14+)
* Redis (v6+)
* Base RPC Node
{% endaccordant-item %}

{% accordion-item title="Optional Services" %}
* IPFS Node
* Monitoring Stack (Prometheus/Grafana)
* Log Aggregation (ELK Stack)
{% endaccordant-item %}
{% endaccordion %}

## Security Configuration

{% tabs %}
{% tab title="SSL/TLS Setup" %}
```bash
# Generate self-signed certificate (development)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout private.key -out certificate.crt

# Configure NGINX (production)
# See nginx.conf.example for reference
```
{% endtab %}

{% tab title="Firewall Rules" %}
```bash
# Allow web traffic
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow API traffic
sudo ufw allow 4000/tcp

# Allow monitoring (if needed)
sudo ufw allow 9090/tcp # Prometheus
sudo ufw allow 3000/tcp # Grafana
```
{% endtab %}
{% endtabs %}

## Post-Installation

{% accordion %}
{% accordion-item title="Health Checks" %}
1. Web App: http://localhost:3000
2. API Server: http://localhost:4000/health
3. GraphQL: http://localhost:4000/graphql
4. Documentation: http://localhost:4000/docs
{% endaccordant-item %}

{% accordion-item title="Verification Steps" %}
```bash
# Check services
docker-compose ps

# Verify logs
docker-compose logs -f

# Test API
curl http://localhost:4000/health

# Test database
yarn workspace @pheme-protocol/api prisma studio
```
{% endaccordant-item %}
{% endaccordion %}

## Maintenance

{% accordion %}
{% accordion-item title="Backup Procedures" %}
```bash
# Backup database
docker-compose exec db pg_dump -U postgres pheme > backup.sql

# Backup Redis
docker-compose exec redis redis-cli SAVE
```
{% endaccordant-item %}

{% accordion-item title="Update Procedures" %}
```bash
# Update dependencies
yarn upgrade-interactive --latest

# Update containers
docker-compose pull
docker-compose up -d
```
{% endaccordant-item %}
{% endaccordion %}

## Next Steps

{% hint style="success" %}
Ready to explore more?
* [🏗️ Explore Architecture](03-architecture.md)
* [🔒 Review Security Guidelines](../technical/05-security.md)
* [💻 Start Development](../developer-guide/01-smart-contracts.md)
{% endhint %}

{% hint style="info" %}
Need installation support? Join our [Discord](coming soon)!
{% endhint %}
