import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Button,
  Modal,
  Alert,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosRes } from '../../api/axiosDefaults';
import Avatar from '../../components/Avatar';
import CommentEditForm from './CommentEditForm';
import { EditDeleteDropdown } from '../../components/Dropdown';
import styles from './styles/Comment.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/free-solid-svg-icons';

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

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleDelete = async () => {
    if (showModal) {
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
      } catch (err) {
        setError('There was an error deleting the comment');
      }
    }
    handleCloseModal();
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

  !like_id && !currentUser ? (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Sign in to like</Tooltip>}
    >
      <div>
        <FontAwesomeIcon icon={faThumbsUp} /> <span>{likes_count}</span>
      </div>
    </OverlayTrigger>
  ) : like_id && currentUser ? (
    <div onClick={handleUnlike}>
      <FontAwesomeIcon icon={faThumbsUpSolid} /> <span>{likes_count}</span>
    </div>
  ) : (
    <div onClick={handleLike}>
      <FontAwesomeIcon icon={faThumbsUp} /> <span>{likes_count}</span>
    </div>
  );

  return (
    <Card className={`mb-5 bg-dark text-white ${styles.CommentCard}`}>
      <Card.Body className="d-flex justify-content-between align-items-center p-2">
        <div className="d-flex align-items-center">
          <Avatar src={profile_image} height={40} width={40} />
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
        <Card.Text className="text-center">{content}</Card.Text>
      )}
      <Card.Footer
        className={`d-flex justify-content-between align-items-center ${styles.greyFooter}`}
      >
        <div>
          <Button
            className={`${styles.likeButton} px-3 ${
              like_id ? styles.liked : ''
            }`}
            size="sm"
            onClick={like_id ? handleUnlike : handleLike}
          >
            <FontAwesomeIcon className="mx-1" icon={faThumbsUp} />
            {like_id ? 'Unlike' : 'Like'} {likes_count}
          </Button>
        </div>
        <span className="text-white-50 mx-1">{updated_at}</span>
      </Card.Footer>
      {error && (
        <Alert variant="danger" className="mt-3">
          <p>{error}</p>
        </Alert>
      )}
      <Modal show={showModal} onHide={handleCloseModal}>
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
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default Comment;
