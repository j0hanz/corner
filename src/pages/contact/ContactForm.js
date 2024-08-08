import React, { useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Alert,
  Container,
  Spinner,
} from 'react-bootstrap';
import axios from 'axios';
import styles from './styles/ContactFormModal.module.css';

const ContactForm = ({ show, handleClose }) => {
  // State to manage the form data, errors, loading state, and submission status
  const [formData, setFormData] = useState({
    category: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input changes and update the state
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle form submission for sending a contact message
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // Send a request to create a new contact message
      await axios.post('/contact/create/', formData);
      // Set the submission status to true and reset the form data
      setIsSubmitted(true);
      setFormData({
        category: '',
        email: '',
        subject: '',
        message: '',
      });
      // Close the modal after a short delay
      setTimeout(() => {
        setIsSubmitted(false);
        handleClose();
      }, 2000);
    } catch (error) {
      // Set errors if the request fails
      setErrors(error.response?.data || {});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="text-light">
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-light"
      >
        <Modal.Title>Contact Us</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light p-2">
        <Container className={styles.Container}>
          {isSubmitted && (
            <Alert variant="success">
              Your message has been sent successfully!
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCategory" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`${styles.FormControl} bg-dark text-light`}
                required
              >
                <option value="">Select a category</option>
                <option value="general">General Inquiry</option>
                <option value="feedback">Feedback</option>
                <option value="support">Support</option>
              </Form.Control>
              {errors.category?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.FormControl} bg-dark text-light`}
                required
              />
              {errors.email?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            <Form.Group controlId="formSubject" className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`${styles.FormControl} bg-dark text-light`}
                required
              />
              {errors.subject?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            <Form.Group controlId="formMessage" className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`${styles.FormControl} bg-dark text-light`}
                required
              />
              {errors.message?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            <div className={styles.buttonWrapper}>
              <Button
                variant="outline-primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      variant="light"
                    />{' '}
                    <span className="text-light">Sending...</span>
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default ContactForm;
