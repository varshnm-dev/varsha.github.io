# Household Gamification App

A full-stack application for gamifying household chores with persistent data storage using MongoDB, JWT authentication, and user management.

## Features

- **User Management**: Register, login, and manage user profiles
- **Household System**: Create or join households with invite codes
- **Chore Management**: Create, update, and track household chores
- **🛍️ Chore Marketplace**: Browse and add chores from a curated template library
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

To seed the database with initial data (demo household, users, chores, and marketplace templates):

### With Docker
```bash
docker-compose exec backend npm run seed
```

### Without Docker
```bash
cd backend
npm run seed
```

**What gets seeded:**
- Demo household with admin and member users
- 25 sample chores for the demo household
- 25 chore templates in the marketplace (available to all households)
- Achievement definitions and user streaks

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
- `POST /api/chores/from-template/:templateId` - Add chore from marketplace template (admin only)
- `PATCH /api/chores/:id` - Update a chore (admin only)
- `DELETE /api/chores/:id` - Delete a chore (admin only)

### Chore Templates (Marketplace)
- `GET /api/chore-templates` - Browse all marketplace templates (with search/filter)
- `GET /api/chore-templates/by-category` - Get templates grouped by category
- `GET /api/chore-templates/:id` - Get a specific template
- `POST /api/chore-templates` - Create new template (admin only)
- `PATCH /api/chore-templates/:id` - Update template (admin only)
- `DELETE /api/chore-templates/:id` - Deactivate template (admin only)

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

## Deployment

### Quick Deploy to Render

1. **Push to GitHub**: Ensure your code is in a GitHub repository

2. **Deploy via Blueprint**:
   - Go to [render.com](https://render.com) and create an account
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically deploy both frontend and backend using `render.yaml`

3. **Manual Setup**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed manual deployment instructions

### Production URLs
- **Frontend**: `https://your-app-name.onrender.com`
- **Backend API**: `https://your-api-name.onrender.com/api`
- **Health Check**: `https://your-api-name.onrender.com/health`

### Environment Variables Required
- Backend: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`
- Frontend: `REACT_APP_API_URL`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide with all environment variables and configuration details.

## Files Structure

```
household-gamification-app/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   │   ├── auth.controller.js
│   │   │   ├── chore.controller.js
│   │   │   ├── choreTemplate.controller.js  # 🆕 Marketplace
│   │   │   ├── household.controller.js
│   │   │   └── ...
│   │   ├── models/         # MongoDB models
│   │   │   ├── chore.model.js
│   │   │   ├── choreTemplate.model.js       # 🆕 Marketplace templates
│   │   │   ├── user.model.js
│   │   │   └── ...
│   │   ├── routes/         # API routes
│   │   │   ├── chore.routes.js
│   │   │   ├── choreTemplate.routes.js      # 🆕 Marketplace routes
│   │   │   └── ...
│   │   ├── middleware/     # Custom middleware
│   │   └── seeds/          # Database seeding
│   │       ├── seed.js                      # Main seed script
│   │       └── choreTemplates.js           # 🆕 Marketplace templates
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── render.yaml         # Backend Render config
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ChoreMarketplace.js         # 🆕 Marketplace component
│   │   │   └── ...
│   │   ├── pages/          # Page components
│   │   │   ├── ChoreList.js                # Enhanced with marketplace
│   │   │   ├── HouseholdSettings.js        # Enhanced household creation
│   │   │   └── ...
│   │   ├── context/        # React context
│   │   └── utils/          # Utility functions
│   │       └── api.js                      # Enhanced with marketplace APIs
│   ├── public/
│   │   └── _redirects      # Client-side routing config
│   ├── package.json        # Frontend dependencies
│   └── render.yaml         # Frontend Render config
├── render.yaml             # Full-stack deployment config
├── DEPLOYMENT.md           # Detailed deployment guide
└── scripts/
    └── setup-render.sh     # Deployment setup script
```

## 🛍️ Chore Marketplace

The app features a comprehensive chore marketplace system that allows household admins to browse and add chores from a curated template library.

### How It Works

1. **For New Households**: 
   - Register and create a household automatically
   - Visit the Chore List page to see an empty state
   - Click "Browse Marketplace to Add Chores"
   - Select relevant chores from 25 categorized templates
   - Each household gets only the chores they need

2. **For Existing Households**:
   - Admins can click "Browse Marketplace" anytime
   - Add new chores from the template library
   - System prevents duplicate chores in the same household

3. **Marketplace Features**:
   - **25 Curated Templates**: Across 6 categories (Kitchen, Cleaning, Laundry, etc.)
   - **Visual Design**: Each template shows emoji, points, difficulty, and time estimate
   - **Search & Filter**: Find chores by category or text search
   - **Category View**: Templates organized by category for easy browsing
   - **List View**: All templates in a searchable grid
   - **Smart Prevention**: Prevents adding duplicate chores to a household

### Template Categories

- **Kitchen & Dining**: Washing dishes, cooking, cleaning appliances
- **Cleaning & Maintenance**: Vacuuming, mopping, taking out trash
- **Laundry & Clothes**: Washing, folding, ironing clothes
- **Shopping & Errands**: Grocery shopping, mail pickup, dog walking
- **Bedroom & Organization**: Making beds, organizing closets
- **Other**: Miscellaneous household tasks

### Benefits

- **No Database Bloat**: Templates exist once, chores are created only when selected
- **Admin Control**: Only household admins can browse and add from marketplace
- **Customizable**: Each household gets only relevant chores for their situation
- **Expandable**: New templates can be added to marketplace anytime
- **Clean Architecture**: Clear separation between templates and active household chores

## License

This project is licensed under the MIT License
