import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Spinner, Alert, Image } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';
import nobody from '../../assets/nobody.webp';
import styles from './styles/UserPage.module.css';
import ProfileImageModal from './ProfileImageModal';
import EditProfileModal from './EditProfileModal';
import ChangeUsernameModal from './ChangeUsernameModal';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';
import { ProfileActionsDropdown } from '../../components/Dropdown';
import Asset from '../../components/Asset';
import Post from '../posts/Post';

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangeUsernameModal, setShowChangeUsernameModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: userData }, { data: userPosts }] = await Promise.all([
          axios.get(`/users/${id}/`),
          axios.get(`/posts/?owner__profile=${id}`),
        ]);
        setUser(userData);
        setPosts(userPosts);
        setLoading(false);
      } catch (err) {
        setError('User not found or an error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchMoreData = async () => {
    if (posts.next) {
      try {
        const { data } = await axios.get(posts.next);
        setPosts((prevPosts) => ({
          ...data,
          results: [...prevPosts.results, ...data.results],
        }));
      } catch (err) {
        console.error(err);
      }
    }
  };

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
            src={currentUser?.profile_image || nobody}
            alt={`${user?.first_name} ${user?.last_name}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = nobody;
            }}
          />
          <div className="mt-3">
            {currentUser?.id === user.id && (
              <ProfileActionsDropdown
                handleEditProfile={() => setShowEditProfileModal(true)}
                handleChangeProfileImage={() => setShowProfileImageModal(true)}
                handleChangeUsername={() => setShowChangeUsernameModal(true)}
                handleChangePassword={() => setShowChangePasswordModal(true)}
                handleDeleteAccount={() => setShowDeleteAccountModal(true)}
              />
            )}
          </div>
          <h4 className="mt-2 text-light">{user?.username}</h4>
        </Col>
        <Col lg={9} className="mt-4">
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

      <EditProfileModal
        show={showEditProfileModal}
        handleClose={() => setShowEditProfileModal(false)}
      />
      <ProfileImageModal
        show={showProfileImageModal}
        handleClose={() => setShowProfileImageModal(false)}
        setCurrentUser={setCurrentUser}
        currentUser={currentUser}
      />
      <ChangeUsernameModal
        show={showChangeUsernameModal}
        handleClose={() => setShowChangeUsernameModal(false)}
      />
      <ChangePasswordModal
        show={showChangePasswordModal}
        handleClose={() => setShowChangePasswordModal(false)}
      />
      <DeleteAccountModal
        show={showDeleteAccountModal}
        handleClose={() => setShowDeleteAccountModal(false)}
      />

      <hr />
      <p className="text-center">{user?.username}'s posts</p>
      <hr />
      {posts.results.length ? (
        <InfiniteScroll
          dataLength={posts.results.length}
          next={fetchMoreData}
          hasMore={!!posts.next}
          loader={<Spinner animation="border" variant="primary" />}
        >
          {posts.results.map((post) => (
            <Post key={post.id} {...post} setPosts={setPosts} />
          ))}
        </InfiniteScroll>
      ) : (
        <Asset
          message={`No results found, ${user?.username} hasn't posted yet.`}
        />
      )}
    </Container>
  );
};

export default UserPage;
