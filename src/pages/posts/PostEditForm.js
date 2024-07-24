import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Alert,
  Container,
  Image,
  Spinner,
} from 'react-bootstrap';
import Upload from '../../assets/upload.png';
import styles from './styles/PostCreateForm.module.css';
import Asset from '../../components/Asset';
import { axiosReq } from '../../api/axiosDefaults';
import { toast } from 'react-toastify';
import LoadingSpinnerToast from '../../components/LoadingSpinnerToast';

const PostEditForm = ({ show, handleClose, postId }) => {
  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    content: '',
    image: '',
    image_filter: 'normal',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const imageInput = useRef(null);

  useEffect(() => {
    const fetchPostData = async () => {
      if (show && postId) {
        setLoading(true);
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
          toast.error('Failed to load post data. Please try again.');
        } finally {
          setLoading(false);
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
    const file = event.target.files[0];
    if (file) {
      URL.revokeObjectURL(postData.image);
      setImageLoading(true);
      setPostData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setImageLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('content', postData.content);
    formData.append('image_filter', postData.image_filter);
    formData.append(
      'tags',
      postData.tags.split(',').map((tag) => tag.trim()),
    );
    if (postData.image) {
      formData.append('image', postData.image);
    }
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

  const renderImagePreview = () => {
    if (imageLoading) {
      return (
        <LoadingSpinnerToast
          show={true}
          message="Loading image, please wait..."
          duration={5000}
        />
      );
    } else if (postData.image) {
      return (
        <div onClick={() => imageInput.current.click()}>
          <div className={styles.ImageWrapper}>
            <Image
              src={
                typeof postData.image === 'string'
                  ? postData.image
                  : URL.createObjectURL(postData.image)
              }
              rounded
              fluid
              alt="Post preview"
            />
            <div className={styles.Placeholder}>Click to change the image</div>
          </div>
        </div>
      );
    } else {
      return (
        <Form.Label
          className="d-flex justify-content-center"
          htmlFor="image-upload"
        >
          <Asset src={Upload} message="Click to upload an image" />
        </Form.Label>
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="text-light">
      {loading && (
        <LoadingSpinnerToast
          show={true}
          message="Loading post data, please wait..."
          duration={5000}
        />
      )}
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
              {renderImagePreview()}
              <Form.Control
                type="file"
                id="image-upload"
                accept="image/*"
                className="d-none"
                ref={imageInput}
                onChange={handleChangeImage}
              />
              <Form.Control.Feedback type="invalid">
                {errors.image}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formImageFilter" className="mt-3">
              <Form.Label>Image Filter</Form.Label>
              <Form.Control
                as="select"
                name="image_filter"
                value={postData.image_filter}
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
                value={postData.content}
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
                value={postData.tags}
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
