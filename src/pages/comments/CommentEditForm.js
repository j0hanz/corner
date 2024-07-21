import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';

const CommentEditForm = ({
  id,
  profile_id,
  content,
  setComments,
  setShowEditForm,
}) => {
  const [formContent, setFormContent] = useState(content);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, { content: formContent });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) =>
          comment.id === id ? { ...comment, content: formContent } : comment,
        ),
      }));
      setShowEditForm(false);
    } catch (err) {
      setError('There was an error updating the comment');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="content">
        <Form.Control
          as="textarea"
          rows={3}
          value={formContent}
          onChange={(event) => setFormContent(event.target.value)}
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button type="submit" variant="primary" className="mt-2">
        Save
      </Button>
      <Button
        variant="secondary"
        className="mt-2 ms-2"
        onClick={() => setShowEditForm(false)}
      >
        Cancel
      </Button>
    </Form>
  );
};

export default CommentEditForm;
