import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom hook to handle user redirection based on authentication status
export const useRedirect = (userAuthStatus) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMount = async () => {
      try {
        // Attempt to refresh the authentication token
        await axios.post('/dj-rest-auth/token/refresh/');
        // If the user is logged out, redirect to the home page
        if (userAuthStatus === 'loggedOut') {
          navigate('/');
        }
      } catch (err) {
        // If there is an error refreshing the token and the user is logged in, redirect to the home page
        if (userAuthStatus === 'loggedIn') {
          navigate('/');
        }
      }
    };

    // Call the handleMount function when the component mounts
    handleMount();
  }, [navigate, userAuthStatus]);
};
