import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Spinner,
  Alert,
  ListGroup,
  Container,
} from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosReq, axiosRes } from '../../api/axiosDefaults';
import styles from './styles/BookmarkPostPage.module.css';
import Avatar from '../../components/Avatar';
import PostPage from './PostPage';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const BookmarkPostPage = ({ show, handleClose }) => {
  // State to manage bookmarks, loading state, error state, and post page visibility
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useCurrentUser();

  const [showPostPage, setShowPostPage] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Handle showing the post page modal
  const handleShowPostPage = (postId) => {
    setSelectedPostId(postId);
    setShowPostPage(true);
    handleClose();
  };

  // Handle closing the post page modal
  const handleClosePostPage = () => {
    setShowPostPage(false);
    setSelectedPostId(null);
  };

  // Fetch bookmarks when the component mounts or when the modal is shown
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const { data } = await axiosReq.get('/bookmarks/');
        setBookmarks(data.results);
      } catch (err) {
        console.error(err);
        setError('There was an error fetching bookmarks.');
      } finally {
        setLoading(false);
      }
    };

    if (show && currentUser) {
      fetchBookmarks();
    }
  }, [show, currentUser]);

  // Handle removing a bookmark
  const handleRemove = async (bookmarkId) => {
    try {
      await axiosRes.delete(`/bookmarks/${bookmarkId}/`);
      setBookmarks((prevBookmarks) =>
        prevBookmarks.filter((bookmark) => bookmark.id !== bookmarkId)
      );
      toast.success('Bookmark removed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove bookmark!');
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered className="text-light">
        <Modal.Header
          closeButton
          closeVariant="white"
          className="bg-dark text-light"
        >
          <Modal.Title>Your Bookmarks</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light p-2">
          <Container className={styles.Container}>
            {loading && (
              <div className="text-center">
                <Spinner animation="border" role="status" />
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && bookmarks.length === 0 && (
              <p>You have no bookmarks.</p>
            )}
            {!loading && bookmarks.length > 0 && (
              <ListGroup variant="flush">
                {bookmarks.map((bookmark) => (
                  <ListGroup.Item
                    key={bookmark.id}
                    className="bg-dark text-light d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center">
                      <Link
                        className="text-decoration-none"
                        to={`/users/${bookmark.post_owner_profile_id}`}
                      >
                        <Avatar
                          src={bookmark.post_owner_profile_image}
                          height={30}
                          width={30}
                        />
                        <div className="text-center">
                          <em>
                            <small className="text-white-50">
                              {bookmark.post_owner}
                            </small>
                          </em>
                        </div>
                      </Link>
                      <button
                        className="btn btn-link text-light text-decoration-none p-0 ms-2"
                        onClick={() => handleShowPostPage(bookmark.post)}
                      >
                        <h5>{bookmark.post_content?.slice(0, 50)}...</h5>
                      </button>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemove(bookmark.id)}
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Container>
        </Modal.Body>
      </Modal>
      <PostPage
        show={showPostPage}
        handleClose={handleClosePostPage}
        postId={selectedPostId}
      />
    </>
  );
};

export default BookmarkPostPage;
