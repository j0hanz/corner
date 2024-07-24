import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Button,
  Modal,
  Alert,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosRes } from '../../api/axiosDefaults';
import Avatar from '../../components/Avatar';
import CommentEditForm from './CommentEditForm';
import { EditDeleteDropdown } from '../../components/Dropdown';
import styles from './styles/Comment.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const Comment = ({
  profile_id,
  profile_image,
  owner,
  updated_at,
  content,
  id,
  setPost,
  setComments,
  like_id,
  likes_count,
}) => {
  const currentUser = useCurrentUser();
  const isOwner = currentUser?.username === owner;

  const [showEditForm, setShowEditForm] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosRes.delete(`/comments/${id}/`);
      setPost((prevPost) => ({
        results: [
          {
            ...prevPost.results[0],
            comments_count: prevPost.results[0].comments_count - 1,
          },
        ],
      }));
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
      handleCloseModal();
    } catch (err) {
      setError('There was an error deleting the comment');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post('/likes/', { comment: id });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) =>
          comment.id === id
            ? {
                ...comment,
                likes_count: comment.likes_count + 1,
                like_id: data.id,
              }
            : comment,
        ),
      }));
    } catch (err) {
      console.error('Error liking the comment:', err);
      setError('There was an error liking the comment');
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) =>
          comment.id === id
            ? {
                ...comment,
                likes_count: comment.likes_count - 1,
                like_id: null,
              }
            : comment,
        ),
      }));
    } catch (err) {
      console.error('Error unliking the comment:', err);
      setError('There was an error unliking the comment');
    }
  };

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

  return (
    <Card className={`mb-5 text-white ${styles.CommentCard}`}>
      <Card.Body className="d-flex justify-content-between align-items-center p-2">
        <div className="d-flex align-items-center">
          <Avatar src={profile_image} height={30} width={30} />
          <Link
            to={`/profiles/${profile_id}`}
            className="ms-2 text-white text-decoration-none"
          >
            {owner}
          </Link>
        </div>
        {isOwner && (
          <EditDeleteDropdown
            handleEdit={() => setShowEditForm(true)}
            handleDelete={handleShowModal}
          />
        )}
      </Card.Body>
      {showEditForm ? (
        <CommentEditForm
          id={id}
          profile_id={profile_id}
          content={content}
          setComments={setComments}
          setShowEditForm={setShowEditForm}
        />
      ) : (
        <>
          <hr />
          <Card.Text className="text-center">{content}</Card.Text>
        </>
      )}
      <Card.Footer
        className={`d-flex justify-content-between align-items-center ${styles.greyFooter}`}
      >
        <div>{renderLikeButton()}</div>
        <span className="text-white-50 mx-1">{updated_at}</span>
      </Card.Footer>
      {error && (
        <Alert variant="danger" className="mt-3">
          <p>{error}</p>
        </Alert>
      )}
      <Modal show={showModal} centered onHide={handleCloseModal}>
        <Modal.Header
          className="bg-dark text-white"
          closeButton
          closeVariant="white"
        >
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <p>Are you sure you want to delete this comment?</p>
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              className="me-2"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    style={{ color: 'white' }}
                  />{' '}
                  <span className="text-light">Deleting...</span>
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default Comment;
