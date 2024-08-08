import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';
import styles from './styles/CommentCreateForm.module.css';

const CommentCreateForm = ({ post, setPost, setComments }) => {
  // State to manage the content of the comment, error, and loading state
  const [content, setContent] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes and update the state
  const handleChange = (event) => {
    setContent(event.target.value);
  };

  // Handle form submission for creating a comment
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Send a request to create a new comment
      const { data } = await axiosRes.post('/comments/', {
        content,
        post,
      });
      // Update the comments state with the new comment
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      // Update the post state to increment the comments count
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count + 1,
          },
        ],
      }));
      // Clear the comment input field and reset error state
      setContent('');
      setError(false);
    } catch (err) {
      // Set error state if the request fails
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row className="mb-3">
        <Col className="d-flex align-items-center">
          <Form onSubmit={handleSubmit} className="flex-grow-1 ms-2">
            <Form.Group controlId="comment">
              <Form.Label visuallyHidden>Leave your comment here</Form.Label>
              <Form.Control
                className={styles.CommentContent}
                as="textarea"
                placeholder="Leave your comment here"
                rows={2}
                value={content}
                onChange={handleChange}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="outline-light"
              className="float-end"
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
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </Form>
        </Col>
      </Row>
      {error && (
        <Alert variant="danger" className="mt-2">
          There was an error adding your comment!
        </Alert>
      )}
    </>
  );
};

export default CommentCreateForm;
