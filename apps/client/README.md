# Meeting Room Booking Client

React frontend for the Meeting Room Booking App. It provides authentication screens, protected routes, rooms management, room members management, and a simple bookings availability view.

## Tech Stack

- React
- TypeScript
- Vite
- TailwindCSS v4
- TanStack Query
- React Router
- Axios
- React Hook Form
- Zod

## Architecture

```text
src
├── app      # Providers, router, global styles
├── pages    # Route-level pages
├── features # Auth, rooms, room members, bookings UI/API/model code
└── shared   # Shared API client, types, and UI components
```

The structure follows a lightweight Feature-Sliced Design style without adding extra layers where they are not needed.

## Environment

Create `apps/client/.env` from `.env.example`.

```env
VITE_API_URL="http://localhost:4000/api"
```

## Scripts

```bash
bun run dev     # Start Vite dev server
bun run build   # Type-check and build production assets
bun run lint    # Run ESLint
bun run preview # Preview production build
```

## Run Client

From `apps/client`:

```bash
bun run dev
```

Or from the repository root:

```bash
bun run dev:client
```

## Main UI Features

- Login and register pages
- Token-based protected routes
- Rooms list with create, edit, delete, and open actions
- Room details page
- Room members panel with add, role update, and remove actions for admins
- Booking form and daily bookings list
- Join booking action for users
- Validation, loading, error, and empty states
