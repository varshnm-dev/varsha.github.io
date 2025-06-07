# Household Gamification App

A full-stack application for gamifying household chores with persistent data storage using MongoDB, JWT authentication, and user management.

## Features

- **User Management**: Register, login, and manage user profiles
- **Household System**: Create or join households with invite codes
- **Chore Management**: Create, update, and track household chores
- **Gamification Elements**: Points, achievements, and streaks
- **Leaderboards**: Daily, weekly, monthly, and all-time rankings
- **Mobile-Friendly Interface**: Responsive design for all devices

## Technology Stack

- **Frontend**: React 18, React Router v6, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js v14+ and npm (for local development without Docker)

### Running with Docker Compose (Recommended)

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd household-gamification-app
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up
   ```

3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

4. To stop the application:
   ```bash
   docker-compose down
   ```

### Running Locally (Without Docker)

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI_LOCAL=mongodb://localhost:27017/household-gamification
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   ```

4. Start the MongoDB server locally.

5. Run the backend server:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_APP_NAME=Household Gamification
   ```

4. Start the React development server:
   ```bash
   npm start
   ```

## Database Seeding

To seed the database with initial data (demo household, users, and chores):

### With Docker
```bash
docker-compose exec backend npm run seed
```

### Without Docker
```bash
cd backend
npm run seed
```

## Demo Credentials

After seeding the database, you can login with these demo credentials:

- **Admin User**:
  - Email: admin@example.com
  - Password: password123

- **Regular Member**:
  - Email: member@example.com
  - Password: password123

## API Documentation

The backend API provides the following endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/me` - Get current user
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/achievements` - Get user achievements
- `GET /api/users/streaks` - Get user streaks

### Households
- `POST /api/households` - Create a new household
- `POST /api/households/join` - Join a household with invite code
- `GET /api/households/my-household` - Get current user's household
- `GET /api/households/:householdId` - Get a specific household
- `PATCH /api/households/:householdId` - Update a household (admin only)
- `DELETE /api/households/:householdId` - Delete a household (admin only)

### Chores
- `GET /api/chores` - Get all chores for user's household
- `GET /api/chores/:id` - Get a specific chore
- `POST /api/chores` - Create a new chore (admin only)
- `PATCH /api/chores/:id` - Update a chore (admin only)
- `DELETE /api/chores/:id` - Delete a chore (admin only)

### Completed Chores
- `GET /api/completed-chores` - Get all completed chores
- `GET /api/completed-chores/:id` - Get a specific completed chore
- `POST /api/completed-chores` - Mark a chore as completed
- `PATCH /api/completed-chores/:id` - Update a completed chore
- `DELETE /api/completed-chores/:id` - Delete a completed chore

### Achievements
- `GET /api/achievements/my-achievements` - Get user's achievements
- `GET /api/achievements/household` - Get household achievements

### Leaderboard
- `GET /api/leaderboard/daily` - Get daily leaderboard
- `GET /api/leaderboard/weekly` - Get weekly leaderboard
- `GET /api/leaderboard/monthly` - Get monthly leaderboard
- `GET /api/leaderboard/all-time` - Get all-time leaderboard

## License

This project is licensed under the MIT License
