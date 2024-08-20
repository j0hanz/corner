import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Modal,
  Form,
  Button,
  Alert,
  Spinner,
  Container,
  Image,
  InputGroup,
} from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTags, faImage } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/PostCreateForm.module.css';
import Asset from '../../components/Asset';
import Upload from '../../assets/upload.png';

const PostCreateForm = ({ show, handleClose, addPost }) => {
  const imageInput = useRef(null);

  const [postData, setPostData] = useState({
    content: '',
    image: '',
    image_filter: 'NONE',
    tags: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { content, image, image_filter, tags } = postData;

  const handleChange = useCallback(({ target: { name, value } }) => {
    setPostData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleChangeImage = useCallback(() => {
    if (imageInput.current?.files?.length) {
      URL.revokeObjectURL(image);
      setPostData((prev) => ({ ...prev, image: imageInput.current.files[0] }));
    }
  }, [image]);

  const handleRemoveImage = useCallback(() => {
    URL.revokeObjectURL(image);
    setPostData((prev) => ({ ...prev, image: '' }));
    if (imageInput.current) {
      imageInput.current.value = '';
    }
  }, [image]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const formData = new FormData();
      ['content', 'image_filter', 'tags'].forEach((key) =>
        formData.append(key, postData[key])
      );
      if (image) formData.append('image', image);

      setLoading(true);
      try {
        const { data } = await axiosReq.post('/posts/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Post created successfully!');
        addPost(data);
        handleClose();
      } catch (err) {
        if (err.response?.status !== 401) {
          setErrors(err.response?.data || {});
          toast.error('Failed to create post. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    },
    [postData, image, handleClose, addPost]
  );

  const getFilterStyle = useCallback((filter) => {
    const filters = {
      GRAYSCALE: 'grayscale(100%)',
      SEPIA: 'sepia(100%)',
      NEGATIVE: 'invert(100%)',
      BRIGHTNESS: 'brightness(130%)',
      CONTRAST: 'contrast(130%)',
      SATURATION: 'saturate(130%)',
      HUE_ROTATE: 'hue-rotate(90deg)',
      BLUR: 'blur(5px)',
      SHARPEN: 'contrast(200%)',
      VINTAGE: 'sepia(100%) contrast(80%)',
      VIGNETTE: 'brightness(90%) contrast(150%)',
      CROSS_PROCESS: 'saturate(150%) contrast(80%) brightness(90%)',
      HDR: 'contrast(150%) saturate(150%)',
      EDGE_DETECT: 'contrast(200%) brightness(150%) grayscale(100%)',
      EMBOSS: 'contrast(200%) brightness(150%) grayscale(100%)',
      SOLARIZE: 'invert(100%) brightness(150%)',
      POSTERIZE: 'contrast(200%) brightness(150%)',
      PIXELATE: 'contrast(200%) brightness(150%)',
      CARTOON: 'contrast(200%) brightness(150%) saturate(150%)',
      DUOTONE: 'sepia(100%) contrast(80%)',
    };
    return filters[filter] || 'none';
  }, []);

  useEffect(() => {
    if (!show) {
      setPostData({
        content: '',
        image: '',
        image_filter: 'NONE',
        tags: '',
      });
      setErrors({});
      if (imageInput.current) {
        imageInput.current.value = '';
      }
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} centered className="text-light">
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-light border-0"
      >
        <Modal.Title>Create Post</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light p-0">
        <Form onSubmit={handleSubmit}>
          <Container className={styles.Container}>
            <Form.Group className="text-center mb-3">
              {image ? (
                <div
                  className={styles.ImageWrapper}
                  onClick={() => imageInput.current.click()}
                >
                  <figure>
                    <Image
                      src={URL.createObjectURL(image)}
                      rounded
                      fluid
                      alt="Post preview"
                      style={{ filter: getFilterStyle(image_filter) }}
                    />
                    <div className={styles.Placeholder}>
                      Click to change the image
                    </div>
                  </figure>
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
              {image && (
                <div className="d-flex justify-content-center my-4">
                  <Button variant="outline-danger" onClick={handleRemoveImage}>
                    Remove Image
                  </Button>
                </div>
              )}
              <Form.Control.Feedback type="invalid">
                {errors.image || ''}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formImageFilter" className="mt-3">
              <Form.Label>Image Filter</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  className={`bg-dark text-light ${styles.InputGroupIcon}`}
                >
                  <FontAwesomeIcon icon={faImage} />
                </InputGroup.Text>

                <Form.Control
                  as="select"
                  name="image_filter"
                  value={image_filter}
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
                      {filter.charAt(0) +
                        filter.slice(1).toLowerCase().replace('_', ' ')}
                    </option>
                  ))}
                </Form.Control>
              </InputGroup>

              <Form.Control.Feedback type="invalid">
                {errors.image_filter || ''}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formContent" className="mt-3">
              <Form.Label className="d-none">Content</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  className={`bg-dark text-light ${styles.InputGroupIcon}`}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </InputGroup.Text>
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
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {errors.content || ''}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formTags" className="mt-3">
              <Form.Label className="d-none">Tags</Form.Label>
              <InputGroup>
                <InputGroup.Text
                  className={`bg-dark text-light ${styles.InputGroupIcon}`}
                >
                  <FontAwesomeIcon icon={faTags} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="tags"
                  value={tags}
                  onChange={handleChange}
                  isInvalid={!!errors.tags}
                  placeholder="Add some tags..."
                  className={`bg-dark text-light ${styles.FormControl}`}
                />
              </InputGroup>
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
