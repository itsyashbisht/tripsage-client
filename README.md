# Tripsage Client

Frontend client for **Tripsage**, an AI-powered travel planning app focused on India.

This project is built with React + Vite and provides the user-facing experience for itinerary generation, destination discovery, saved trips, sharing, and profile flows.

## Overview

Tripsage helps users:
- Generate personalized itineraries
- Explore destinations, hotels, restaurants, and attractions
- Save and share plans
- Manage account/profile details
- Read and post travel reviews

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 4
- Redux Toolkit + React Redux
- React Router 7
- Axios
- React Hook Form + Zod
- Radix UI components

## Project Structure

```text
src/
  components/      Reusable UI components
  constants/       API endpoint constants
  hooks/           Custom hooks
  layouts/         Shared layouts
  pages/           Route pages
  routes/          Route guards/wrappers
  services/        API/service layer (Axios)
  slices/          Redux slices
  store/           Redux store setup
  styles/          Global and theme styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Default local URL: `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

Preview URL defaults to `http://localhost:4173`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

This should point to the Tripsage backend base URL.

## API Contract

Client-side endpoints are defined in:
- `src/constants/apiEndpoints.js`

The app expects backend routes under `/api/v1/...`.

## Notes

- Path alias `@` maps to `src` (configured in `vite.config.js`)
- Vite is configured as an SPA (`appType: 'spa'`) to avoid refresh 404s

## Rename Note

This client is now branded as **Tripsage** (previously Tripwise in some older code/comments).
