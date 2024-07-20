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
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="px-3 mx-auto text-center justify-content-center">
        <Col
          lg={3}
          className="d-flex flex-column align-items-center justify-content-center"
        >
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={user?.image || nobody}
            alt={`${user?.first_name} ${user?.last_name}`}
          />
          <div className={styles.ProfileOwner}>{user?.username}</div>
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
        <Col className="mt-2">
          <Row className="justify-content-center no-gutters">
            <Col xs={4} className="my-2 text-center">
              <div className="h5">{user?.posts_count}</div>
              <div className={styles.ProfileStats}>Posts</div>
            </Col>
            <Col xs={4} className="my-2 text-center">
              <div className="h5">{user?.followers_count}</div>
              <div className={styles.ProfileStats}>Followers</div>
            </Col>
            <Col xs={4} className="my-2 text-center">
              <div className="h5">{user?.following_count}</div>
              <div className={styles.ProfileStats}>Following</div>
            </Col>
          </Row>
          <hr />
          <Row className="justify-content-center">
            <Col className="my-2 text-center">
              <div className="font-weight-bold">
                {user?.first_name} {user?.last_name}
              </div>
            </Col>
            <Col className="my-2 text-center">
              <div>{user?.country}</div>
            </Col>
          </Row>
          <hr />
          <Row className="w-100 justify-content-center">
            <Col xs={12} sm={4} className="my-2 text-center">
              <div>About me:</div>
              <div>{user?.bio}</div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default UserPage;
