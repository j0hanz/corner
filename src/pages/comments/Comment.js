import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Modal,
  Button,
  Alert,
  OverlayTrigger,
  Tooltip,
  Dropdown,
} from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosRes } from '../../api/axiosDefaults';
import Avatar from '../../components/Avatar';
import CommentEditForm from './CommentEditForm';
import styles from './styles/Comment.module.css';

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setPost,
    setComments,
    onDelete,
  } = props;

  const { like_id, likes_count } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

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
    onDelete();
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post('/likes/', { comment: id });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
                ...comment,
                likes_count: comment.likes_count + 1,
                like_id: data.id,
              }
            : comment;
        }),
      }));
    } catch (err) {
      setError('There was an error liking the comment');
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
                ...comment,
                likes_count: comment.likes_count - 1,
                like_id: null,
              }
            : comment;
        }),
      }));
    } catch (err) {
      setError('There was an error unliking the comment');
    }
  };

  let likeButtonContent = null;
  if (!like_id && !currentUser) {
    likeButtonContent = (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>Sign in to like</Tooltip>}
      >
        <div>
          <i className="fa-regular fa-thumbs-up"></i> <span>{likes_count}</span>
        </div>
      </OverlayTrigger>
    );
  } else if (!like_id && currentUser) {
    likeButtonContent = (
      <div onClick={handleLike}>
        <i className="fa-regular fa-thumbs-up"></i> <span>{likes_count}</span>
      </div>
    );
  } else if (like_id && currentUser) {
    likeButtonContent = (
      <div onClick={handleUnlike}>
        <i className="fa-solid fa-thumbs-up"></i>
        <span>{likes_count}</span>
      </div>
    );
  }

  return (
    <Card
      className={`mt-3 mb-1 pb-4 text-center bg-dark text-white ${styles.CommentCard}`}
    >
      <Row className="d-flex">
        <Col className="d-flex align-items-center mt-2">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={30} />
          </Link>
          <span className="ms-2">{owner}</span>
          {likeButtonContent}
          <div className="flex-grow-1"></div>
          <span className="text-muted me-2">{updated_at}</span>
          {is_owner && (
            <Dropdown className="ms-auto">
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                ...
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setShowEditForm(true)}>
                  Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={handleShowModal}>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          {showEditForm ? (
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              content={content}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{content}</p>
          )}
        </Col>
      </Row>

      {error && (
        <Row className="mt-3">
          <Col className="text-center">
            <Alert variant="danger">
              <p>{error}</p>
            </Alert>
          </Col>
        </Row>
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
