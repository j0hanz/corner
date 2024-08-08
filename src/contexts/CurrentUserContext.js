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

// Create contexts for current user and setter function
export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext(null);

// Custom hooks to use the current user and setter function
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch the current user from the API
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await axiosRes.get('/dj-rest-auth/user/');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, []);

  // Fetch the current user when the component mounts
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Setup interceptors for axios requests and responses
  const setupInterceptors = useCallback(() => {
    const requestInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        if (currentUser) {
          try {
            await axios.post('/dj-rest-auth/token/refresh/');
          } catch (error) {
            console.error('Error refreshing token on request:', error);
            setCurrentUser(null);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && currentUser && error.config) {
          try {
            await axios.post('/dj-rest-auth/token/refresh/');
            return axios(error.config);
          } catch (error) {
            console.error('Error refreshing token on response:', error);
            setCurrentUser(null);
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup function to eject interceptors
    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, [currentUser]);

  // Setup interceptors when the component mounts
  useEffect(() => {
    const cleanupInterceptors = setupInterceptors();
    return cleanupInterceptors;
  }, [setupInterceptors]);

  // Memoize context values to avoid unnecessary re-renders
  const contextValue = useMemo(() => currentUser, [currentUser]);
  const setContextValue = useMemo(() => setCurrentUser, []);

  return (
    <CurrentUserContext.Provider value={contextValue}>
      {contextValue === null ? null : (
        <SetCurrentUserContext.Provider value={setContextValue}>
          {children}
        </SetCurrentUserContext.Provider>
      )}
    </CurrentUserContext.Provider>
  );
};
