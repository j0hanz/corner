import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Button,
  Form,
  Alert,
  Container,
  Spinner,
  InputGroup,
} from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import { useParams } from 'react-router-dom';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLocationArrow,
  faLink,
  faEnvelope,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'; // Import the icons
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
      handleClose();
    } catch (error) {
      setErrors(error.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  const renderFormGroup = (field, value, icon) => (
    <Form.Group controlId={`form${field}`} className="mb-3" key={field}>
      <Form.Label className="d-none">{field.replace('_', ' ')}</Form.Label>
      <InputGroup>
        <InputGroup.Text
          className={`bg-dark text-light ${styles.InputGroupIcon}`}
        >
          <FontAwesomeIcon icon={icon} />
        </InputGroup.Text>
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
      </InputGroup>
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
        className="bg-dark text-light border-0"
      ></Modal.Header>
      <Modal.Body className="bg-dark text-light p-2">
        <Form onSubmit={handleSubmit}>
          <Container className={styles.Container}>
            {renderFormGroup('first_name', profileData.first_name, faUser)}
            {renderFormGroup('last_name', profileData.last_name, faUser)}
            {renderFormGroup('bio', profileData.bio, faInfoCircle)}
            {renderFormGroup('location', profileData.location, faLocationArrow)}
            {renderFormGroup('url_link', profileData.url_link, faLink)}
            {renderFormGroup(
              'contact_email',
              profileData.contact_email,
              faEnvelope
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
