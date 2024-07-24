import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Modal,
  Image,
  OverlayTrigger,
  Tooltip,
  Alert,
  Spinner,
} from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosRes } from '../../api/axiosDefaults';
import Avatar from '../../components/Avatar';
import { toast } from 'react-toastify';
import styles from './styles/Post.module.css';
import defaultProfileImage from '../../assets/nobody.webp';
import { EditDeleteDropdown } from '../../components/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';
import PostPage from './PostPage';

const Post = ({
  id,
  owner,
  profile_id,
  profile_image,
  comments_count,
  likes_count,
  like_id,
  content,
  image,
  image_filter,
  updated_at,
  setPosts,
}) => {
  const currentUser = useCurrentUser();
  const isOwner = currentUser?.username === owner;
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = () => navigate(`/posts/${id}/edit`);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosRes.delete(`/posts/${id}/`);
      toast.success('Post deleted successfully!');
      window.location.reload();
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete post!');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post('/likes/', { post: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) =>
          post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post,
        ),
      }));
    } catch (err) {
      console.error('Error liking the post:', err);
      setError('There was an error liking the post');
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) =>
          post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post,
        ),
      }));
    } catch (err) {
      console.error('Error unliking the post:', err);
      setError('There was an error unliking the post');
    }
  };

  const toggleConfirmModal = () => setShowConfirm((prev) => !prev);
  const handleConfirmDelete = () => {
    handleDelete();
    setShowConfirm(false);
  };

  const handleShowPostModal = () => setShowPostModal(true);
  const handleClosePostModal = () => setShowPostModal(false);

  const renderLikeButton = () => {
    if (!currentUser) {
      return (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Sign in to like</Tooltip>}
        >
          <Button className={styles.likeButton}>
            <FontAwesomeIcon className="fa-lg" icon={faThumbsUp} />{' '}
            <span>{likes_count}</span>
          </Button>
        </OverlayTrigger>
      );
    } else if (like_id) {
      return (
        <Button
          onClick={handleUnlike}
          className={`${styles.likeButton} ${styles.liked}`}
        >
          <FontAwesomeIcon className="fa-lg" icon={faThumbsUp} />{' '}
          <span>{likes_count}</span>
        </Button>
      );
    } else {
      return (
        <Button
          className={`${styles.likeButton} ${like_id ? styles.liked : ''}`}
          onClick={handleLike}
        >
          <FontAwesomeIcon className="fa-lg" icon={faThumbsUp} />{' '}
          <span>{likes_count}</span>
        </Button>
      );
    }
  };

  const renderCommentButton = () => {
    return (
      <Button className={styles.commentButton} onClick={handleShowPostModal}>
        <FontAwesomeIcon className="fa-lg" icon={faComment} />{' '}
        <span>{comments_count}</span>
      </Button>
    );
  };

  return (
    <Card className={`mb-5 bg-dark text-white ${styles.PostCard}`}>
      <Card.Body className="d-flex justify-content-between align-items-center p-1">
        <div className="d-flex align-items-center">
          <Avatar
            src={profile_image || defaultProfileImage}
            height={40}
            width={40}
          />
          <Link
            to={`/users/${profile_id}`}
            className="ms-2 text-white text-decoration-none"
          >
            {owner}
          </Link>
        </div>
        {isOwner && (
          <EditDeleteDropdown
            handleEdit={handleEdit}
            handleDelete={toggleConfirmModal}
          />
        )}
      </Card.Body>
      <hr />
      <Card.Text className={`text-center mb-4 ${styles[image_filter]}`}>
        {content}
      </Card.Text>
      {image && <Image src={image} fluid />}
      <Card.Footer
        className={`d-flex justify-content-between align-items-center ${styles.greyFooter}`}
      >
        <div>
          {renderLikeButton()}
          {renderCommentButton()}
        </div>
        <span className="text-white-50 me-1">{updated_at}</span>
      </Card.Footer>
      {error && (
        <Alert variant="danger" className="mt-3">
          <p>{error}</p>
        </Alert>
      )}
      <Modal
        show={showConfirm}
        centered
        className="text-light"
        onHide={toggleConfirmModal}
      >
        <Modal.Header
          className="bg-dark text-white"
          closeButton
          closeVariant="white"
        >
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <p>Are you sure you want to delete this post?</p>
          <div className={styles.buttonWrapper}>
            <Button
              variant="outline-secondary"
              onClick={toggleConfirmModal}
              className={styles.leftButton}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="outline-danger"
              className={styles.rightButton}
              onClick={handleConfirmDelete}
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
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <PostPage
        show={showPostModal}
        handleClose={handleClosePostModal}
        postId={id}
      />
    </Card>
  );
};

export default Post;
