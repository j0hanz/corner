import React, { useState, useRef, useEffect } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { toast } from 'react-toastify';

function PostCreateForm() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const imageInput = useRef(null);

  const [postData, setPostData] = useState({
    content: '',
    image: '',
    image_filter: 'normal',
    tags: '',
  });
  const [errors, setErrors] = useState({});
  const { content, image, image_filter, tags } = postData;

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData((prevPostData) => ({
      ...prevPostData,
      [name]: value,
    }));
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData((prevPostData) => ({
        ...prevPostData,
        image: event.target.files[0],
      }));
    }
  };

  const handleRemoveImage = () => {
    URL.revokeObjectURL(image);
    setPostData((prevPostData) => ({
      ...prevPostData,
      image: '',
    }));
    if (imageInput.current) {
      imageInput.current.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    formData.append('image_filter', image_filter);
    formData.append('tags', tags);
    if (image) {
      formData.append('image', image);
    }

    try {
      const { data } = await axiosReq.post('/posts/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Post created successfully!');
      navigate(`/posts/${data.id}`);
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data || {});
        toast.error('Failed to create post. Please try again.');
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <h2>Create Post</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formContent" className="mt-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                value={content}
                onChange={handleChange}
                isInvalid={!!errors.content}
              />
              <Form.Control.Feedback type="invalid">
                {errors.content}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formImage" className="mt-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                ref={imageInput}
                onChange={handleChangeImage}
                isInvalid={!!errors.image}
              />
              <Form.Control.Feedback type="invalid">
                {errors.image}
              </Form.Control.Feedback>
              {image && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Post preview"
                    className="img-thumbnail"
                  />
                  <Button
                    variant="danger"
                    className="mt-2"
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </Form.Group>
            <Form.Group controlId="formImageFilter" className="mt-3">
              <Form.Label>Image Filter</Form.Label>
              <Form.Control
                as="select"
                name="image_filter"
                value={image_filter}
                onChange={handleChange}
                isInvalid={!!errors.image_filter}
              >
                <option value="normal">Normal</option>
                <option value="_1977">1977</option>
                <option value="brannan">Brannan</option>
                <option value="earlybird">Earlybird</option>
                <option value="hudson">Hudson</option>
                <option value="inkwell">Inkwell</option>
                <option value="lofi">Lo-Fi</option>
                <option value="kelvin">Kelvin</option>
                <option value="nashville">Nashville</option>
                <option value="rise">Rise</option>
                <option value="toaster">Toaster</option>
                <option value="valencia">Valencia</option>
                <option value="walden">Walden</option>
                <option value="xpro2">X-pro II</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.image_filter}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formTags" className="mt-3">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={tags}
                onChange={handleChange}
                isInvalid={!!errors.tags}
              />
              <Form.Control.Feedback type="invalid">
                {errors.tags}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {false ? <Spinner animation="border" size="sm" /> : 'Create Post'}
            </Button>
          </Form>
          {errors.non_field_errors && (
            <Alert variant="danger" className="mt-3">
              {errors.non_field_errors.join(', ')}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default PostCreateForm;
