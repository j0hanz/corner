import React, { useEffect, useState, useCallback } from 'react';
import {
  Modal,
  Button,
  Form,
  Alert,
  Container,
  Spinner,
  InputGroup,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosRes } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons'; // Importing lock icon
import styles from './styles/EditProfilePage.module.css';

const ChangePasswordModal = React.memo(({ show, handleClose }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useCurrentUser();

  const [userData, setUserData] = useState({
    new_password1: '',
    new_password2: '',
  });
  const { new_password1, new_password2 } = userData;
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  useEffect(() => {
    if (currentUser?.profile_id?.toString() !== id) {
      navigate('/');
    }
  }, [currentUser, navigate, id]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
        await axiosRes.post('/dj-rest-auth/password/change/', userData);
        handleClose();
      } catch (err) {
        setErrors(err.response?.data || {});
      } finally {
        setLoading(false);
      }
    },
    [handleClose, userData]
  );

  return (
    <Modal show={show} onHide={handleClose} centered className="text-light">
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-light border-0"
      >
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light p-0">
        <Container className={styles.Container}>
          {errors.detail && <Alert variant="danger">{errors.detail}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNewPassword1" className="mb-3">
              <Form.Label className="d-none">New Password</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  className={`bg-dark text-light ${styles.InputGroupIcon}`}
                >
                  <FontAwesomeIcon icon={faLock} />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  name="new_password1"
                  value={new_password1}
                  onChange={handleChange}
                  className="bg-dark text-light"
                />
              </InputGroup>
              {errors?.new_password1?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            <Form.Group controlId="formNewPassword2" className="mb-3">
              <Form.Label className="d-none">Confirm New Password</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  className={`bg-dark text-light ${styles.InputGroupIcon}`}
                >
                  <FontAwesomeIcon icon={faLock} />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  name="new_password2"
                  value={new_password2}
                  onChange={handleChange}
                  className="bg-dark text-light"
                />
              </InputGroup>
              {errors?.new_password2?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            <div className="d-flex justify-content-between">
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

export default ChangePasswordModal;
