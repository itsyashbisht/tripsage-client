# Tripwise Client 🚀

A polished React frontend bootstrapped with Vite. Tripwise is a travel planning web application allowing users to discover destinations, create and save itineraries, and collaborate on shared trips.

This repository holds the client-side code built with React, TailwindCSS, Redux Toolkit, and Vite for fast development and optimized builds.

---

## 🧱 Tech Stack

- **Frontend**: React 19 + JSX
- **Bundler**: Vite 7 with `@vitejs/plugin-react`
- **Styling**: Tailwind CSS 4 & `tailwind-merge`
- **State Management**: Redux Toolkit with slices for auth, destinations, hotels, restaurants, reviews, itineraries, etc.
- **Routing**: React Router v7
- **Forms & Validation**: React Hook Form, Zod, and `@hookform/resolvers`
- **UI Components**: Custom UI primitives built on Radix UI + Headless UI patterns
- **HTTP Client**: Axios (configured in `services/axios.js`)
- **Utilities**: date-fns, framer-motion, recharts, embla-carousel, sonner, and more

---

## 📁 Project Structure

```
src/
  ├─ components/      # Shared UI components and Radix-based primitives
  ├─ constants/       # API endpoint definitions
  ├─ hooks/           # Custom hooks (e.g. use-mobile)
  ├─ layouts/         # AppLayout, etc.
  ├─ pages/           # Route components (Home, Profile, Planner, etc.)
  ├─ routes/          # Private route wrappers
  ├─ services/        # Axios instance and other external integrations
  ├─ slices/          # Redux slices for domain data
  ├─ store/           # Redux store configuration
  └─ styles/          # Tailwind and global styles
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
# clone repo
git clone <repo-url>
cd tripwise-client

# install dependencies
npm install
# or
# yarn
```

### Development

Start the development server with hot reloading:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
npm run build
npm run preview  # serve the production build locally
```

---

## 🛠 Features

- **Authentication** (login/register) using JWTs
- **Destination browsing** with search and filters
- **Hotel and restaurant recommendation pages**
- **Itinerary planner** that lets users add stops, dates, and travel modes
- **Saved plans** and the ability to share itineraries with others
- **Profile management** and review system
- **Responsive design** with mobile-first UI
- **Dark/light theme support** via `next-themes`

---

## ✅ Scripts

| Command            | Description                       |
|-------------------|-----------------------------------|
| `npm run dev`      | Start development server          |
| `npm run build`    | Build for production             |
| `npm run preview`  | Preview production build locally |
| `npm run lint`     | Run ESLint across the project     |

---

## ⚙️ Environment Variables

Copy `.env.example` (if present) to `.env` and configure:

```env
VITE_API_BASE_URL=http://localhost:5000/api
# other vars as needed
```

The client expects the backend REST API to follow endpoints defined in `src/constants/apiEndpoints.js`.

---

## 🙌 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

Please follow existing code style and write descriptive commit messages.

---

## 📄 License

This project is [MIT licensed](LICENSE) (if applicable).

---

## 💡 Notes

- ESLint is configured in `eslint.config.js`.
- Tailwind configuration lives in `tailwind.config.js`.
- The codebase uses TypeScript typings for React components via `@types/react` despite being a `.jsx`/`.tsx` hybrid.


Happy coding! ✈️

