import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
import styles from './styles/EditProfilePage.module.css';

const initialProfileState = {
  first_name: '',
  last_name: '',
  bio: '',
  favorite_movie_genre: null,
  favorite_music_genre: null,
  favorite_sport: null,
  location: '',
  url_link: '',
  contact_email: '',
  image: null,
};

const EditProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(initialProfileState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [movieGenres, setMovieGenres] = useState([]);
  const [musicGenres, setMusicGenres] = useState([]);
  const [sports, setSports] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChoices = async () => {
      try {
        const [movieGenresRes, musicGenresRes, sportsRes] = await Promise.all([
          axios.get('/users/favorite-movie-genres/'),
          axios.get('/users/favorite-music-genres/'),
          axios.get('/users/favorite-sports/'),
        ]);
        setMovieGenres(movieGenresRes.data);
        setMusicGenres(musicGenresRes.data);
        setSports(sportsRes.data);
      } catch (err) {
        console.error('Error fetching choices:', err);
      }
    };

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/users/${id}/`);
        setProfile(data);
        setImagePreview(data.image);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChoices();
      fetchProfile();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: { id: value },
    }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        image: files[0],
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(profile).forEach((key) => {
      if (profile[key] && typeof profile[key] === 'object' && profile[key].id) {
        formData.append(key, profile[key].id);
      } else {
        formData.append(key, profile[key]);
      }
    });

    try {
      await axios.put(`/users/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/users/${id}/`);
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrors(err.response?.data || {});
    }
  };

  const renderFormGroup = (controlId, label, type = 'text', as = 'input') => {
    const field = controlId.replace('form', '').toLowerCase();
    return (
      <Form.Group controlId={controlId} key={controlId}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={type}
          as={as}
          name={field}
          value={profile[field] || ''}
          onChange={handleChange}
          isInvalid={!!errors[field]}
        />
        <Form.Control.Feedback type="invalid">
          {errors[field]}
        </Form.Control.Feedback>
      </Form.Group>
    );
  };

  const renderSelectGroup = (controlId, label, options, valueKey) => {
    const field = controlId.replace('form', '').toLowerCase();
    return (
      <Form.Group controlId={controlId} key={controlId}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          as="select"
          name={field}
          value={profile[field]?.id || ''}
          onChange={handleSelectChange}
          isInvalid={!!errors[field]}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option[valueKey]}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors[field]}
        </Form.Control.Feedback>
      </Form.Group>
    );
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
      {Object.keys(errors).length > 0 && (
        <Alert variant="danger">
          <ul>
            {Object.keys(errors).map((error) => (
              <li key={error}>{errors[error]}</li>
            ))}
          </ul>
        </Alert>
      )}
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        {renderFormGroup('formFirstName', 'First Name')}
        {renderFormGroup('formLastName', 'Last Name')}
        {renderFormGroup('formBio', 'Bio', 'textarea')}
        {renderSelectGroup(
          'formFavoriteMovieGenre',
          'Favorite Movie Genre',
          movieGenres,
          'genre',
        )}
        {renderSelectGroup(
          'formFavoriteMusicGenre',
          'Favorite Music Genre',
          musicGenres,
          'genre',
        )}
        {renderSelectGroup(
          'formFavoriteSport',
          'Favorite Sport',
          sports,
          'sport',
        )}
        {renderFormGroup('formLocation', 'Location')}
        {renderFormGroup('formUrlLink', 'URL Link')}
        {renderFormGroup('formContactEmail', 'Contact Email', 'email')}
        <Form.Group controlId="formImage">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control type="file" name="image" onChange={handleImageChange} />
          {imagePreview && (
            <div className="mt-3">
              <img src={imagePreview} alt="Profile preview" width="100" />
            </div>
          )}
        </Form.Group>
        <Button type="submit" className="mt-3">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default EditProfilePage;
