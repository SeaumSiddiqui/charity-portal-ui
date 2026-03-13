# Docker Deployment Guide

## Prerequisites
- Docker installed
- Docker Compose installed

## Environment Setup

The application uses environment-specific configuration files:
- `.env.development` - Development environment (localhost)
- `.env.production` - Production environment (qcharitybd.com)

## Building and Running

### Development Environment

Build and run in development mode (uses localhost URLs):

```bash
# Build the image
docker-compose --profile dev build

# Run the container
docker-compose --profile dev up -d

# View logs
docker-compose --profile dev logs -f

# Stop the container
docker-compose --profile dev down
```

The application will be available at: `http://localhost:3000`

### Production Environment

Build and run in production mode (uses qcharitybd.com URLs):

```bash
# Build the image
docker-compose --profile prod build

# Run the container
docker-compose --profile prod up -d

# View logs
docker-compose --profile prod logs -f

# Stop the container
docker-compose --profile prod down
```

The application will be available at: `http://localhost` (port 80)

## Manual Docker Build

If you prefer to build without docker-compose:

### Development
```bash
docker build --build-arg BUILD_ENV=development -t qc-frontend:dev .
docker run -d -p 3000:80 --name qc-frontend-dev qc-frontend:dev
```

### Production
```bash
docker build --build-arg BUILD_ENV=production -t qc-frontend:prod .
docker run -d -p 80:80 --name qc-frontend-prod qc-frontend:prod
```

## Configuration Details

### Development URLs
- Keycloak: `http://localhost:8080/auth`
- API Backend: `http://localhost:5050/api`

### Production URLs
- Keycloak: `https://qcharitybd.com/auth`
- API Backend: `https://qcharitybd.com/api`

## Health Check

Check if the application is running:

```bash
curl http://localhost/health
```

## Troubleshooting

### View container logs
```bash
docker logs qc-frontend-dev  # for dev
docker logs qc-frontend-prod # for prod
```

### Access container shell
```bash
docker exec -it qc-frontend-dev sh  # for dev
docker exec -it qc-frontend-prod sh # for prod
```

### Rebuild from scratch
```bash
docker-compose --profile dev build --no-cache
docker-compose --profile prod build --no-cache
```

## Notes

- The Dockerfile uses a multi-stage build to minimize the final image size
- Nginx serves the static React application
- Static assets are cached for 1 year
- index.html is not cached to ensure updates are reflected immediately
- Health check endpoint is available at `/health`
