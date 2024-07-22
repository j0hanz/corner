import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './App.module.css';
import NavBar from './components/NavBar';
import UserPage from './pages/users/UserPage';
import EditProfilePage from './pages/users/EditProfilePage';
import ProfileImageUpload from './pages/users/ProfileImageUpload';
import PostsFeed from './pages/posts/PostsFeed';
import PostCreateForm from './pages/posts/PostCreateForm';
import PostPage from './pages/posts/PostPage';
import { useCurrentUser } from './contexts/CurrentUserContext';

// Placeholder for PostEditForm
const PostEditForm = () => <div>Post Edit Form</div>;

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.pk || '';
  return (
    <div className={styles.App}>
      <NavBar />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<PostsFeed message="No results found." />} />
          <Route path="/users/:id" element={<UserPage />} />
          <Route path="/users/:id/edit" element={<EditProfilePage />} />
          <Route
            path="/users/:id/profile-image"
            element={<ProfileImageUpload />}
          />
          <Route
            path="/liked-posts"
            element={
              <PostsFeed
                message="No posts found."
                filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
              />
            }
          />
          <Route path="/posts/create" element={<PostCreateForm />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route path="/posts/:id/edit" element={<PostEditForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
