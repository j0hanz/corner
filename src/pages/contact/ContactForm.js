import React, { useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Alert,
  Container,
  Spinner,
  InputGroup,
} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHashtag,
  faEnvelope,
  faExclamation,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons'; // Import the required icons
import styles from './styles/ContactFormModal.module.css';

const ContactForm = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    category: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/contact/create/', formData);
      setIsSubmitted(true);
      setFormData({
        category: '',
        email: '',
        subject: '',
        message: '',
      });
      setTimeout(() => {
        setIsSubmitted(false);
        handleClose();
      }, 2000);
    } catch (error) {
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
        className="bg-dark text-light border-0"
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
              <Form.Label className="d-none">Category</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  id="category-addon"
                  className={`bg-dark text-light ${styles.InputGroupIcon}`}
                >
                  <FontAwesomeIcon icon={faHashtag} />
                </InputGroup.Text>
                <Form.Control
                  as="select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`${styles.FormControl} bg-dark text-light`}
                  aria-describedby="category-addon"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="general">General Inquiry</option>
                  <option value="feedback">Feedback</option>
                  <option value="support">Support</option>
                </Form.Control>
              </InputGroup>
              {errors.category?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label className="d-none">Email</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  id="email-addon"
                  className={`bg-dark text-light ${styles.InputGroupIcon}`}
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.FormControl} bg-dark text-light`}
                  aria-describedby="email-addon"
                  required
                />
              </InputGroup>
              {errors.email?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            <Form.Group controlId="formSubject" className="mb-3">
              <Form.Label className="d-none">Subject</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  id="subject-addon"
                  className={`bg-dark text-light ${styles.InputGroupIcon}`}
                >
                  <FontAwesomeIcon icon={faExclamation} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`${styles.FormControl} bg-dark text-light`}
                  aria-describedby="subject-addon"
                  required
                />
              </InputGroup>
              {errors.subject?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            <Form.Group controlId="formMessage" className="mb-3">
              <Form.Label className="d-none">Message</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  id="message-addon"
                  className={`bg-dark text-light ${styles.InputGroupIcon}`}
                >
                  <FontAwesomeIcon icon={faCommentDots} />
                </InputGroup.Text>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${styles.FormControl} bg-dark text-light`}
                  aria-describedby="message-addon"
                  required
                />
              </InputGroup>
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
