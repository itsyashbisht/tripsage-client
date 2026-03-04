<div align="center">

# 🧭 TripSage — Frontend

**AI-powered India travel planning — React + Vite SPA**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-EF0073?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

[Features](#-features) · [Quick Start](#-quick-start) · [Pages & Routes](#-pages--routes) · [State Management](#-state-management) · [Design System](#-design-system) · [Deployment](#-deployment)

</div>

---

## 📖 Overview

TripSage's frontend is a **React 19 single-page application** built with Vite. It lets users discover Indian travel destinations through AI-powered natural language search, build full itineraries using Groq AI, and manage saved trips — all wrapped in a polished, animated travel-focused UI.

### Tech Stack at a glance

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Routing | React Router v7 |
| State | Redux Toolkit + Redux Thunk |
| Animations | Framer Motion 12 |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP | Axios (custom instance with interceptors) |
| Fonts | Plus Jakarta Sans · DM Mono (Google Fonts) |
| Styling | Inline styles + CSS-in-JS (no CSS framework) |

---

## ✨ Features

- 🤖 **Groq AI Destination Search** — Natural language queries like *"beach trip in winter"* or *"heritage weekend from Delhi"* return live AI-generated results
- 🗓️ **Full Itinerary Generator** — Claude AI builds day-by-day plans with hotels, restaurants, and attractions
- 🃏 **Interactive Flip Cards** — Top 10 India destinations with 3D flip animation revealing places, tips, and quick-plan CTA
- 🎠 **Auto-Scroll Carousel** — Smooth infinite marquee (requestAnimationFrame, pause on hover)
- 🔐 **Auth Flow** — Register / Login / Profile with JWT, auto-logout on 401
- 💾 **Save & Share** — Bookmark itineraries, generate public share links
- 📊 **Budget Breakdown** — Recharts pie chart showing trip cost distribution
- ✉️ **Welcome Email** — Users receive a branded HTML email on registration (backend-triggered)
- 📱 **Responsive** — All pages adapt from 320px mobile to 4K desktop
- ⚠️ **Error Boundaries** — Per-route error pages with reload and back-home actions
- 🔄 **Redux Persist** — Auth state survives page refresh

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18.x (22.x recommended) |
| npm | ≥ 9.x |
| TripSage Backend | Running on port 5000 |

### 1 — Clone & install

```bash
git clone https://github.com/your-username/tripsage-frontend.git
cd tripsage-frontend
npm install
```

### 2 — Configure environment

```bash
cp .env.example .env
```

```env
# .env
VITE_API_URL=http://localhost:5000
```

> The only required variable is `VITE_API_URL`. It must point to your running TripSage backend.

### 3 — Start development server

```bash
npm run dev
```

App is live at **`http://localhost:5173`** with HMR.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Backend base URL — no trailing slash |

**Development:**
```env
VITE_API_URL=http://localhost:5000
```

**Production:**
```env
VITE_API_URL=https://api.tripsage.app
```

> All `VITE_` variables are inlined at build time by Vite and visible in the browser bundle. Never put secrets here.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Responsive nav with auth-aware user menu
│   └── Footer.jsx              # Site footer with links
│
├── pages/
│   ├── HomePage.jsx            # Hero, featured destinations, how-it-works
│   ├── DestinationsPage.jsx    # AI search + infinite carousel + browse grid
│   ├── HotelsPage.jsx          # Hotel search by destination and tier
│   ├── FoodPage.jsx            # Restaurant discovery with filters
│   ├── PlannerPage.jsx         # Trip configuration form
│   ├── LoadingPage.jsx         # AI generation progress screen
│   ├── ResultsPage.jsx         # Full itinerary with budget breakdown
│   ├── SharedTripPage.jsx      # Public read-only shared itinerary view
│   ├── LoginPage.jsx           # Email + password login
│   ├── RegisterPage.jsx        # Registration with real-time validation
│   ├── ProfilePage.jsx         # User profile + saved itineraries
│   └── AboutPage.jsx           # Product info page
│
├── services/
│   └── api.js                  # Axios instance + all API methods
│
├── store/
│   └── index.js                # Redux store, slices, selectors, thunks
│
├── constants/
│   └── apiEndpoints.js         # All API URL constants + buildUrl helper
│
├── App.jsx                     # Router + route guards + error boundaries
└── main.jsx                    # React root, Redux Provider
```

---

## 🗺️ Pages & Routes

| Route | Page | Auth | Description |
|---|---|---|---|
| `/` | `HomePage` | — | Hero section, top destinations, feature overview |
| `/destinations` | `DestinationsPage` | — | AI search, flip-card top 10, category browse grid |
| `/hotels` | `HotelsPage` | — | Hotel listing with tier and destination filters |
| `/food` | `FoodPage` | — | Restaurant listing with cuisine and price filters |
| `/planner` | `PlannerPage` | — | Trip configuration: destination, dates, budget, style |
| `/loading` | `LoadingPage` | — | AI generation progress (redirects to `/results`) |
| `/results` | `ResultsPage` | — | Full itinerary view with save/share actions |
| `/trip/:token` | `SharedTripPage` | — | Public read-only shared itinerary |
| `/login` | `LoginPage` | — | Login form |
| `/register` | `RegisterPage` | — | Registration form |
| `/profile` | `ProfilePage` | ✅ Required | User profile and saved itineraries |
| `/about` | `AboutPage` | — | Product information |
| `*` | `NotFoundPage` | — | 404 fallback |

---

## 🔄 State Management

Redux Toolkit manages all global state. The store is in `src/store/index.js`.

### Slices

| Slice | State | Key thunks |
|---|---|---|
| `auth` | `user`, `token`, `isAuthenticated`, `loading` | `fetchMe`, `loginUser`, `registerUser`, `logoutUser` |
| `destinations` | `list[]`, `current`, `loading`, `error` | `fetchAllDestinations`, `fetchDestinationBySlug` |
| `hotels` | `list[]`, `loading`, `error` | `fetchHotels`, `fetchHotelById` |
| `restaurants` | `list[]`, `loading`, `error` | `fetchRestaurants` |
| `itineraries` | `list[]`, `current`, `saved[]`, `loading` | `fetchItineraries`, `saveItinerary`, `shareItinerary` |
| `planner` | `form{}`, `result{}`, `generating` | `generateItinerary` |

### Selectors (examples)

```js
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectDestinations,
  selectDestinationLoading,
  selectPlannerForm,
  selectCurrentItinerary,
} from './store';
```

### Typical usage

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllDestinations, selectDestinations } from '../store';

function DestinationsPage() {
  const dispatch = useDispatch();
  const destinations = useSelector(selectDestinations);

  useEffect(() => {
    dispatch(fetchAllDestinations({}));
  }, [dispatch]);
}
```

