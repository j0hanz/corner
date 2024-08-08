import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Button,
  Form,
  Alert,
  Container,
  Spinner,
} from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import { useParams } from 'react-router-dom';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import styles from './styles/EditProfilePage.module.css';

const EditProfileModal = ({ show, handleClose }) => {
  const { id } = useParams(); // Get the user ID from the URL parameters
  const currentUser = useCurrentUser(); // Get the current user from context
  const setCurrentUser = useSetCurrentUser(); // Function to update the current user in context

  // Initial profile data structure
  const initialProfileData = {
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    url_link: '',
    contact_email: '',
  };

  // State to manage profile data, errors, and loading state
  const [profileData, setProfileData] = useState(initialProfileData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch profile data when the component mounts or when the user ID changes
  const fetchProfile = useCallback(async () => {
    if (currentUser?.profile_id?.toString() !== id) {
      return;
    }

    try {
      const { data } = await axiosReq.get(`/users/${id}/`);
      setProfileData({
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio,
        location: data.location,
        url_link: data.url_link,
        contact_email: data.contact_email,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [currentUser, id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle input changes and update the state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for editing the profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      setLoading(true);
      const { data } = await axiosReq.put(`/users/${id}/`, formData);
      setCurrentUser((prevUser) => ({ ...prevUser, ...data }));
      handleClose();
    } catch (error) {
      setErrors(error.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  // Render a form group for each field in the profile data
  const renderFormGroup = (field, value) => (
    <Form.Group controlId={`form${field}`} className="mb-3" key={field}>
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
  );

  return (
    <Modal show={show} onHide={handleClose} centered className="text-light">
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-light"
      >
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light p-2">
        <Form onSubmit={handleSubmit}>
          <Container className={styles.Container}>
            {Object.entries(profileData).map(([field, value]) =>
              renderFormGroup(field, value)
            )}
            <div className={styles.buttonWrapper}>
              <Button
                variant="outline-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      variant="light"
                    />{' '}
                    <span className="text-light">Saving...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleClose}
                disabled={loading}
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

export default React.memo(EditProfileModal);
