# AuroraFlow Backend Setup

## Prerequisites

1. **Node.js** (v14 or higher)
2. **PostgreSQL** (v12 or higher)

## Installation Steps

### 1. Install PostgreSQL

**On macOS:**
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

**On Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

**On Linux:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database (in psql prompt)
CREATE DATABASE auroraflow;

# Create user (optional)
CREATE USER auroraflow_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE auroraflow TO auroraflow_user;

# Exit psql
\q
```

### 3. Run Database Setup Script

```bash
# Run the setup.sql script
psql -U postgres -d auroraflow -f setup.sql

# OR if you created a custom user:
psql -U auroraflow_user -d auroraflow -f setup.sql
```

### 4. Configure Environment Variables

Edit the `.env` file in the backend directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auroraflow
DB_USER=postgres  # or your custom username
DB_PASSWORD=your_actual_password_here

# JWT Secret is already generated
JWT_SECRET=c5505764bb99fc276caf688e8faba2032ef582422a8e61770fc4de31c667573da02ff8ba608e588304730d474d1d035f16a5a81acfd2d157d3bb3a5a1d14e9b9
```

### 5. Start the Server

From the main `auroraflow` directory:

```bash
# Development mode (with auto-reload)
npm run server:dev

# Production mode
npm run server
```

The server will run on `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/health` - Check if the server is running

### Authentication (uncomment in server.js first)
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/logout` - Logout user

## Testing the Setup

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test registration (after uncommenting auth routes)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

## Database Schema

### Tables Created:
- `users` - User accounts
- `glucose_readings` - Blood glucose measurements
- `predictions` - AI-generated glucose predictions
- `meals` - Food intake tracking
- `activities` - Exercise tracking

## Troubleshooting

### PostgreSQL Connection Issues
1. Check if PostgreSQL is running: `pg_isready`
2. Verify credentials in `.env` file
3. Check PostgreSQL logs

### Port Already in Use
Change the `PORT` in `.env` file to a different number (e.g., 3001)

### Module Not Found
Run `npm install` from the main auroraflow directory
