import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import styles from './styles/EditProfilePage.module.css';

const EditProfilePage = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const imageFile = useRef();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    favorite_movie_genre: '',
    favorite_music_genre: '',
    favorite_sport: '',
    location: '',
    url_link: '',
    contact_email: '',
    image: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser?.id?.toString() === id) {
        try {
          const { data } = await axios.get(`/users/${id}/`);
          const { first_name, last_name, bio, location, url_link, contact_email, image, favorite_movie_genre, favorite_music_genre, favorite_sport  } = data;
          setProfileData({
            first_name,
            last_name,
            bio,
            favorite_movie_genre: favorite_movie_genre.id || '',
            favorite_music_genre: favorite_music_genre.id || '',
            favorite_sport: favorite_sport.id || '',
            location,
            url_link,
            contact_email,
            image,
          });
          setImagePreview(data.image);
        } catch (err) {
          console.error('Error fetching profile:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, id]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setProfileData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      formData.append(key, profileData[key]);
    });

    try {
      const { data } = await axios.put(`/users/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        profile_image: data.image,
      }));
      navigate(`/users/${id}/`);
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className={styles.EditProfilePage}>
      <h2>Edit Profile</h2>
      {errors.detail && <Alert variant="danger">{errors.detail}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={profileData.first_name}
            onChange={handleChange}
            isInvalid={!!errors.first_name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.first_name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={profileData.last_name}
            onChange={handleChange}
            isInvalid={!!errors.last_name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.last_name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBio">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            rows={3}
            isInvalid={!!errors.bio}
          />
          <Form.Control.Feedback type="invalid">
            {errors.bio}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formFavoriteMovieGenre">
          <Form.Label>Favorite Movie Genre</Form.Label>
          <Form.Control
            as="select"
            name="favorite_movie_genre"
            value={profileData.favorite_movie_genre}
            onChange={handleChange}
            isInvalid={!!errors.favorite_movie_genre}
          >
            <option value="">Select Movie Genre</option>
            {/* Populate with options */}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.favorite_movie_genre}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formFavoriteMusicGenre">
          <Form.Label>Favorite Music Genre</Form.Label>
          <Form.Control
            as="select"
            name="favorite_music_genre"
            value={profileData.favorite_music_genre}
            onChange={handleChange}
            isInvalid={!!errors.favorite_music_genre}
          >
            <option value="">Select Music Genre</option>
            {/* Populate with options */}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.favorite_music_genre}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formFavoriteSport">
          <Form.Label>Favorite Sport</Form.Label>
          <Form.Control
            as="select"
            name="favorite_sport"
            value={profileData.favorite_sport}
            onChange={handleChange}
            isInvalid={!!errors.favorite_sport}
          >
            <option value="">Select Sport</option>
            {/* Populate with options */}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.favorite_sport}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLocation">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={profileData.location}
            onChange={handleChange}
            isInvalid={!!errors.location}
          />
          <Form.Control.Feedback type="invalid">
            {errors.location}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formUrlLink">
          <Form.Label>URL Link</Form.Label>
          <Form.Control
            type="text"
            name="url_link"
            value={profileData.url_link}
            onChange={handleChange}
            isInvalid={!!errors.url_link}
          />
          <Form.Control.Feedback type="invalid">
            {errors.url_link}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formContactEmail">
          <Form.Label>Contact Email</Form.Label>
          <Form.Control
            type="email"
            name="contact_email"
            value={profileData.contact_email}
            onChange={handleChange}
            isInvalid={!!errors.contact_email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.contact_email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formImage">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            ref={imageFile}
            onChange={handleImageChange}
            isInvalid={!!errors.image}
          />
          <Form.Control.Feedback type="invalid">
            {errors.image}
          </Form.Control.Feedback>
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Profile Preview"
                className={styles.ProfileImagePreview}
              />
            </div>
          )}
        </Form.Group>

        <Button type="submit" className="mt-3">
          Save Changes
        </Button>
        <Button
          variant="secondary"
          className="mt-3 ms-2"
          onClick={() => navigate(`/users/${id}/`)}
        >
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default EditProfilePage;
