# EnhanceAI

AI-powered image enhancement application. Upscale, restore, and enhance any image with state-of-the-art AI.

## Features

- **Multiple Enhancement Types**: Upscale (2×/4×), face restore, denoise, color correct, old photo restore, sharpen, prompt-based enhance
- **Credit System**: Free tier with 5 daily credits, Pro and Enterprise plans available
- **Admin Panel**: User management, analytics, and processing logs
- **Dark/Light Theme**: Full theme support with premium glassmorphism design

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `""` (same origin) |

## Build

```bash
npm run build
```

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **UI**: Radix UI, Framer Motion, Recharts
- **State**: TanStack React Query
- **Routing**: React Router v6
