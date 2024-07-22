import React, { useState, useRef } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './styles/EditProfilePage.module.css';

const ProfileImageUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const imageFileRef = useRef(null);

  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const imageFile = files[0];
      setImagePreview(URL.createObjectURL(imageFile));

      const formData = new FormData();
      formData.append('image', imageFile);

      axios
        .post(`/users/${id}/profile-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(({ data }) => {
          setImagePreview(data.image);
        })
        .catch((error) => {
          setErrors(error.response?.data || {});
        });
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    axios
      .delete(`/users/${id}/profile-image`)
      .then(() => {
        setImagePreview('');
      })
      .catch((error) => {
        setErrors(error.response?.data || {});
      });
  };

  return (
    <Container className={styles.Container}>
      {errors.detail && <Alert variant="danger">{errors.detail}</Alert>}
      <Form>
        <Form.Group className="text-center mb-5 m-5">
          <div onClick={() => imageFileRef.current.click()}>
            {imagePreview ? (
              <div className={styles.ImageWrapper}>
                <img src={imagePreview} alt="Profile" />
              </div>
            ) : (
              <Form.Label
                htmlFor="image-upload"
                className={styles.uploadMessage}
              >
                <span>Click to upload an image</span>
                <span role="img" aria-label="upload">
                  📷
                </span>
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
            <div className="d-flex justify-content-center mt-2">
              <Button variant="outline-danger" onClick={handleRemoveImage}>
                Remove Image
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
            variant="outline-primary text-white mx-2 "
            onClick={() => navigate(`/users/${id}`)}
          >
            Save Changes
          </Button>
          <Button
            variant="outline-secondary"
            className="mx-2 "
            onClick={() => navigate(`/users/${id}`)}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ProfileImageUpload;
