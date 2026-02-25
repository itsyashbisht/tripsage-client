import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import { Provider, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import store, { fetchMe } from './store';
import PrivateRoute from './routes/privateRoutes.jsx';

// Pages
import HomePage from './pages/Home.jsx';
import DestinationsPage from './pages/DestinationPage.jsx';
import HotelsPage from './pages/HotelsPage.jsx';
import FoodPage from './pages/FoodPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import PlannerPage from './pages/PlannerPage.jsx';
import LoadingPage from './pages/LoadingPage.jsx';
import ResultsPage from './pages/ResultPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SharedTripPage from './pages/SharedTripPage.jsx';
import { getToken } from '@/services/axios.js';

// ── Root Layout (runs once)
function RootLayout () {
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (getToken())
      dispatch(fetchMe());
  }, [dispatch]);
  
  return <Outlet/>;
}

// ── Router
const ROUTER = createBrowserRouter([
  {
    element: <RootLayout/>, // runs once for all routes
    children: [
      { path: '/', element: <HomePage/> },
      { path: '/destinations', element: <DestinationsPage/> },
      { path: '/hotels', element: <HotelsPage/> },
      { path: '/food', element: <FoodPage/> },
      { path: '/about', element: <AboutPage/> },
      { path: '/planner', element: <PlannerPage/> },
      { path: '/loading', element: <LoadingPage/> },
      { path: '/results', element: <ResultsPage/> },
      { path: '/login', element: <LoginPage/> },
      { path: '/register', element: <RegisterPage/> },
      { path: '/trip/:token', element: <SharedTripPage/> },
      
      // Protected route
      {
        path: '/profile',
        element: (
          <PrivateRoute>
            <ProfilePage/>
          </PrivateRoute>
        ),
      },
    ],
  },
  
  // 404 fallback
  {
    path: '*',
    element: (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '\'Plus Jakarta Sans\', system-ui, sans-serif'
      }}>
        <h1>404 - Page Not Found</h1>
      </div>
    ),
  },
]);

// ── App ───────────────────────────────────────────────────────
function App () {
  return (
    <Provider store={store}>
      <RouterProvider router={ROUTER}/>
    </Provider>
  );
}

export default App;