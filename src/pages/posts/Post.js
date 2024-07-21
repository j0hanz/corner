import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Image } from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosRes } from '../../api/axiosDefaults';
import Avatar from '../../components/Avatar';
import { toast } from 'react-toastify';
import styles from './styles/Post.module.css';

const Post = ({
  id,
  owner,
  profile_id,
  profile_image,
  comments_count,
  likes_count,
  like_id,
  title,
  location,
  content,
  image,
  updated_at,
  setPosts,
}) => {
  const currentUser = useCurrentUser();
  const isOwner = currentUser?.username === owner;
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEdit = () => navigate(`/posts/${id}/edit`);

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      toast.success('Post deleted successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete post!');
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
      console.error(err);
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
      console.error(err);
    }
  };

  const handleShowConfirm = () => setShowConfirm(true);
  const handleCancelConfirm = () => setShowConfirm(false);
  const handleConfirmDelete = () => {
    handleDelete();
    setShowConfirm(false);
  };

  return (
    <Card className={`mb-3 bg-dark text-white ${styles.PostCard}`}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Avatar src={profile_image} height={40} />
          <Link
            to={`/profiles/${profile_id}`}
            className="ms-2 text-white text-decoration-none"
          >
            {owner}
          </Link>
        </div>
        {isOwner && (
          <div>
            <Button variant="outline-primary" size="sm" onClick={handleEdit}>
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleShowConfirm}
              className="ms-3"
            >
              Delete
            </Button>
          </div>
        )}
      </Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2">{location}</Card.Subtitle>
        <Card.Text>{content}</Card.Text>
        {image && <Image src={image} fluid />}
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={like_id ? handleUnlike : handleLike}
          >
            {like_id ? 'Unlike' : 'Like'} ({likes_count})
          </Button>
          <Link
            to={`/posts/${id}`}
            className="ms-3 text-white text-decoration-none"
          >
            Comments ({comments_count})
          </Link>
        </div>
        <small className="text-muted">{updated_at}</small>
      </Card.Footer>
      <Modal show={showConfirm} onHide={handleCancelConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelConfirm}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default Post;
