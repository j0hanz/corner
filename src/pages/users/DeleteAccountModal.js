import React, { useState } from 'react';
import { Modal, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './styles/EditProfilePage.module.css';

const DeleteAccountModal = ({ show, handleClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleDelete = () => {
    axios
      .delete(`/users/${id}/`)
      .then(() => {
        handleClose();
        navigate('/');
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
        <Modal.Title>Delete Account</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        <Container className={styles.Container}>
          {errors.detail && <Alert variant="danger">{errors.detail}</Alert>}
          <p>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <div className={styles.buttonWrapper}>
            <Button variant="danger" onClick={handleDelete} className="mx-2">
              Delete Account
            </Button>
            <Button variant="secondary" onClick={handleClose} className="mx-2">
              Cancel
            </Button>
          </div>
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

export default DeleteAccountModal;