---

## 🌐 API Client

`src/services/api.js` exports typed method groups for every backend resource.

```js
import { auth, destinations, hotels, restaurants, itineraries, generate, reviews } from '../services/api';
```

### Axios instance features

- `baseURL` set from `VITE_API_URL`
- **Request interceptor** — attaches `Authorization: Bearer <token>` from localStorage
- **Response interceptor** — unwraps `{ success, data, message }` envelope → caller gets `response.data` directly
- **Auto-logout** on `401` — clears token + redirects to `/login`
- Error logging for 403 and 500

### Method reference

```js
// Auth
auth.register({ name, email, password })
auth.login({ email, password })
auth.logout()
auth.me()

// Destinations
destinations.getAll({ category, search, limit, offset })
destinations.getBySlug(slug)
destinations.aiSearch(query)              // Groq AI natural-language search
destinations.getHotels(slug, { tier })
destinations.getRestaurants(slug, params)
destinations.getAttractions(slug)

// Hotels & Restaurants
hotels.getAll(params)
hotels.getById(hotelId)
restaurants.getAll(params)
restaurants.getById(restaurantId)

// Itineraries
itineraries.getAll()
itineraries.getById(itineraryId)
itineraries.getByToken(shareToken)
itineraries.save(itineraryId, note)
itineraries.unsave(itineraryId)
itineraries.share(itineraryId, platform)
itineraries.delete(itineraryId)

// AI Generation
generate.itinerary({ destination, originCity, days, adults, budget, ... })
generate.packages({ days, adults, children, dailyBudget })

// Reviews
reviews.getAll(destinationId)
reviews.add({ destinationId, rating, comment, tripDate })
reviews.remove(reviewId)

// User profile
users.getMe()
users.updateDetails({ name, username })
users.changePassword({ currentPassword, newPassword })
users.getSaved()
users.removeSaved(itineraryId)
```

---

## 🎨 Design System

