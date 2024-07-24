import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Form,
  Button,
  Alert,
  Spinner,
  Container,
  Image,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { toast } from 'react-toastify';
import styles from './styles/PostCreateForm.module.css';
import Asset from '../../components/Asset';
import Upload from '../../assets/upload.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const PostCreateForm = ({ show, handleClose }) => {
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
  const [loading, setLoading] = useState(false);
  const { content, image, image_filter, tags } = postData;

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleChange = ({ target: { name, value } }) => {
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeImage = ({ target: { files } }) => {
    if (files.length) {
      URL.revokeObjectURL(image);
      setPostData((prev) => ({ ...prev, image: files[0] }));
    }
  };

  const handleRemoveImage = () => {
    URL.revokeObjectURL(image);
    setPostData((prev) => ({ ...prev, image: '' }));
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

    setLoading(true);
    try {
      await axiosReq.post('/posts/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Post created successfully!');
      window.location.reload();
      handleClose();
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data || {});
        toast.error('Failed to create post. Please try again.');
      }
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
        <Modal.Title>Create Post</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light p-0">
        <Form onSubmit={handleSubmit}>
          <Container className={styles.Container}>
            <Form.Group className="text-center mb-3">
              <div onClick={() => imageInput.current.click()}>
                {image ? (
                  <div className={styles.ImageWrapper}>
                    <Image
                      src={URL.createObjectURL(image)}
                      rounded
                      fluid
                      alt="Post preview"
                    />
                    <div className={styles.Placeholder}>
                      Click to change the image
                    </div>
                  </div>
                ) : (
                  <Form.Label
                    className="d-flex justify-content-center"
                    htmlFor="image-upload"
                  >
                    <Asset src={Upload} message="Click to upload an image" />
                  </Form.Label>
                )}
                <Form.Control
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="d-none"
                  ref={imageInput}
                  onChange={handleChangeImage}
                />
              </div>
              {image && (
                <div className="d-flex justify-content-center my-4">
                  <Button variant="outline-danger" onClick={handleRemoveImage}>
                    Remove Image
                    <FontAwesomeIcon className="fa-lg" icon={faXmark} />
                  </Button>
                </div>
              )}
              <Form.Control.Feedback type="invalid">
                {errors.image}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formImageFilter" className="mt-3">
              <Form.Label>Image Filter</Form.Label>
              <Form.Control
                as="select"
                name="image_filter"
                value={image_filter}
                onChange={handleChange}
                isInvalid={!!errors.image_filter}
                className={`bg-dark text-light ${styles.FormControl}`}
              >
                {[
                  'normal',
                  '_1977',
                  'brannan',
                  'earlybird',
                  'hudson',
                  'inkwell',
                  'lofi',
                  'kelvin',
                  'nashville',
                  'rise',
                  'toaster',
                  'valencia',
                  'walden',
                  'xpro2',
                ].map((filter) => (
                  <option key={filter} value={filter}>
                    {filter.replace('_', '')}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.image_filter}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formContent" className="mt-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                value={content}
                onChange={handleChange}
                isInvalid={!!errors.content}
                placeholder="Write your post content here..."
                className={`bg-dark text-light ${styles.FormControl}`}
              />
              <Form.Control.Feedback type="invalid">
                {errors.content}
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
                placeholder="Add some tags..."
                className={`bg-dark text-light ${styles.FormControl}`}
              />
              <Form.Control.Feedback type="invalid">
                {errors.tags}
              </Form.Control.Feedback>
            </Form.Group>

            <div className={styles.buttonWrapper}>
              <Button
                variant="outline-primary"
                className={styles.leftButton}
                type="submit"
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
                    <span className="text-light">Creating...</span>
                  </>
                ) : (
                  'Create Post'
                )}
              </Button>
              <Button
                variant="outline-secondary"
                className={styles.rightButton}
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
            {errors.non_field_errors && (
              <Alert variant="danger" className="mt-3">
                {errors.non_field_errors.join(', ')}
              </Alert>
            )}
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PostCreateForm;
