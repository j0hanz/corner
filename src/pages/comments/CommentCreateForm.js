import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';
import styles from './styles/CommentCreateForm.module.css';

function CommentCreateForm(props) {
  const { post, setPost, setComments } = props;
  const [content, setContent] = useState('');
  const [commentErrorShow, setCommentErrorShow] = useState(false);

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    } catch (err) {
      setCommentErrorShow(true);
      setContent('');
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
                className={`${styles.CommentContent}`}
                as="textarea"
                placeholder="Leave your comment here"
                rows={2}
                value={content}
                onChange={handleChange}
              />
            </Form.Group>
            <Button type="submit" variant="outline-light float-end">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
      {commentErrorShow && (
        <div className="text-danger mt-2">
          There was an error adding your comment!
        </div>
      )}
    </>
  );
}

export default CommentCreateForm;
