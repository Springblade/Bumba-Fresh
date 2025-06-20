# Bumba Fresh Docker Setup

This directory contains Docker configuration files for running the Bumba Fresh application in containerized environments.

## Quick Start

### Development Environment
```bash
# Start development environment
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Database: localhost:5433
# PgAdmin: http://localhost:5050 (use profile: --profile dev)
```

### Production Environment
```bash
# Start production environment
docker-compose up --build -d

# Access the application
# Application: http://localhost:80
# API: http://localhost:80/api
```

## Services

### Frontend (`frontend`)
- **Image**: Custom built from `Dockerfile.frontend`
- **Technology**: React + Vite with Nginx (Alpine Linux)
- **Port**: 3000 (dev) / 80 (prod)
- **Features**: 
  - Multi-stage build for optimal size
  - Nginx reverse proxy with compression
  - Static asset caching
  - Health checks

### Backend (`backend`)
- **Image**: Node.js 18 Alpine
- **Port**: 8000
- **Features**:
  - Auto-restart on changes (dev mode)
  - Debug port 9229 (dev mode)
  - Connected to PostgreSQL

### Database (`postgres`)
- **Image**: PostgreSQL 15 Alpine
- **Port**: 5433
- **Features**:
  - Persistent volume storage
  - Automatic schema initialization
  - Health checks
  - Optimized for UTF-8



### Reverse Proxy (`nginx`)
- **Image**: Nginx Alpine
- **Ports**: 80, 443
- **Features**:
  - Load balancing
  - Static file serving
  - API proxying
  - Rate limiting
  - Security headers
  - Gzip compression

### Database Admin (`pgadmin`)
- **Image**: PgAdmin 4
- **Port**: 5050
- **Profile**: Development only
- **Credentials**: admin@bumbafresh.com / admin123

## Performance Optimizations

### Alpine Linux
- All services use Alpine Linux for minimal image size
- Reduced attack surface and faster startup times

### Multi-stage Builds
- Frontend uses multi-stage build to minimize production image
- Separate dependency installation and build stages

### Caching Strategy
- Nginx static file caching with proper headers
- Docker layer caching optimization

### Resource Limits
- PostgreSQL optimized for UTF-8 and performance
- Nginx worker connections: 1024

### Security Features
- Non-root user in containers
- Security headers in Nginx
- Rate limiting for API endpoints
- Network isolation with custom bridge network

## Environment Variables

### Required for Production
```env
# Database
POSTGRES_DB=bumba_fresh
POSTGRES_USER=bumba_user
POSTGRES_PASSWORD=your-secure-password

# Backend
JWT_SECRET=your-super-secure-jwt-secret
NODE_ENV=production

# Frontend
VITE_API_URL=http://your-domain.com/api
```

### Development Defaults
All development environment variables are pre-configured in the Docker Compose files.

## Volumes

- `postgres_data`: PostgreSQL database files

## Networks

- `bumba-network`: Custom bridge network (172.20.0.0/16) for service communication

## Health Checks

All services include health checks with:
- 30-second intervals
- 10-second timeouts
- 3 retries before marking unhealthy
- 5-second startup grace period

## Commands

```bash
# Development (with PgAdmin)
docker-compose --profile dev up --build
docker-compose --profile dev down

# Production
docker-compose up --build -d
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Database shell
docker-compose exec postgres psql -U bumba_user -d bumba_fresh
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8000, 5433, 5050, 80 are available
2. **Volume permissions**: On Linux, ensure Docker has proper permissions for volume mounts
3. **Memory issues**: Increase Docker Desktop memory allocation if services fail to start
4. **Build failures**: Clear Docker cache with `docker system prune -a` if builds fail

### Performance Monitoring

Monitor container resource usage:
```bash
docker stats
```

View container health:
```bash
docker-compose ps
```
