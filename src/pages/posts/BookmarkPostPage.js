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
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Avatar from '../../components/Avatar';

const BookmarkPostPage = ({ show, handleClose }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useCurrentUser();

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

  const handleRemove = async (bookmarkId) => {
    try {
      await axiosRes.delete(`/bookmarks/${bookmarkId}/`);
      setBookmarks((prevBookmarks) =>
        prevBookmarks.filter((bookmark) => bookmark.id !== bookmarkId),
      );
      toast.success('Bookmark removed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove bookmark!');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="text-light">
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-light"
      >
        <Modal.Title>Your Bookmarks</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
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
                    <Avatar
                      src={bookmark.post_owner_profile_image}
                      height={30}
                      width={30}
                    />
                    <div className="ms-2">
                      <Link
                        to={`/posts/${bookmark.post}`}
                        className="text-light text-decoration-none"
                        onClick={handleClose}
                      >
                        <h5>{bookmark.post_content?.slice(0, 50)}...</h5>
                      </Link>
                      <p className="mb-0">
                        <small>by {bookmark.post_owner}</small>
                      </p>
                    </div>
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
  );
};

export default BookmarkPostPage;
