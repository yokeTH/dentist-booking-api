# Dentist Booking Backend API

A backend API for a dentist booking system built with TypeScript, Express, MongoDB/Mongoose, and documented with Swagger.

## Features

- User registration and authentication
- Dentist booking management
- Admin functionality
- Waitlist management
- API documentation with Swagger

## Requirements

- Node.js (v14+)
- MongoDB

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and set your environment variables
4. Build the project:
   ```
   npm run build
   ```

## Running the Application

### Development mode
```
npm run dev
```

### Production mode
```
npm start
```

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## Seeding Data

Optional: To seed the database with initial data:
```
ts-node src/utils/seeder.ts
```

To clear all data:
```
ts-node src/utils/seeder.ts -d
```
