import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Image } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import { axiosReq } from '../../api/axiosDefaults';
import styles from './styles/UserPage.module.css';
import ProfileImageModal from './ProfileImageModal';
import EditProfileModal from './EditProfileModal';
import ChangeUsernameModal from './ChangeUsernameModal';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';
import { ProfileActionsDropdown } from '../../components/Dropdown';
import Post from '../posts/Post';
import noResults from '../../assets/noResults.png';

const UserPage = () => {
  const { id } = useParams();
  const currentUser = useContext(CurrentUserContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modals, setModals] = useState({
    profileImage: false,
    editProfile: false,
    changeUsername: false,
    changePassword: false,
    deleteAccount: false,
  });

  const is_owner = currentUser?.username === user?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, userPostsResponse] = await Promise.all([
          axiosReq.get(`/users/${id}/`),
          axiosReq.get(`/posts/?owner__profile=${id}`),
        ]);
        setUser(userResponse.data || null);
        setPosts(userPostsResponse.data || { results: [] });
      } catch (err) {
        setError('User not found or an error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchMoreData = async () => {
    if (posts.next) {
      try {
        const { data } = await axiosReq.get(posts.next);
        setPosts((prevPosts) => ({
          ...data,
          results: [...(prevPosts?.results || []), ...(data?.results || [])],
        }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleModalToggle = (modalName, value) => {
    setModals((prevModals) => ({
      ...prevModals,
      [modalName]: value,
    }));
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

  if (!user || !user.id) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">User not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="px-1">
      <Row className="justify-content-center mx-auto">
        <Col lg={3} className="d-flex flex-column align-items-center">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={user?.image_url}
            alt={`${user?.first_name} ${user?.last_name}`}
            onClick={
              is_owner ? () => handleModalToggle('profileImage', true) : null
            }
          />
          <div className="my-2 text-white">{user?.owner}</div>

          {is_owner && (
            <ProfileActionsDropdown
              handleEditProfile={() => handleModalToggle('editProfile', true)}
              handleChangeProfileImage={() =>
                handleModalToggle('profileImage', true)
              }
              handleChangeUsername={() =>
                handleModalToggle('changeUsername', true)
              }
              handleChangePassword={() =>
                handleModalToggle('changePassword', true)
              }
              handleDeleteAccount={() =>
                handleModalToggle('deleteAccount', true)
              }
            />
          )}

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

      {is_owner && (
        <>
          <EditProfileModal
            show={modals.editProfile}
            handleClose={() => handleModalToggle('editProfile', false)}
          />
          <ProfileImageModal
            show={modals.profileImage}
            handleClose={() => handleModalToggle('profileImage', false)}
          />
          <ChangeUsernameModal
            show={modals.changeUsername}
            handleClose={() => handleModalToggle('changeUsername', false)}
          />
          <ChangePasswordModal
            show={modals.changePassword}
            handleClose={() => handleModalToggle('changePassword', false)}
          />
          <DeleteAccountModal
            show={modals.deleteAccount}
            handleClose={() => handleModalToggle('deleteAccount', false)}
          />
        </>
      )}

      <Row className="mt-4">
        <Col className="d-flex text-center justify-content-center">
          <strong className="text-center text-white py-2 mb-0">
            {user?.owner}'s posts
          </strong>
        </Col>
      </Row>
      {posts.results.length ? (
        <InfiniteScroll
          dataLength={posts.results.length}
          next={fetchMoreData}
          hasMore={!!posts.next}
          loader={
            <Spinner
              animation="border"
              variant="primary"
              className="my-4 d-block mx-auto"
            />
          }
        >
          {posts.results.map((post) => (
            <Post
              key={post.id}
              {...post}
              setPosts={setPosts}
              className="mb-4"
            />
          ))}
        </InfiniteScroll>
      ) : (
        <div className="mt-5 d-flex flex-column align-items-center justify-content-center text-white opacity-50">
          <img src={noResults} alt="No results found" width={75} height={75} />
          <div className="mt-4">No results found...</div>
          <p>{user?.owner} hasn't posted yet.</p>
        </div>
      )}
    </Container>
  );
};

export default UserPage;
