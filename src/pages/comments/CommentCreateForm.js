import React, { useState } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
} from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/CommentCreateForm.module.css';

const CommentCreateForm = ({ post, setPost, setComments }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosRes.post('/comments/', {
        content,
        post,
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count + 1,
          },
        ],
      }));
      setContent('');
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row className="mb-3">
        <Col className="d-flex align-items-center">
          <Form onSubmit={handleSubmit} className="flex-grow-1 m-1">
            <Form.Group controlId="comment">
              <Form.Label visuallyHidden>Leave your comment here</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  className={`bg-dark text-light ${styles.InputGroupIcon}`}
                >
                  <FontAwesomeIcon icon={faCommentDots} />
                </InputGroup.Text>
                <Form.Control
                  className={`bg-dark ${styles.CommentContent}`}
                  as="textarea"
                  placeholder="Leave your comment here"
                  rows={2}
                  value={content}
                  onChange={handleChange}
                />
              </InputGroup>
            </Form.Group>
            <Button
              type="submit"
              variant="outline-light"
              className="float-end mt-2"
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
