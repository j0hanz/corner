import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Image } from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosRes } from '../../api/axiosDefaults';
import Avatar from '../../components/Avatar';
import { toast } from 'react-toastify';
import styles from './styles/Post.module.css';
import defaultProfileImage from '../../assets/nobody.webp';
import { EditDeleteDropdown } from '../../components/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';
import Comment from '../comments/Comment';

const Post = ({
  id,
  owner,
  profile_id,
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
  const [profile, setProfile] = useState({
    image: defaultProfileImage,
  });
  const [comments, setComments] = useState({ results: [] });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosRes.get(`/api/profiles/${profile_id}/`);
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [profile_id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axiosRes.get(`/api/posts/${id}/comments/`);
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [id]);

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
    <Card className={`mb-5 bg-dark text-white ${styles.PostCard}`}>
      <Card.Body className="d-flex justify-content-between align-items-center p-2">
        <div className="d-flex align-items-center">
          <Avatar
            src={profile.image || defaultProfileImage}
            height={40}
            width={40}
          />
          <Link
            to={`/profiles/${profile_id}`}
            className="ms-2 text-white text-decoration-none"
          >
            {owner}
          </Link>
        </div>
        {isOwner && (
          <EditDeleteDropdown
            handleEdit={handleEdit}
            handleDelete={handleShowConfirm}
          />
        )}
      </Card.Body>
      <Card.Text className={`text-center ${styles[image_filter]}`}>
        {content}
      </Card.Text>
      {image && <Image src={image} fluid />}
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
          <Button className={styles.commentButton} size="sm">
            <Link
              to={`/posts/${id}`}
              className="text-white text-decoration-none px-2"
            >
              <FontAwesomeIcon className="mx-1" icon={faComment} />
              Comments {comments_count}
            </Link>
          </Button>
        </div>
        <span className="text-white-50 mx-1">{updated_at}</span>
      </Card.Footer>
      <Modal show={showConfirm} onHide={handleCancelConfirm}>
        <Modal.Header
          className="bg-dark text-white"
          closeButton
          closeVariant="white"
        >
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <p>Are you sure you want to delete this post?</p>
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={handleCancelConfirm}
              className="me-2"
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Render comments */}
      {comments.results?.map((comment) => (
        <Comment
          key={comment.id}
          {...comment}
          setPost={setPosts}
          setComments={setComments}
        />
      ))}
    </Card>
  );
};

export default Post;
