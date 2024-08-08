import React from 'react';
import './api/axiosDefaults';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './App.module.css';
import NavBar from './components/NavBar';
import UserPage from './pages/users/UserPage';
import PostsFeed from './pages/posts/PostsFeed';
import { useCurrentUser } from './contexts/CurrentUserContext';
import NotFound from './components/NotFound';

const App = () => {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id;

  return (
    <div className={styles.App}>
      <NavBar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<PostsFeed message="No results found." />} />
          <Route path="/users/:id" element={<UserPage />} />
          <Route
            path="/liked-posts"
            element={
              currentUser ? (
                <PostsFeed
                  message="No posts found."
                  filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
                />
              ) : (
                <NotFound />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
