<div align="center">
  <img width="1910" height="993" alt="image" src="https://github.com/user-attachments/assets/ac37cecd-2449-44d1-8bda-543d1e5a6e04" />
</div>

# Meeting Room Booking App

Fullstack web application for booking meeting rooms, managing room members, and preventing booking time conflicts.

## Key Features

- Register and login with JWT authorization
- Protected frontend routes
- Meeting rooms CRUD
- Room members by email
- Room roles: `ADMIN` and `USER`
- Bookings create, update, cancel, and join
- Booking time conflict validation
- Availability-style daily bookings list with date filtering
- Form validation and API validation with Zod

## Tech Stack

- Bun workspaces
- React, TypeScript, Vite
- TailwindCSS v4
- TanStack Query
- React Router
- React Hook Form and Zod
- Express and TypeScript
- Prisma ORM
- PostgreSQL
- JWT auth

## Project Structure

```text
.
├── apps
│   ├── client   # React frontend
│   └── server   # Express API
├── docker-compose.yml
├── package.json
└── README.md
```

## Getting Started

1. Clone the repository.

```bash
git clone <repo-url>
cd meeting-room-booking
```

2. Install dependencies.

```bash
bun install
```

3. Start PostgreSQL.

```bash
bun run db:up
```

4. Create environment files.

```bash
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env
```

5. Prepare Prisma from `apps/server`.

```bash
cd apps/server
bunx prisma generate
bunx prisma migrate dev
cd ../..
```

6. Run the app.

```bash
bun run dev
```

The frontend runs on `http://localhost:5173` and the API runs on `http://localhost:4000`.

## Root Scripts

```bash
bun run dev          # Run client and server
bun run dev:client   # Run only the frontend
bun run dev:server   # Run only the backend
bun run build        # Build client and server
bun run build:client # Build only the frontend
bun run build:server # Build only the backend
bun run db:up        # Start PostgreSQL with Docker Compose
bun run db:down      # Stop PostgreSQL
```

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/rooms`
- `GET /api/rooms/:id`
- `POST /api/rooms`
- `PATCH /api/rooms/:id`
- `DELETE /api/rooms/:id`
- `GET /api/rooms/:roomId/members`
- `POST /api/rooms/:roomId/members`
- `PATCH /api/rooms/:roomId/members/:memberId`
- `DELETE /api/rooms/:roomId/members/:memberId`
- `GET /api/rooms/:roomId/bookings`
- `POST /api/rooms/:roomId/bookings`
- `PATCH /api/bookings/:bookingId`
- `DELETE /api/bookings/:bookingId`
- `POST /api/bookings/:bookingId/join`

## Demo Flow

1. Register a new user.
2. Log in and open the rooms page.
3. Create a meeting room.
4. Add another registered user as a room member by email.
5. Create a booking for the room.
6. Try creating another booking with an overlapping time and confirm the conflict error.
7. Log in as a room member and join a booking.
8. Log in as an admin and cancel a booking.
