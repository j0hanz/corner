import React, { useState, useEffect } from 'react';
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
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const initialProfileData = {
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    url_link: '',
    contact_email: '',
  };

  const [profileData, setProfileData] = useState(initialProfileData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser?.pk?.toString() !== id) {
        return;
      }

      try {
        const { data } = await axiosReq.get(`/users/${id}/`);
        const {
          first_name,
          last_name,
          bio,
          location,
          url_link,
          contact_email,
        } = data;
        setProfileData({
          first_name,
          last_name,
          bio,
          location,
          url_link,
          contact_email,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
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
    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      setLoading(true);
      const { data } = await axiosReq.put(`/users/${id}/`, formData);
      setCurrentUser((prevUser) => ({ ...prevUser, ...data }));
      window.location.reload();
      handleClose();
    } catch (error) {
      setErrors(error.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                        style={{ color: 'white' }}
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
    </>
  );
};

export default EditProfileModal;
