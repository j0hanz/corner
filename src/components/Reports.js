import React, { useState } from 'react';
import {
  Modal,
  Button,
  Spinner,
  Alert,
  Form,
  Container,
} from 'react-bootstrap';
import { axiosRes } from '../api/axiosDefaults';
import { toast } from 'react-toastify';
import styles from './styles/Reports.module.css';

const Reports = ({ show, handleClose, postId, commentId }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axiosRes.post('/reports/', {
        post: postId,
        comment: commentId,
        reason,
      });
      toast.success('Report submitted successfully!');
      handleClose();
    } catch (err) {
      console.error(err);
      setError('There was an error submitting the report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="text-light">
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-light"
      >
        <Modal.Title>Report {postId ? 'Post' : 'Comment'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light p-2">
        <Container className={styles.Container}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mt-3" controlId="reason">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={`bg-dark text-light ${styles.FormControl}`}
                required
              />
            </Form.Group>
            <div className={styles.buttonWrapper}>
              <Button
                variant="outline-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button variant="outline-danger" type="submit" disabled={loading}>
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
                    Reporting...
                  </>
                ) : (
                  'Report'
                )}
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default Reports;