TripSage uses a consistent design language defined by CSS custom values applied inline.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `SAF` (Saffron) | `#E8650A` | Primary actions, badges, accents |
| `INK` | `#0E0A06` | Primary text, dark backgrounds |
| `WARM_BG` | `#FDFAF7` | Page background |
| `WARM_BORDER` | `#F0EBE5` | Card borders, dividers |
| `MUTED` | `#9CA3AF` | Secondary text, labels |

### Typography

| Font | Role | Weight |
|---|---|---|
| Plus Jakarta Sans | Body, headings, UI | 400 · 600 · 700 · 900 |
| DM Mono | Labels, prices, metadata, badges | 400 · 700 |

Both loaded via Google Fonts in `index.html`.

### Animation Patterns

All animations use Framer Motion.

```js
// Scroll-triggered fade-up (used on all sections)
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1], delay } },
});

// Staggered grid reveal
const gridContainer = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const cardVariant   = { hidden: { opacity: 0, y: 18, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1 } };
```

**Motion patterns used across the app:**
- Page sections reveal on scroll (`useInView`, `once: true`)
- Hero parallax on scroll (`useScroll` + `useTransform`)
- Cards lift on hover (`whileHover: { y: -6 }`)
- Buttons scale on press (`whileTap: { scale: 0.96 }`)
- Route transitions via `AnimatePresence`
- 3D flip cards (CSS `perspective` + `rotateY` via Framer Motion)
- Infinite carousel (`requestAnimationFrame` loop, pause on hover)

---

## 🧩 Key Components

### `Navbar`
Responsive top navigation. Shows auth state — unauthenticated shows Login/Register, authenticated shows user avatar with dropdown (Profile, Logout). Active route is highlighted.

### `DestinationsPage` — `TopCarousel`
An infinite auto-scrolling carousel of 10 flip cards using `requestAnimationFrame` at 0.5px/frame. Duplicates the array for seamless looping. Pauses on mouse enter. Left/right edges fade using a color-matched gradient overlay.

### `FlipCard`
3D CSS flip card with 700ms cubic-bezier animation.
- **Front:** destination photo, rank badge, category pill, tagline, season, "tap to explore" hint
- **Back:** dark card with places-to-visit chips, Must Do block, highlight badge, Best For, Plan Trip CTA

### `DestCard`
Browse-grid and AI-results card with hover lift, category badge, price display, and dual View / Plan CTAs. AI-generated cards show a saffron "AI" badge.

### `ResultsPage`
Full itinerary display with day-by-day accordion, Recharts budget pie chart, hotel/restaurant highlights, save button (auth-gated), and share link generator.

---

## 🛠️ Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint check |

---

## 🚢 Deployment

### Option A — Vercel (recommended, zero config)

```bash
npm install -g vercel
vercel
```

Set `VITE_API_URL` in **Vercel Dashboard → Project → Settings → Environment Variables**.

Add this to `vercel.json` to handle client-side routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Option B — Netlify

```bash
npm run build
# Drag & drop the dist/ folder in Netlify UI
# Or connect GitHub repo
```

Set `VITE_API_URL` in **Site Settings → Environment Variables**.

Create `public/_redirects`:
```
/*  /index.html  200
```

### Option C — Static hosting (Nginx / S3 / Cloudflare Pages)

```bash
npm run build
# Upload dist/ to your host
```

For Nginx, add this to handle React Router:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Production checklist

- [ ] `VITE_API_URL` points to your production backend
- [ ] Backend CORS `FRONTEND_URL` is set to your production domain
- [ ] `npm run build` completes with no errors
- [ ] SPA fallback is configured on host (all routes → `index.html`)
- [ ] HTTPS is active on your domain
- [ ] Google Fonts load correctly (check CSP headers)

---

## 🐛 Common Issues

**API calls fail with CORS error**
→ Ensure `FRONTEND_URL` in the backend `.env` exactly matches your frontend origin (no trailing slash)

**`useSelector` returns `undefined` on refresh**
→ Check that Redux Persist is configured, or that `fetchMe()` is dispatched in `App.jsx` on mount

**Framer Motion animations not playing**
→ Make sure the parent has `initial="hidden"` and the `animate` prop switches to `"show"` when in view

**Images not loading**
→ All images use Unsplash CDN. Check network connectivity. `onError` fallbacks are set on all `<img>` tags.

**AI search returns empty results**
→ Verify the backend is running and `GROQ_API_KEY` is valid. Check browser DevTools → Network for the `POST /destinations/search` response.

---

## 📄 License

MIT © 2026 TripSage
