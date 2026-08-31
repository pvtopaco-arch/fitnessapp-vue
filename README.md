# FitLog

Fitness workout tracker. Built on top of the Capstone 3 stack (Vue 3 + Vite + Pinia + Bootstrap on the frontend, Express + MongoDB on the backend), using the fitness-api models/routes for auth and workouts.

## Features
- Register / login (JWT)
- Add, edit, delete workouts
- Mark a workout as done / undo
- Dashboard with total / completed / pending counts
- Profile page with basic stats

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in:
   - `MONGODB_STRING` - your MongoDB connection string
   - `JWT_SECRET_KEY` - any random string
   - `VITE_FITLOG_API` - where the API runs (default `http://localhost:4000`)

3. Run the API:
   ```
   npm run server
   ```

4. In another terminal, run the frontend:
   ```
   npm run dev
   ```

## API routes

**Users**
- `POST /users/register`
- `POST /users/login`
- `GET /users/details` (auth required)

**Workouts** (all require auth)
- `POST /workouts/addWorkout`
- `GET /workouts/getMyWorkouts`
- `PATCH /workouts/updateWorkout`
- `DELETE /workouts/deleteWorkout`
- `PATCH /workouts/completeWorkoutStatus`
