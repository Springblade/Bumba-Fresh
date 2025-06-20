# Bumba Fresh - Meal Delivery Service

A modern meal delivery service built with React, Node.js, and PostgreSQL.

## Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- Responsive design with modern UI components

### Backend
- **Node.js 18+** with Express.js
- **PostgreSQL** database with connection pooling
- **JWT authentication** with bcryptjs password hashing
- **JavaScript database utilities** (converted from Java)
- RESTful API design

### Database Layer
The project includes a comprehensive JavaScript database layer (`database/src/`) with the following utilities:
- `AccountCreator` - User account creation and management
- `LoginManager` - Authentication and user verification
- `InventoryManager` - Meal inventory management
- `OrderManager` - Order processing
- `MealOrderManager` - Meal order specifics
- `PlanManager` - Subscription plan management

### Infrastructure
- **Docker** containerization with multi-stage builds
- **Nginx** reverse proxy with SSL support
- **PostgreSQL 15** database
- **Development tools**: Hot reload, linting, testing

## Getting Started

### Development
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Access the application at `http://localhost:5173`

### Backend Development
1. Navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`
4. API available at `http://localhost:8000`

### Database Setup
1. Navigate to database: `cd database`
2. Install dependencies: `npm install`
3. Run database migrations (see `database/init.sql`)

### Docker Deployment
1. Build and run: `docker-compose up --build`
2. Access via `http://localhost`

## Authentication Flow

The authentication system follows a direct backend-to-database pattern:
1. **Frontend** sends credentials to backend API
2. **Backend** validates and forwards request to database layer
3. **Database layer** handles authentication, user creation, and data access
4. **Backend** returns JWT tokens for session management (no Redis cache needed)

## Project Structure

```
├── frontend/              # Frontend React application
├── backend/               # Node.js Express API
│   ├── src/controllers/   # API route handlers
│   ├── src/middleware/    # Authentication & security
│   └── src/routes/        # API route definitions
├── database/              # Database utilities & schema
│   ├── src/               # JavaScript database layer
│   └── init.sql          # Database schema
├── docker/                # Docker configuration
└── nginx/                 # Nginx configuration
```

## Features

- **User Authentication**: Secure registration and login
- **Meal Browsing**: Filter and search meal options
- **Shopping Cart**: Add/remove meals with quantity management
- **Subscription Plans**: Flexible meal delivery subscriptions
- **Order Management**: Track order history and details
- **Responsive Design**: Mobile-first approach
- **Admin Panel**: Meal inventory management

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: PostgreSQL 15 with JavaScript utilities
- **Infrastructure**: Docker, Nginx, SSL Support
- **Development**: Hot reload, ESLint, Prettier
