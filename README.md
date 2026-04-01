# VidSense Frontend

> Modern React application for uploading, processing, and streaming videos with real-time sensitivity analysis.

**Live App:** [https://assignment.koushikpanda.online](https://assignment.koushikpanda.online)
**Backend Repo:** [assingment-backend](https://github.com/KoushikPanda1729/assingment-backend)

---

## Demo Credentials

| Role   | Email                  | Password      |
| ------ | ---------------------- | ------------- |
| Admin  | koushikpanda@gmail.com | Panda@1111111 |
| Editor | johndoe@gmail.com      | Panda@1111111 |
| Viewer | koushik@gmail.com      | Panda@1111111 |

---

## Tech Stack

| Layer            | Technology                        |
| ---------------- | --------------------------------- |
| Build Tool       | Vite 8                            |
| Framework        | React 19                          |
| Language         | TypeScript 5                      |
| State Management | Redux Toolkit                     |
| Routing          | React Router v7                   |
| Styling          | Tailwind CSS v4                   |
| HTTP Client      | Axios                             |
| Real-Time        | Socket.io Client                  |
| File Upload      | React Dropzone                    |
| Icons            | Lucide React                      |
| Testing          | Vitest + React Testing Library    |
| Linting          | ESLint + Prettier + Husky         |
| Containerization | Docker + nginx                    |
| CI/CD            | GitHub Actions → Docker Hub → EC2 |

---

## Features

- **Authentication** — JWT-based login, registration, and Google OAuth 2.0
- **Role-Based UI** — Interface adapts based on user role (Admin / Editor / Viewer)
- **Drag-and-Drop Upload** — React Dropzone with real-time upload progress bar
- **Real-Time Processing** — Socket.io shows live sensitivity analysis progress
- **Video Library** — Filterable list of videos with status badges (pending / processing / safe / flagged)
- **Integrated Player** — In-app video streaming with HTTP range request support
- **Admin Dashboard** — User management panel for admins (view, assign roles, delete users)
- **Responsive Design** — Fully mobile-friendly layout with Tailwind CSS
- **Protected Routes** — Role-aware route guards block unauthorized access

---

## Project Structure

```
src/
├── __tests__/       # Vitest unit and component tests
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI components
├── config/          # Axios instance, environment config
├── constants/       # App-wide constants
├── hooks/           # Custom React hooks
├── mocks/           # Mock data for development/testing
├── pages/           # Route-level page components
│   ├── Auth/        # Login, Register pages
│   ├── Dashboard/   # Main video dashboard
│   ├── Upload/      # Video upload page
│   ├── Player/      # Video streaming player
│   └── Admin/       # Admin user management
├── routes/          # React Router config + ProtectedRoute
├── services/        # API service functions (auth, video)
├── store/           # Redux store, slices, thunks
├── styles/          # Global styles
├── types/           # TypeScript interfaces
├── App.tsx          # Root component
└── main.tsx         # Entry point
```

---

## Pages & Roles

| Page           | Admin | Editor | Viewer |
| -------------- | ----- | ------ | ------ |
| Login/Register | ✅    | ✅     | ✅     |
| Dashboard      | ✅    | ✅     | ✅     |
| Upload Video   | ✅    | ✅     | ❌     |
| Video Player   | ✅    | ✅     | ✅     |
| Admin Panel    | ✅    | ❌     | ❌     |

---

## User Journey

```
Register / Login (or Google OAuth)
        ↓
    Dashboard — view all your videos with live status
        ↓
  Upload Page — drag & drop video, watch upload progress
        ↓
  Processing — real-time Socket.io updates (pending → processing → safe/flagged)
        ↓
  Video Player — stream the processed video directly in the browser
        ↓
  Admin Panel — (admin only) manage users and assign roles
```

---

## Local Setup

### Prerequisites

- Node.js 24+
- Backend running locally or accessible remotely

### Steps

```bash
# Clone the repo
git clone https://github.com/KoushikPanda1729/assingment-frontend.git
cd assingment-frontend

# Install dependencies
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env
```

### Environment Variables

```env
VITE_API_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
VITE_APP_NAME=VidSense
```

### Run

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Tests use Vitest + React Testing Library and cover:

- Redux store slices (auth, videos)
- Protected route access control
- Core component rendering

---

## Docker

```bash
# Build image (VITE vars must be passed at build time)
docker build \
  --build-arg VITE_API_URL=https://assignmentbackend.koushikpanda.online \
  --build-arg VITE_SOCKET_URL=https://assignmentbackend.koushikpanda.online \
  --build-arg VITE_APP_NAME=VidSense \
  -t vidsense-frontend .

# Run container
docker run -d \
  --name frontend \
  -p 3000:80 \
  vidsense-frontend
```

> Note: VITE environment variables are baked into the static build at Docker build time. They must be passed as `--build-arg`, not at runtime.

---

## CI/CD Pipeline

Every push to `main` triggers:

1. **Lint** — ESLint code quality check
2. **Format** — Prettier formatting check
3. **Test** — Vitest test suite
4. **Build** — TypeScript + Vite production build
5. **Docker Build & Push** — Image (with VITE vars baked in) pushed to Docker Hub (`panda747767328/vidsense-frontend`)
6. **Deploy** — SSH into EC2, pull latest image, restart container

---

## Deployment Architecture

```
GitHub → GitHub Actions → Docker Hub
                                ↓
                           AWS EC2
                         (ubuntu host)
                                ↓
                    nginx (reverse proxy + SSL)
                                ↓
                    Docker container :3000
                           (nginx:alpine)
                           serving /dist
```

SSL certificates managed by Let's Encrypt via Certbot.

---

## nginx Configuration

The Docker image uses `nginx:alpine` to serve the React SPA. The `nginx.conf` includes:

```nginx
try_files $uri $uri/ /index.html;
```

This enables client-side routing — all routes correctly resolve to `index.html` and React Router handles navigation.

---

## Code Quality

- **ESLint** — React + TypeScript aware linting rules
- **Prettier** — Consistent code formatting
- **Husky** — Pre-commit hooks enforce lint + format
- **lint-staged** — Only processes changed files
- **Vitest** — Fast, Vite-native test runner
- **React Testing Library** — Component and integration tests
