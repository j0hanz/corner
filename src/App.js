import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import styles from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import UserPage from './pages/users/UserPage';
import EditProfilePage from './pages/users/EditProfilePage';
import { useCurrentUser } from './contexts/CurrentUserContext';

function App() {
  const currentUser = useCurrentUser();
  return (
    <div className={styles.App}>
      <NavBar />
      <Routes>
        <Route path="/users/:id" element={<UserPage />} />
        <Route
          path="/users/:id/edit"
          element={
            currentUser ? <EditProfilePage /> : <Navigate to="/" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
