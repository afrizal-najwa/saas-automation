# SaaS Automation - Docker Setup Guide

This guide provides instructions for setting up and running the SaaS Automation application using Docker.

## Prerequisites

- [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/)
- Clerk account for authentication (for API keys)

## Environment Setup

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd saas-automation
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   DATABASE_URL=postgresql://test:password@postgresql:5432/sas_automation_db
   ```

   > **Note:** For local development without Docker, use `DATABASE_URL=postgresql://test:password@localhost:5439/sas_automation_db` instead.

## Running the Application

### Using the Provided Scripts

#### For Windows (PowerShell):

```powershell
./run.ps1
```

#### For Linux/macOS:

```bash
chmod +x run.sh
./run.sh
```

### Manual Setup

If you prefer to run commands manually:

1. Stop any running containers and remove old images:
   ```bash
   docker compose down
   docker rmi saas-automation_app
   ```

2. Build and start the services:
   ```bash
   docker compose up --build -d
   ```

3. View logs:
   ```bash
   docker compose logs -f
   ```

## Accessing the Application

Once the containers are running:

- Web application: [http://localhost:3000](http://localhost:3000)
- PostgreSQL database: Available on port 5439 (mapped from container port 5432)

## Project Structure

- `Dockerfile` - Contains the multi-stage build process for the Next.js application
- `docker-compose.yaml` - Defines the services (PostgreSQL and app)
- `prisma/` - Database schema and migration files
- `.env` - Environment variables (make sure to create this)
- `run.sh` / `run.ps1` - Helper scripts to manage Docker containers

## Database Management

The PostgreSQL database is configured with:
- Username: `test`
- Password: `password`
- Database name: `sas_automation_db`

Database migrations run automatically when the container starts.

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the database, check:
1. The `DATABASE_URL` environment variable in the `.env` file
2. The network connection between containers (`docker network ls`)
3. PostgreSQL container health (`docker compose ps`)

### Build Errors

If the build fails:
1. Check Docker logs: `docker compose logs app`
2. Ensure all dependencies are properly installed
3. Verify your Node.js version compatibility (project uses Node.js 20)

### Clearing Docker Resources

To completely clean up:
```bash
docker compose down
docker rmi saas-automation_app postgres:15-alpine
docker volume prune -f  # Be careful, this removes all unused volumes
```

## Development Workflow

1. Make changes to your code
2. Run the helper script to rebuild and restart containers
3. Check the logs for any errors
4. Access the application at [http://localhost:3000](http://localhost:3000)

## Additional Commands

- Access PostgreSQL CLI:
  ```bash
  docker compose exec postgresql psql -U test -d sas_automation_db
  ```

- Access app container shell:
  ```bash
  docker compose exec app /bin/sh
  ```

- View real-time container logs:
  ```bash
  docker compose logs -f app
  ```