import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Alert, Container, Image } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './styles/EditProfilePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Upload from '../../assets/upload.png';
import Asset from '../../components/Asset';

const ProfileImageModal = ({
  show,
  handleClose,
  setCurrentUser,
  currentUser,
}) => {
  const { id } = useParams();
  const imageFileRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(
    currentUser?.profile_image || '',
  );
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      URL.revokeObjectURL(imagePreview); // revoke the previous URL to avoid memory leaks
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      axios
        .put(`/users/${id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(({ data }) => {
          setCurrentUser((prevUser) => ({
            ...prevUser,
            profile_image: data.image,
          }));
          handleClose(); // Close modal without reloading
        })
        .catch((error) => setErrors(error.response?.data || {}));
    } else {
      handleClose();
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setImageFile(null); // Reset imageFile state
    axios
      .put(`/users/${id}/`, { image: null })
      .then(() => {
        setCurrentUser((prevUser) => ({
          ...prevUser,
          profile_image: '',
        }));
        window.location.reload();
      })
      .catch((error) => {
        setErrors(error.response?.data || {});
      });
  };

  return (
    <Modal show={show} onHide={handleClose} className="text-light">
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-light"
      >
        <Modal.Title>Change Profile Image</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light py-0">
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
              {imagePreview && (
                <div className="d-flex justify-content-center my-4">
                  <Button variant="outline-danger" onClick={handleRemoveImage}>
                    Remove Image
                    <br />
                    <FontAwesomeIcon className="fa-lg" icon={faXmark} />
                  </Button>
                </div>
              )}
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <div className={styles.buttonWrapper}>
              <Button
                variant="outline-primary text-white mx-2"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
              <Button variant="outline-secondary mx-2" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileImageModal;
