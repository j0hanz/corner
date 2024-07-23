import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Alert,
  Button,
} from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Post from './Post';
import { axiosReq } from '../../api/axiosDefaults';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PostCreateForm from './PostCreateForm'; // Adjust the import path as needed

function PostsFeed({ message, filter = '' }) {
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/?${filter}search=${query}`);
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Container className="px-1">
      <Row className="justify-content-center">
        <Col xs={12} xl={10} className="text-center">
          <Button
            variant="outline-light"
            className="my-1"
            onClick={handleShowModal}
          >
            <FontAwesomeIcon icon={faPlus} className="fa-lg" />
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center my-4">
        <Col xs={12} xl={10}>
          <Form onSubmit={(event) => event.preventDefault()}>
            <Form.Label className="d-none">Search</Form.Label>
            <Form.Control
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              placeholder="Search: Users, Tags, Title"
            />
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} xl={10} className="text-center">
          {!hasLoaded ? (
            <div className="d-flex justify-content-center align-items-center vh-100">
              <Spinner animation="grow" />
            </div>
          ) : posts.results.length > 0 ? (
            posts.results.map((post) => (
              <Post key={post.id} {...post} setPosts={setPosts} />
            ))
          ) : (
            <div className="d-flex justify-content-center">
              <Alert variant="info">{message}</Alert>
            </div>
          )}
        </Col>
      </Row>
      <PostCreateForm show={showModal} handleClose={handleCloseModal} />
    </Container>
  );
}

export default PostsFeed;
