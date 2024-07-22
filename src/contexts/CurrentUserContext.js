import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import axios from 'axios';
import { axiosRes, axiosReq } from '../api/axiosDefaults';

export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext(null);

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleMount = useCallback(async () => {
    try {
      const { data } = await axiosRes.get('/dj-rest-auth/user/');
      setCurrentUser(data);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  }, []);

  useEffect(() => {
    handleMount();
  }, [handleMount]);

  const setupInterceptors = useCallback(() => {
    const requestInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        if (!currentUser) return config;
        try {
          await axios.post('/dj-rest-auth/token/refresh/');
        } catch (err) {
          console.error('Error refreshing token on request:', err);
          setCurrentUser(null);
        }
        return config;
      },
      (err) => Promise.reject(err),
    );

    const responseInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401 && currentUser) {
          try {
            await axios.post('/dj-rest-auth/token/refresh/');
            return axios(err.config);
          } catch (error) {
            console.error('Error refreshing token on response:', error);
            setCurrentUser(null);
          }
        }
        return Promise.reject(err);
      },
    );

    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, [currentUser]);

  useEffect(() => {
    const cleanupInterceptors = setupInterceptors();
    return cleanupInterceptors;
  }, [setupInterceptors]);

  const contextValue = useMemo(() => currentUser, [currentUser]);
  const setContextValue = useMemo(() => setCurrentUser, []);

  return (
    <CurrentUserContext.Provider value={contextValue}>
      <SetCurrentUserContext.Provider value={setContextValue}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
