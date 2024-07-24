import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Form, Alert, Container } from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import styles from './styles/EditProfilePage.module.css';
import LoadingSpinnerToast from '../../components/LoadingSpinnerToast';

const ChangeUsernameModal = ({ show, handleClose }) => {
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    if (currentUser?.pk?.toString() === id) {
      setUsername(currentUser.username);
    } else {
      setUsername('');
    }
  }, [currentUser, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await axiosRes.put('/dj-rest-auth/user/', { username });
      setCurrentUser((prevUser) => ({ ...prevUser, username }));
      handleClose();
      window.location.reload();
    } catch (err) {
      setErrors(err.response?.data || {});
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
          <Modal.Title>Change Username</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light p-0">
          <Container className={styles.Container}>
            {errors.detail && <Alert variant="danger">{errors.detail}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>New Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter new username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-dark text-light"
                />
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
                  className={styles.leftButton}
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
              {loading && (
                <LoadingSpinnerToast
                  show={true}
                  message="Processing, please wait..."
                  duration={5000}
                />
              )}
            </Form>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChangeUsernameModal;
