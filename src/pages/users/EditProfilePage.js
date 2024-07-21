import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Form,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMapMarkerAlt,
  faLink,
  faEnvelope,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import styles from './styles/EditProfilePage.module.css';

const EditProfilePage = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const imageFileRef = useRef();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    url_link: '',
    contact_email: '',
    image: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (currentUser?.id?.toString() !== id) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`/users/${id}/`);
        setProfileData(data);
        setImagePreview(data.image);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const imageFile = files[0];
      setProfileData((prevData) => ({
        ...prevData,
        image: imageFile,
      }));
      setImagePreview(URL.createObjectURL(imageFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const { data } = await axios.put(`/users/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        profile_image: data.image,
      }));
      navigate(`/users/${id}/`);
    } catch (error) {
      setErrors(error.response?.data || {});
    }
  };

  if (loading) {
    return (
      <Container className={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const textFields = (
    <div className="text-center">
      <Form.Group controlId="formFirstName" className="mb-3">
        <Form.Label className="d-none">First Name</Form.Label>
        <div className="d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          <Form.Control
            type="text"
            placeholder="First Name"
            name="first_name"
            value={profileData.first_name}
            onChange={handleChange}
            className={styles.FormControl}
          />
        </div>
        {errors?.first_name?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group controlId="formLastName" className="mb-3">
        <Form.Label className="d-none">Last Name</Form.Label>
        <div className="d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          <Form.Control
            type="text"
            placeholder="Last Name"
            name="last_name"
            value={profileData.last_name}
            onChange={handleChange}
            className={styles.FormControl}
          />
        </div>
        {errors?.last_name?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group controlId="formBio" className="mb-3">
        <Form.Label className="d-none">Bio</Form.Label>
        <div className="d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faFileAlt} className="me-2" />
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Bio"
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            className={styles.FormControl}
          />
        </div>
        {errors?.bio?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group controlId="formLocation" className="mb-3">
        <Form.Label className="d-none">Location</Form.Label>
        <div className="d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
          <Form.Control
            type="text"
            placeholder="Location"
            name="location"
            value={profileData.location}
            onChange={handleChange}
            className={styles.FormControl}
          />
        </div>
        {errors?.location?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group controlId="formUrlLink" className="mb-3">
        <Form.Label className="d-none">URL Link</Form.Label>
        <div className="d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faLink} className="me-2" />
          <Form.Control
            type="text"
            placeholder="URL Link"
            name="url_link"
            value={profileData.url_link}
            onChange={handleChange}
            className={styles.FormControl}
          />
        </div>
        {errors?.url_link?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group controlId="formContactEmail" className="mb-3">
        <Form.Label className="d-none">Contact Email</Form.Label>
        <div className="d-flex align-items-center mb-2">
          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
          <Form.Control
            type="email"
            placeholder="Contact Email"
            name="contact_email"
            value={profileData.contact_email}
            onChange={handleChange}
            className={styles.FormControl}
          />
        </div>
        {errors?.contact_email?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}
      </Form.Group>

      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="outline-secondary"
          onClick={() => navigate(`/users/${id}/`)}
          className="mx-3 btn-lg"
        >
          Cancel
        </Button>
        <Button variant="outline-primary" className="mx-3 btn-lg" type="submit">
          Save Changes
        </Button>
      </div>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Container
        className={`${styles.Container} d-flex flex-column justify-content-center`}
      >
        <Row>
          <Col className="py-2 p-0 p-md-2" md={12} lg={12}>
            <Form.Group className="text-center">
              <div onClick={() => imageFileRef.current.click()}>
                {imagePreview ? (
                  <figure>
                    <img
                      className={`${styles.Image} ${styles.ImageWrapper}`}
                      src={imagePreview}
                      alt="Profile"
                      rounded="true"
                    />
                  </figure>
                ) : (
                  <Form.Label
                    className="d-flex justify-content-center"
                    htmlFor="image-upload"
                  >
                    <span className={styles.UploadMessage}>
                      Click to upload an image
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
                  <Button
                    variant="outline-light"
                    onClick={() => {
                      setProfileData((prevData) => ({
                        ...prevData,
                        image: '',
                      }));
                      setImagePreview('');
                    }}
                    className="ml-2"
                  >
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
          </Col>
        </Row>
        <Row>
          <Col className="py-2 p-0 p-md-2" md={12} lg={12}>
            {textFields}
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default EditProfilePage;
