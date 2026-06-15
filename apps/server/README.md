# Meeting Room Booking Server

Express API for the Meeting Room Booking App. It handles authentication, room management, room membership, bookings, permissions, and booking time conflict validation.

## Tech Stack

- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Zod
- Bun

## Architecture

```text
apps/server
├── config             # Environment and Prisma client
├── common             # Errors, middleware, request types, utilities
├── modules
│   ├── auth           # Register, login, current user
│   ├── rooms          # Room CRUD
│   ├── room-members   # Room member management
│   └── bookings       # Booking CRUD, join, cancel
├── routes             # Root API router
├── app.ts             # Express app setup
└── server.ts          # Server startup
```

## Environment

Create `apps/server/.env` from `.env.example`.

```env
DATABASE_URL="postgresql://booking_user:booking_password@localhost:5432/booking_db"
JWT_SECRET="change_me"
JWT_EXPIRES_IN="1d"
PORT=4000
CLIENT_URL="http://localhost:5173"
```

## Prisma Commands

Run these from `apps/server`.

```bash
bunx prisma generate
bunx prisma migrate dev
bunx prisma studio
```

## Scripts

```bash
bun run dev   # Start server in watch mode
bun run build # Type-check with TypeScript
```

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Rooms

- `GET /api/rooms`
- `GET /api/rooms/:id`
- `POST /api/rooms`
- `PATCH /api/rooms/:id`
- `DELETE /api/rooms/:id`

### Room Members

- `GET /api/rooms/:roomId/members`
- `POST /api/rooms/:roomId/members`
- `PATCH /api/rooms/:roomId/members/:memberId`
- `DELETE /api/rooms/:roomId/members/:memberId`

### Bookings

- `GET /api/rooms/:roomId/bookings`
- `POST /api/rooms/:roomId/bookings`
- `PATCH /api/bookings/:bookingId`
- `DELETE /api/bookings/:bookingId`
- `POST /api/bookings/:bookingId/join`

## Validation and Permissions

- Protected routes require `Authorization: Bearer <token>`.
- `ADMIN` room members can update/delete rooms, manage room members, and create/update/cancel bookings.
- `USER` room members can view rooms, view members, view bookings, and join bookings.
- Non-members cannot access room data.
- Zod validates request bodies, params, and query values.
- Booking conflicts are rejected when an active booking overlaps the requested time range.
