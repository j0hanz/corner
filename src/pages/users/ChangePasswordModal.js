import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './styles/EditProfilePage.module.css';

const ChangePasswordModal = ({ show, handleClose }) => {
  const { id } = useParams();
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/users/${id}/`, { password })
      .then(() => {
        handleClose();
        window.location.reload();
      })
      .catch((error) => {
        setErrors(error.response?.data || {});
      });
  };

  return (
    <Modal show={show} onHide={handleClose} className="text-light">
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-light"
      >
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        <Container className={styles.Container}>
          {errors.detail && <Alert variant="danger">{errors.detail}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={handlePasswordChange}
                className="bg-dark text-light"
              />
              {errors?.password?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            <div className={styles.buttonWrapper}>
              <Button variant="primary" type="submit" className="mx-2">
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={handleClose}
                className="mx-2"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer className="bg-dark text-light">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
