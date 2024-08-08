import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';
import styles from './styles/CommentCreateForm.module.css';

const CommentEditForm = ({ id, content, setComments, setShowEditForm }) => {
  // State to manage the content of the comment and error state
  const [formContent, setFormContent] = useState(content);
  const [error, setError] = useState(null);

  // Handle input changes and update the state
  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  // Handle form submission for editing a comment
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a request to update the comment
      await axiosRes.put(`/comments/${id}/`, { content: formContent });
      // Update the comments state with the edited comment
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) =>
          comment.id === id ? { ...comment, content: formContent } : comment
        ),
      }));
      // Close the edit form
      setShowEditForm(false);
    } catch (err) {
      // Set error state if the request fails
      setError('There was an error updating the comment');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="content">
        <Form.Control
          className={styles.CommentContent}
          as="textarea"
          rows={3}
          value={formContent}
          onChange={handleChange}
        />
      </Form.Group>
      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
      <div className="d-flex justify-content-end mt-2">
        <Button type="submit" variant="primary">
          Save
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => setShowEditForm(false)}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default CommentEditForm;
