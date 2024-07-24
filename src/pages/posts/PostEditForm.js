import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Alert,
  Spinner,
  Container,
  Image,
} from 'react-bootstrap';
import Upload from '../../assets/upload.png';
import styles from './styles/PostCreateForm.module.css';
import Asset from '../../components/Asset';
import { axiosReq } from '../../api/axiosDefaults';
import { toast } from 'react-toastify';

const PostEditForm = ({ show, handleClose, postId }) => {
  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    content: '',
    image: '',
    image_filter: 'normal',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const imageInput = useRef(null);
  const { content, image, image_filter, tags } = postData;

  useEffect(() => {
    const fetchPostData = async () => {
      if (show && postId) {
        try {
          const { data } = await axiosReq.get(`/posts/${postId}/`);
          const { content, image, image_filter, tags, is_owner } = data;

          if (is_owner) {
            setPostData({
              content,
              image,
              image_filter,
              tags: tags.join(', '),
            });
          } else {
            handleClose();
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchPostData();
  }, [show, postId, handleClose]);

  const handleChange = ({ target: { name, value } }) => {
    setPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      const file = event.target.files[0];
      URL.revokeObjectURL(image);
      setPostData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const handleRemoveImage = () => {
    URL.revokeObjectURL(image);
    setPostData((prevData) => ({
      ...prevData,
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
    formData.append(
      'tags',
      tags.split(',').map((tag) => tag.trim()),
    );

    if (typeof image === 'object') {
      formData.append('image', image);
    }

    setLoading(true);
    try {
      await axiosReq.put(`/posts/${postId}/`, formData);
      toast.success('Post updated successfully!');
      window.location.reload();
      handleClose();
    } catch (error) {
      if (error.response?.status !== 401) {
        setErrors(error.response?.data || {});
        toast.error('Failed to update post. Please try again.');
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
        <Modal.Title>Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light p-0">
        <Form onSubmit={handleSubmit}>
          <Container className={styles.Container}>
            <Form.Group className="text-center mb-3">
              <div onClick={() => imageInput.current.click()}>
                {image ? (
                  <div className={styles.ImageWrapper}>
                    <Image
                      src={
                        typeof image === 'string'
                          ? image
                          : URL.createObjectURL(image)
                      }
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
                    <span className="text-light">Saving...</span>
                  </>
                ) : (
                  'Save Changes'
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

export default PostEditForm;
