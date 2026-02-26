import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
  useRouteError,
} from "react-router";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import store, { fetchMe } from "./store";
import PrivateRoute from "./routes/privateRoutes.jsx";

// Pages
import HomePage from "./pages/Home.jsx";
import DestinationsPage from "./pages/DestinationPage.jsx";
import HotelsPage from "./pages/HotelsPage.jsx";
import FoodPage from "./pages/FoodPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import PlannerPage from "./pages/PlannerPage.jsx";
import LoadingPage from "./pages/LoadingPage.jsx";
import ResultsPage from "./pages/ResultPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SharedTripPage from "./pages/SharedTripPage.jsx";
import { getToken } from "@/services/axios.js";

// ── Root Layout (runs once)
function RootLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (getToken()) dispatch(fetchMe());
  }, [dispatch]);

  return <Outlet />;
}

// FONTS
const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const FM = "'DM Mono', monospace";
const SAF = "#E8650A";

// Route Error
function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const message = error?.message || "Something went wrong.";
  const isDataError =
    message.includes("is not a function") || message.includes("Cannot read");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FM,
        background: "#FDFAF7",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          marginBottom: 28,
          background: `linear-gradient(135deg, ${SAF}22, ${SAF}08)`,
          border: `1.5px solid ${SAF}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
        }}
      >
        ⚠️
      </div>

      <h1
        style={{
          fontWeight: 900,
          fontSize: "clamp(1.4rem,4vw,2rem)",
          color: "#111",
          margin: "0 0 12px",
          letterSpacing: "-0.02em",
        }}
      >
        Something went wrong
      </h1>

      <p
        style={{
          color: "#6B7280",
          fontSize: 15,
          maxWidth: 440,
          lineHeight: 1.7,
          margin: "0 0 28px",
        }}
      >
        {isDataError
          ? "We had trouble loading the page data. Try refreshing."
          : "An unexpected error occurred."}
      </p>

      {message && (
        <details
          style={{
            maxWidth: 520,
            width: "100%",
            marginBottom: 28,
            background: "#F5F0EB",
            border: "1px solid #EDE7DE",
            borderRadius: 14,
            padding: "14px 18px",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <summary
            style={{
              fontFamily: FM,
              fontSize: 12,
              color: "#9CA3AF",
              letterSpacing: "0.06em",
              userSelect: "none",
            }}
          >
            Error details
          </summary>
          <p
            style={{
              fontFamily: FM,
              fontSize: 12,
              color: "#EF4444",
              margin: "12px 0 0",
              lineHeight: 1.7,
              wordBreak: "break-word",
            }}
          >
            {message}
          </p>
        </details>
      )}

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => window.location.reload()}
          style={{
            background: SAF,
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "12px 28px",
            fontFamily: F,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: `0 6px 22px ${SAF}40`,
          }}
        >
          ↺ Reload Page
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#fff",
            color: "#374151",
            border: "1.5px solid #EDE7DE",
            borderRadius: 999,
            padding: "12px 28px",
            fontFamily: F,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

// 404 NOT FOUND
function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: F,
        background: "#FDFAF7",
        gap: 16,
        padding: "24px",
      }}
    >
      <p
        style={{
          fontFamily: FM,
          fontSize: 72,
          fontWeight: 900,
          color: "#111",
          lineHeight: 1,
          margin: 0,
        }}
      >
        404
      </p>
      <p style={{ fontSize: 17, color: "#6B7280", margin: 0 }}>
        This page doesn't exist.
      </p>
      <a
        href="/"
        style={{
          background: SAF,
          color: "#fff",
          borderRadius: 999,
          padding: "13px 32px",
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
          boxShadow: `0 4px 18px ${SAF}35`,
          marginTop: 8,
        }}
      >
        Back to Home
      </a>
    </div>
  );
}

// ── Router
const ROUTER = createBrowserRouter([
  {
    element: <RootLayout />, // runs once for all routes
    errorElement: <RouteErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/destinations", element: <DestinationsPage /> },
      { path: "/hotels", element: <HotelsPage /> },
      { path: "/food", element: <FoodPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/planner", element: <PlannerPage /> },
      { path: "/loading", element: <LoadingPage /> },
      { path: "/results", element: <ResultsPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/trip/:token", element: <SharedTripPage /> },

      // Protected route
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },

  // 404 fallback
  {
    path: "*",
    element: (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      >
        <h1>404 - Page Not Found</h1>
      </div>
    ),
  },
]);

// ── App ───────────────────────────────────────────────────────
function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={ROUTER} />
    </Provider>
  );
}

export default App;
