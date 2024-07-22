import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Form,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
} from 'react-bootstrap';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import styles from './styles/EditProfilePage.module.css';

const EditProfilePage = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    url_link: '',
    contact_email: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id?.toString() !== id) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/users/${id}/`);
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
      formData.append(key, value);
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
    } catch (error) {
      setErrors(error.response?.data || {});
    }
  };

  if (loading) {
    return (
      <Container className={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const textFields = (
    <div>
      <Form.Group controlId="formFirstName" className="mb-3">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="First Name"
          name="first_name"
          value={profileData.first_name}
          onChange={handleChange}
          className={styles.FormControl}
        />
        {errors?.first_name?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group controlId="formLastName" className="mb-3">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Last Name"
          name="last_name"
          value={profileData.last_name}
          onChange={handleChange}
          className={styles.FormControl}
        />
        {errors?.last_name?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group controlId="formBio" className="mb-3">
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          placeholder="Bio"
          name="bio"
          value={profileData.bio}
          onChange={handleChange}
          className={styles.FormControl}
        />
        {errors?.bio?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group controlId="formLocation" className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          placeholder="Location"
          name="location"
          value={profileData.location}
          onChange={handleChange}
          className={styles.FormControl}
        />
        {errors?.location?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group controlId="formUrlLink" className="mb-3">
        <Form.Label>URL Link</Form.Label>
        <Form.Control
          type="text"
          placeholder="URL Link"
          name="url_link"
          value={profileData.url_link}
          onChange={handleChange}
          className={styles.FormControl}
        />
        {errors?.url_link?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group controlId="formContactEmail" className="mb-3">
        <Form.Label>Contact Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Contact Email"
          name="contact_email"
          value={profileData.contact_email}
          onChange={handleChange}
          className={styles.FormControl}
        />
        {errors?.contact_email?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <div className={styles.buttonWrapper}>
        <Button
          variant="outline-secondary"
          onClick={() => navigate(`/users/${id}/`)}
          className="mx-3 btn-lg"
        >
          Cancel
        </Button>
        <Button variant="outline-primary" className="mx-3 btn-lg" type="submit">
          Save Changes
        </Button>
      </div>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Container className={styles.Container}>
        <Row>
          <Col md={12} lg={12}>
            {textFields}
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default EditProfilePage;
