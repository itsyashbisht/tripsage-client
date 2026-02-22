import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';
import { selectAuthLoading, selectIsAuthenticated } from '../store';

export default function PrivateRoute ({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();

  // Still rehydrating session — show full-page spinner
  if (loading.me) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          border: '3px solid #F3F4F6', borderTopColor: '#E8650A',
          animation: 'spin 0.85s linear infinite'
        }}/>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace/>;
  }

  return children;
}