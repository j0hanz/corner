import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './App.module.css';
import NavBar from './components/NavBar';
import UserPage from './pages/users/UserPage';
import EditProfilePage from './pages/users/EditProfilePage';

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <main className={styles.main}>
        <Routes>
          <Route path="/users/:id" element={<UserPage />} />
          <Route path="/users/:id/edit" element={<EditProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
