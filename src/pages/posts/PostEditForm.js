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
  // State to manage errors, post data, and loading states
  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    content: '',
    filtered_image_url: '',
    image_filter: 'NONE',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const imageInput = useRef(null);

  // Fetch post data when the component mounts or when the postId changes
  useEffect(() => {
    const fetchPostData = async () => {
      if (show && postId) {
        setLoadingData(true);
        try {
          const { data } = await axiosReq.get(`/posts/${postId}/`);
          const { content, filtered_image_url, image_filter, tags, is_owner } =
            data;
          if (is_owner) {
            setPostData({
              content,
              filtered_image_url,
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
          setLoadingData(false);
        }
      }
    };
    fetchPostData();
  }, [show, postId, handleClose]);

  // Handle input changes and update the state
  const handleChange = ({ target: { name, value } }) => {
    setPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image input changes and update the state
  const handleChangeImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      URL.revokeObjectURL(postData.filtered_image_url);
      setPostData((prevData) => ({
        ...prevData,
        filtered_image_url: file,
      }));
    }
  };

  // Handle form submission for editing a post
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData();
    formData.append('content', postData.content);
    formData.append('image_filter', postData.image_filter);
    formData.append(
      'tags',
      postData.tags.split(',').map((tag) => tag.trim())
    );

    if (
      postData.filtered_image_url &&
      typeof postData.filtered_image_url === 'object'
    ) {
      formData.append('image', postData.filtered_image_url);
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

  // Get the filter style based on the image filter type
  const getFilterStyle = (filter) => {
    switch (filter) {
      case 'GRAYSCALE':
        return 'grayscale(100%)';
      case 'SEPIA':
        return 'sepia(100%)';
      case 'NEGATIVE':
        return 'invert(100%)';
      case 'BRIGHTNESS':
        return 'brightness(130%)';
      case 'CONTRAST':
        return 'contrast(130%)';
      case 'SATURATION':
        return 'saturate(130%)';
      case 'HUE_ROTATE':
        return 'hue-rotate(90deg)';
      case 'BLUR':
        return 'blur(5px)';
      case 'SHARPEN':
        return 'contrast(200%)';
      case 'VINTAGE':
        return 'sepia(100%) contrast(80%)';
      case 'VIGNETTE':
        return 'brightness(90%) contrast(150%)';
      case 'CROSS_PROCESS':
        return 'saturate(150%) contrast(80%) brightness(90%)';
      case 'HDR':
        return 'contrast(150%) saturate(150%)';
      case 'EDGE_DETECT':
        return 'contrast(200%) brightness(150%) grayscale(100%)';
      case 'EMBOSS':
        return 'contrast(200%) brightness(150%) grayscale(100%)';
      case 'SOLARIZE':
        return 'invert(100%) brightness(150%)';
      case 'POSTERIZE':
        return 'contrast(200%) brightness(150%)';
      case 'PIXELATE':
        return 'contrast(200%) brightness(150%)';
      case 'CARTOON':
        return 'contrast(200%) brightness(150%) saturate(150%)';
      case 'DUOTONE':
        return 'sepia(100%) contrast(80%)';
      default:
        return 'none';
    }
  };

  // Render the image preview based on the current image state
  const renderImagePreview = () => {
    if (postData.filtered_image_url) {
      const imageUrl =
        typeof postData.filtered_image_url === 'string'
          ? postData.filtered_image_url
          : URL.createObjectURL(postData.filtered_image_url);
      return (
        <div onClick={() => imageInput.current.click()}>
          <div className={styles.ImageWrapper}>
            <Image
              src={imageUrl}
              rounded
              fluid
              alt="Post preview"
              style={{ filter: getFilterStyle(postData.image_filter) }}
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
    <>
      {loadingData && (
        <LoadingSpinnerToast
          show={true}
          message="Loading post data, please wait..."
          duration={5000}
        />
      )}
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
                    'NONE',
                    'GRAYSCALE',
                    'SEPIA',
                    'NEGATIVE',
                    'BRIGHTNESS',
                    'CONTRAST',
                    'SATURATION',
                    'HUE_ROTATE',
                    'BLUR',
                    'SHARPEN',
                    'VINTAGE',
                    'VIGNETTE',
                    'CROSS_PROCESS',
                    'HDR',
                    'EDGE_DETECT',
                    'EMBOSS',
                    'SOLARIZE',
                    'POSTERIZE',
                    'PIXELATE',
                    'CARTOON',
                    'DUOTONE',
                  ].map((filter) => (
                    <option key={filter} value={filter}>
                      {filter.charAt(0) + filter.slice(1).toLowerCase()}
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
    </>
  );
};

export default PostEditForm;
