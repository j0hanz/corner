import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useRedirect = (userAuthStatus) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post('/dj-rest-auth/token/refresh/');
        if (userAuthStatus === 'loggedOut') {
          navigate('/');
        }
      } catch (err) {
        if (userAuthStatus === 'loggedIn') {
          navigate('/');
        }
      }
    };

    handleMount();
  }, [navigate, userAuthStatus]);
};
