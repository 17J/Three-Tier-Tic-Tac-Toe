
# Tic-Tac-Nexus Game

A full-stack application with React frontend and Spring Boot backend.

## Project Structure

```
project-root/
├── frontend/           # React frontend application
│   ├── public/         # Static files
│   ├── src/            # Source code
│   ├── Dockerfile      # Frontend Docker configuration
│   └── ...             # Other frontend config files
│
├── backend/            # Spring Boot backend application
│   ├── src/            # Source code
│   ├── Dockerfile      # Backend Docker configuration
│   └── ...             # Other backend config files
│
├── docker-compose.yml  # Docker compose configuration
└── README.md           # This file
```

## Development

### Prerequisites
- Docker and Docker Compose
- Node.js and npm (for local frontend development)
- Java and Maven (for local backend development)

### Running with Docker
```bash
# Start all services
docker-compose up

# Build and start all services
docker-compose up --build

# Start specific service
docker-compose up frontend
docker-compose up backend
```

### Local Development
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
./mvnw spring-boot:run
```

## Accessing the Application
- Frontend: http://localhost
- Backend API: http://localhost:8080
