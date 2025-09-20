# Assessment Management System

A full-stack web application for generating PDF reports from assessment data with user authentication.

## Features

- User registration and login
- Session-based assessment data retrieval
- Configuration-driven PDF report generation
- Support for multiple assessment types
- Responsive UI with Tailwind CSS

## Setup Instructions

### Backend

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
   .env variable (backend)
  NODE_ENV=development
  PORT=5000
  MONGO_URI=your_mongo_uri
  JWT_SECRET=your_jwt_secret_here
  JWT_EXPIRES_IN=7d
5. Start MongoDB service
6. Run the server: `npm run dev`

### Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Usage

1. Register a new account or login with existing credentials
2. Navigate to the Generate Report page
3. Enter a session ID (session_001 or session_002)
4. View the generated report details

## Available Session IDs

- `session_001`: Health & Fitness Assessment (as_hr_02)
- `session_002`: Cardiac Assessment (as_card_01)
