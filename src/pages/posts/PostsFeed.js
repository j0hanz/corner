import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Post from './Post';
import { axiosReq } from '../../api/axiosDefaults';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMagnifyingGlass,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons';
import PostCreateForm from './PostCreateForm';
import LoadingSpinnerToast from '../../components/LoadingSpinnerToast';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMoreData } from '../../utils/utils';
import styles from './styles/PostsFeed.module.css';
import noResults from '../../assets/noResults.png';
import BookmarkPostPage from './BookmarkPostPage';
import PopularProfiles from '../users/PopularProfiles';

const PostsFeed = ({ message, filter = '' }) => {
  const [posts, setPosts] = useState({ results: [], next: null });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const currentUser = useCurrentUser();
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/?${filter}search=${query}`);
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(fetchPosts, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  return (
    <Container className="px-0">
      <Row className="justify-content-center mx-auto">
        <Col xs="auto" className="text-center">
          <Button variant="outline-light" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} className="fa-lg" />
          </Button>
        </Col>
        <Col xs="auto" className="text-center">
          <Button
            variant="outline-light"
            onClick={() => setShowBookmarkModal(true)}
          >
            <FontAwesomeIcon className="fa-lg" icon={faBookmark} />
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
      <PopularProfiles />
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
          <div className="mt-5 d-flex flex-column align-items-center justify-content-center text-white opacity-50">
            <img
              src={noResults}
              alt="No results found"
              width={75}
              height={75}
            />
            <p className="mt-2">{message}</p>
          </div>
        )
      )}
      <PostCreateForm
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
      <BookmarkPostPage
        show={showBookmarkModal}
        handleClose={() => setShowBookmarkModal(false)}
      />
    </Container>
  );
};

export default PostsFeed;
