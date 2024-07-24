import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Alert, Button } from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Post from './Post';
import { axiosReq } from '../../api/axiosDefaults';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import PostCreateForm from './PostCreateForm';
import LoadingSpinnerToast from '../../components/LoadingSpinnerToast';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMoreData } from '../../utils/utils';
import styles from './styles/PostsFeed.module.css';

const PostsFeed = ({ message, filter = '' }) => {
  const [posts, setPosts] = useState({ results: [], next: null });
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
        console.error(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(fetchPosts, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Container className="px-0">
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
      <Row className={`justify-content-center ${styles.searchBarContainer}`}>
        <Col xs={12} xl={10} className={styles.searchBarCol}>
          <Form
            onSubmit={(event) => event.preventDefault()}
            className="position-relative"
          >
            <Form.Label className="d-none">Search</Form.Label>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={styles.searchIcon}
            />
            <Form.Control
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              placeholder="Search: Users, Tags or Posts"
              className={`text-bold ${styles.searchBar}`}
            />
          </Form>
        </Col>
      </Row>
      {!hasLoaded && (
        <LoadingSpinnerToast
          show={true}
          message="Loading posts, please wait..."
          duration={5000}
        />
      )}
      {hasLoaded && posts.results.length > 0 ? (
        <InfiniteScroll
          dataLength={posts.results.length}
          next={() => fetchMoreData(posts, setPosts)}
          hasMore={!!posts.next}
          loader={
            <LoadingSpinnerToast
              show={true}
              message="Loading more posts..."
              duration={5000}
            />
          }
        >
          {posts.results.map((post) => (
            <div key={post.id}>
              <Post {...post} setPosts={setPosts} />
            </div>
          ))}
        </InfiniteScroll>
      ) : (
        hasLoaded && (
          <div>
            <Alert variant="info">{message}</Alert>
          </div>
        )
      )}
      <PostCreateForm show={showModal} handleClose={handleCloseModal} />
    </Container>
  );
};

export default PostsFeed;
