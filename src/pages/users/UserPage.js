import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Spinner, Alert, Image } from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import nobody from '../../assets/nobody.webp';
import styles from './styles/UserPage.module.css';
import { ProfileActionsDropdown } from '../../components/Dropdown';

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/users/${id}/`);
        setUser(data);
      } catch (err) {
        setError('User not found or an error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={3} className="d-flex flex-column align-items-center">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={user?.image || nobody}
            alt={`${user?.first_name} ${user?.last_name}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = nobody;
            }}
          />
          <div className="mt-3">
            {currentUser?.id === user.id && (
              <ProfileActionsDropdown
                handleEditProfile={() => navigate(`/users/${id}/edit`)}
                handleChangeProfileImage={() =>
                  navigate(`/users/${id}/change-profile-image`)
                }
                handleChangeUsername={() =>
                  navigate(`/users/${id}/change-username`)
                }
                handleChangePassword={() =>
                  navigate(`/users/${id}/change-password`)
                }
                handleDeleteAccount={() =>
                  navigate(`/users/${id}/delete-account`)
                }
              />
            )}
          </div>

          <h4 className="mt-2 text-light">{user?.username}</h4>
        </Col>
        <Col lg={9} className="mt-4 ">
          <Row className="justify-content-center text-center">
            <Col className="my-2">
              <h5 className="text-light">{user?.posts_count}</h5>
              <div className={styles.ProfileStats}>Posts</div>
            </Col>
            <Col className="my-2">
              <h5 className="text-light">{user?.followers_count}</h5>
              <div className={styles.ProfileStats}>Followers</div>
            </Col>
            <Col className="my-2">
              <h5 className="text-light">{user?.following_count}</h5>
              <div className={styles.ProfileStats}>Following</div>
            </Col>
          </Row>
          <hr className="border-secondary" />
          <Row className="text-center">
            <Col className="my-2">
              <h5 className="font-weight-bold text-light">{`${user?.first_name} ${user?.last_name}`}</h5>
            </Col>
          </Row>
          <hr className="border-secondary" />
          <Row className="text-center">
            <Col xs={12} sm={6} className="my-2">
              <strong className="text-light">About me:</strong>
              <p className="text-light">{user?.bio}</p>
            </Col>
            <Col xs={12} sm={6} className="my-2">
              <strong className="text-light">Location:</strong>
              <p className="text-light">{user?.location}</p>
            </Col>
          </Row>
          <hr className="border-secondary" />
          <Row className="text-center">
            <Col xs={12} sm={6} className="my-2">
              <strong className="text-light">URL Link:</strong>
              <p className="text-light">{user?.url_link}</p>
            </Col>
            <Col xs={12} sm={6} className="my-2">
              <strong className="text-light">Contact Email:</strong>
              <p className="text-light">{user?.contact_email}</p>
            </Col>
          </Row>
          <hr className="border-secondary" />
        </Col>
      </Row>
    </Container>
  );
};

export default UserPage;
