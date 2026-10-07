# GymTrack

GymTrack is a full-stack web application for managing gym workouts, creating reusable routines, tracking training sessions and visualizing exercise progress.

The project was built as a personal learning project to strengthen my knowledge of full-stack development, REST APIs, relational databases, testing and deployment.

## Live Demo

- Frontend: `https://gymtrack-vr5p.onrender.com/`
- API: `https://gymtrack-api-8efi.onrender.com/api/health`

> The backend is hosted on a free Render instance, so the first request after a period of inactivity may take a few seconds.

![GymTrack Routines](image.png)
![GymTrack Exercises](image-2.png)
![GymTrack Saved Sesion](image-3.png)

## Features

### Exercise management
- Browse a predefined GymTrack exercise catalogue
- Create custom exercises
- Search exercises by name
- Filter exercises by muscle group
- Edit and delete custom exercises
- Protect system exercises from modification or deletion

### Routines
- Create reusable workout routines
- Add and remove exercises directly from the routine editor
- Edit routine information and exercises in a single flow
- Start a workout directly from a routine
- Transactional routine creation and updates

### Live workouts
- Start free workouts or workouts based on routines
- Only one workout can remain active at a time
- Add and remove exercises during an active session
- Register sets, repetitions and weight
- Edit or delete sets while the workout is active
- Persistent workout timer
- Complete workouts and keep them read-only afterwards

### Performance insights
- Previous performance for each exercise
- Total workout volume
- Per-exercise volume
- Workout duration
- Personal record detection
- Estimated 1RM comparisons

### Progress
- Exercise-specific progress tracking
- Total workouts and sets
- Best weight
- Best repetition count
- Weight progression chart
- Full workout history

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Recharts

### Backend
- Node.js
- Express
- TypeScript
- REST API

### Database
- PostgreSQL
- Relational data modelling
- SQL migrations
- Transactions

### Testing
- Vitest
- Supertest
- Dedicated PostgreSQL test database
- Integration tests for API and database behaviour

### Infrastructure
- Docker for local PostgreSQL
- Neon PostgreSQL for production
- Render for frontend and backend deployment
- Git and GitHub

## Testing

The backend includes integration tests covering the main application behaviour.

Current test coverage includes:

- API health checks
- Test database isolation
- Routine creation, editing and deletion
- Transaction rollback behaviour
- Custom exercise CRUD
- System exercise protection
- Active workout restrictions
- Workout creation from routines
- Workout completion
- Completed workout protection
- Progress calculations
- Exercise history ordering

Run the tests with:

```bash
cd backend
npm test