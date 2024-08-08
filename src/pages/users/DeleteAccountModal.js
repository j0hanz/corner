import React, { useState } from 'react';
import { Modal, Button, Alert, Container, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './styles/EditProfilePage.module.css';

const DeleteAccountModal = ({ show, handleClose }) => {
  const { id } = useParams(); // Get the user ID from the URL parameters
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [errors, setErrors] = useState({}); // State to manage errors
  const [loading, setLoading] = useState(false); // State to manage loading state

  // Handle the account deletion process
  const handleDelete = async () => {
    setLoading(true); // Set loading state to true
    try {
      await axios.delete(`/users/${id}/`); // Send a request to delete the user account
      handleClose(); // Close the modal
      navigate('/'); // Navigate to the home page
    } catch (error) {
      setErrors(error.response?.data || {}); // Set errors if the request fails
    } finally {
      setLoading(false); // Set loading state to false
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
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light p-2">
          <Container className={styles.Container}>
            {errors.detail && <Alert variant="danger">{errors.detail}</Alert>}
            <p className="my-2">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className={styles.buttonWrapper}>
              <Button
                variant="outline-danger"
                onClick={handleDelete}
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
                    <span className="text-light">Deleting...</span>
                  </>
                ) : (
                  'Delete Account'
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeleteAccountModal;
