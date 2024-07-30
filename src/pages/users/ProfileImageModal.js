import React, { useState, useRef, useCallback } from 'react';
import {
  Modal,
  Button,
  Form,
  Alert,
  Container,
  Image,
  Spinner,
} from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './styles/EditProfilePage.module.css';
import Upload from '../../assets/upload.png';
import Asset from '../../components/Asset';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';

const ProfileImageModal = React.memo(({ show, handleClose }) => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const imageFileRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(
    currentUser?.profile_image || ''
  );
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleSaveChanges = useCallback(async () => {
    if (imageFile) {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const { data } = await axios.put(`/users/${id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (typeof setCurrentUser === 'function') {
          setCurrentUser((prevUser) => ({
            ...prevUser,
            profile_image: data.image,
          }));
        } else {
          console.error('setCurrentUser is not a function');
        }
        window.location.reload();
        handleClose();
      } catch (error) {
        setErrors(error.response?.data || {});
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      handleClose();
    }
  }, [handleClose, imageFile, id, setCurrentUser]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title>Change Profile Image</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light p-0">
        <Container className={styles.Container}>
          {errors.detail && <Alert variant="danger">{errors.detail}</Alert>}
          <Form>
            <Form.Group className="text-center mb-5 m-5">
              <div onClick={() => imageFileRef.current.click()}>
                {imagePreview ? (
                  <div className={styles.ImageWrapper}>
                    <Image src={imagePreview} rounded fluid alt="Profile" />
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
                  ref={imageFileRef}
                  onChange={handleImageChange}
                />
              </div>
            </Form.Group>
            {errors.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <div className={styles.buttonWrapper}>
              <Button
                variant="outline-primary text-white"
                onClick={handleSaveChanges}
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
                variant="outline-secondary text-white"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
});

export default ProfileImageModal;
