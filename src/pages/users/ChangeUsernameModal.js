import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Modal,
  Button,
  Form,
  Alert,
  Container,
  Spinner,
  InputGroup,
} from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Importing the user icon
import styles from './styles/EditProfilePage.module.css';

const ChangeUsernameModal = React.memo(({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    username: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setFormData((prevState) => ({
        ...prevState,
        username: currentUser.username,
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, username: '' }));
    }
  }, [currentUser, id]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await axiosRes.put('/dj-rest-auth/user/', formData);
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username: formData.username,
      }));
      handleClose();
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="text-light">
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-light border-0"
      >
        <Modal.Title>Change Username</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light p-0">
        <Container className={styles.Container}>
          {errors.detail && <Alert variant="danger">{errors.detail}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label className="d-none">New Username</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  className={`bg-dark text-light ${styles.InputGroupIcon}`}
                >
                  <FontAwesomeIcon icon={faUser} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter new username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-dark text-light"
                />
              </InputGroup>
              {errors?.username?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
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
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
});

ChangeUsernameModal.whyDidYouRender = true;

export default ChangeUsernameModal;
