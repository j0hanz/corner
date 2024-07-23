import React, { useState } from 'react';
import { Modal, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './styles/EditProfilePage.module.css';

const DeleteAccountModal = ({ show, handleClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleDelete = async () => {
    try {
      await axios.delete(`/users/${id}/`);
      handleClose();
      navigate('/');
    } catch (error) {
      setErrors(error.response?.data || {});
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="text-light">
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-light"
      >
        <Modal.Title>Delete Account</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light p-0">
        <Container className={styles.Container}>
          {errors.detail && <Alert variant="danger">{errors.detail}</Alert>}
          <p>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <div className={styles.buttonWrapper}>
            <Button
              variant="outline-danger"
              onClick={handleDelete}
              className={styles.leftButton}
            >
              Delete Account
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
      </Modal.Body>
    </Modal>
  );
};

export default DeleteAccountModal;
