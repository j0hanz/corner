import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Form,
  Alert,
  Container,
  Spinner,
} from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import styles from './styles/EditProfilePage.module.css';

const EditProfileModal = ({ show, handleClose }) => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
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
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    try {
      const { data } = await axios.put(`/users/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        profile_image: data.image,
      }));
      handleClose();
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

  return (
    <Modal show={show} onHide={handleClose} centered className="text-light">
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-light"
      >
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light p-0">
        <Form onSubmit={handleSubmit}>
          <Container className={styles.Container}>
            {Object.entries(profileData).map(([field, value]) => (
              <Form.Group
                controlId={`form${field}`}
                className="mb-3"
                key={field}
              >
                <Form.Label>{field.replace('_', ' ')}</Form.Label>
                <Form.Control
                  type={field.includes('email') ? 'email' : 'text'}
                  as={field === 'bio' ? 'textarea' : 'input'}
                  rows={field === 'bio' ? 6 : undefined}
                  placeholder={field.replace('_', ' ')}
                  name={field}
                  value={value}
                  onChange={handleChange}
                  className="bg-dark text-light"
                />
                {errors?.[field]?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
                ))}
              </Form.Group>
            ))}
            <div className={styles.buttonWrapper}>
              <Button
                variant="outline-primary"
                className={styles.leftButton}
                type="submit"
              >
                Save Changes
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleClose}
                className={styles.rightButton}
              >
                Cancel
              </Button>
            </div>
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
