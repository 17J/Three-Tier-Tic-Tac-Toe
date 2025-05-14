
# Gamerzo Arena

A modern Tic-Tac-Toe game with user authentication, dark/light theme support, and game statistics tracking.

## Features

- User authentication (login/logout/registration)
- Modern UI with responsive design
- Dark and light theme toggle
- Game statistics tracking
- Classic Tic-Tac-Toe gameplay with a modern look

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library

### Backend
- Python Flask API
- PostgreSQL database
- Docker containerization

## Project Structure

```
gamerzo/
├── frontend/          # React frontend application
├── backend/           # Flask API
│   ├── app.py         # Main application file
│   ├── requirements.txt # Python dependencies
│   ├── Dockerfile     # Backend Docker configuration
│   └── tests/         # Backend tests
├── db/                # Database configuration
│   ├── init.sql       # Database initialization script
│   └── Dockerfile     # Database Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── README.md          # Project documentation
```

## Getting Started

### Using Docker (Recommended)

To run the complete application with Docker:

```bash
# Clone the repository
git clone <repository-url>
cd gamerzo

# Start all services
docker-compose up -d

# The application will be available at:
# - Frontend: http://localhost:8080
# - Backend API: http://localhost:5000
# - PostgreSQL: localhost:5432
```

### Manual Setup

#### Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

#### Frontend

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

#### Database

You'll need PostgreSQL installed locally:

```bash
# Create database
createdb gamerzo

# Initialize database (run the SQL in db/init.sql)
psql -d gamerzo -f db/init.sql
```

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login a user

### Game Statistics

- `POST /api/stats` - Save game statistics
- `GET /api/stats/<user_id>` - Get user statistics

## Testing

### Backend Tests

```bash
cd backend
pytest
```

## Future Enhancements

- Multiplayer functionality
- Game history and replays
- Advanced user profiles
- Leaderboards

## License

MIT
