import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(null); 

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem('token');
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setIsValid(false);
      }
    };

    checkToken();
  }, []);

  if (isValid === null) {
    return <div>Loading...</div>; // Optional: loading state
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
