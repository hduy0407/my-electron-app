import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);
  const baseUrl = process.env.REACT_APP_URL_DB || 'http://localhost:8080';

  const checkAndRefresh = async () => {
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken) return setAuthorized(false);

    try {
      const decoded = jwtDecode(accessToken);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp < now) {
        // Token expired — try to refresh
        if (!refreshToken) return setAuthorized(false);

        try {
          const response = await axios.post(`${baseUrl}/api/auth/refresh`, {
            refreshToken,
          });
          console.log('[REFRESH RESPONSE]', response.data);

          const newToken = response.data?.data?.accessToken;
          if (newToken) {
            localStorage.setItem('token', newToken);
            console.log('[TOKEN REFRESHED]', newToken);
            return setAuthorized(true);
          } else {
            return setAuthorized(false);
          }
        } catch (err) {
          console.error('[REFRESH FAILED]', err);
          return setAuthorized(false);
        }
      } else {
        // Token still valid
        return setAuthorized(true);
      }
    } catch (err) {
      console.error('[JWT DECODE FAILED]', err);
      return setAuthorized(false);
    }
  };

  useEffect(() => {
    // Run once immediately
    checkAndRefresh();

    // Set interval to check every 10s
    const intervalId = setInterval(() => {
      checkAndRefresh();
      console.log('[CHECKING AUTHORIZATION]');
    }, 20000); // 10 seconds

    return () => clearInterval(intervalId); // Clean up
  }, []);

  if (authorized === null) return null;
  if (!authorized) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
