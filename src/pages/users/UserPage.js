import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Image,
} from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import nobody from '../../assets/nobody.webp';
import styles from './styles/UserPage.module.css';

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
          <h4 className="mt-2">{user?.username}</h4>
          {currentUser?.id === user.id && (
            <Button
              variant="primary"
              className="mt-1"
              onClick={() => navigate(`/users/${id}/edit`)}
            >
              Edit Profile
            </Button>
          )}
        </Col>
        <Col lg={9} className="mt-4 mt-lg-0">
          <Row className="justify-content-center text-center">
            <Col xs={6} sm={4} className="my-2">
              <h5>{user?.posts_count}</h5>
              <div className={styles.ProfileStats}>Posts</div>
            </Col>
            <Col xs={6} sm={4} className="my-2">
              <h5>{user?.followers_count}</h5>
              <div className={styles.ProfileStats}>Followers</div>
            </Col>
            <Col xs={6} sm={4} className="my-2">
              <h5>{user?.following_count}</h5>
              <div className={styles.ProfileStats}>Following</div>
            </Col>
          </Row>
          <hr />
          <Row className="text-center">
            <Col className="my-2">
              <h5 className="font-weight-bold">{`${user?.first_name} ${user?.last_name}`}</h5>
            </Col>
          </Row>
          <hr />
          <Row className="text-center">
            <Col xs={12} sm={6} className="my-2">
              <strong>About me:</strong>
              <p>{user?.bio}</p>
            </Col>
            <Col xs={12} sm={6} className="my-2">
              <strong>Location:</strong>
              <p>{user?.location}</p>
            </Col>
          </Row>
          <hr />
          <Row className="text-center">
            <Col xs={12} sm={6} className="my-2">
              <strong>URL Link:</strong>
              <p>{user?.url_link}</p>
            </Col>
            <Col xs={12} sm={6} className="my-2">
              <strong>Contact Email:</strong>
              <p>{user?.contact_email}</p>
            </Col>
          </Row>
          <hr />
        </Col>
      </Row>
    </Container>
  );
};

export default UserPage;
