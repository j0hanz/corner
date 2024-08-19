import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import Post from './Post';
import CommentCreateForm from '../comments/CommentCreateForm';
import Comment from '../comments/Comment';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMoreData } from '../../utils/utils';
import LoadingSpinnerToast from '../../components/LoadingSpinnerToast';
import styles from './styles/PostPage.module.css';

const PostPage = ({ show, handleClose, postId }) => {
  const [postData, setPostData] = useState({ results: [] });
  const [comments, setComments] = useState({ results: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const currentUser = useCurrentUser();
  const profileImage = currentUser?.profile_image;

  const fetchPostAndComments = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const [postResponse, commentsResponse] = await Promise.all([
        axiosReq.get(`/posts/${postId}`),
        axiosReq.get(`/comments/?post=${postId}`),
      ]);

      setPostData({ results: [postResponse.data] });
      setComments(commentsResponse.data);
    } catch (error) {
      setHasError(true);
      console.error('Error fetching post and comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (show) {
      fetchPostAndComments();
    }
  }, [show, fetchPostAndComments]);

  const renderedComments = useMemo(
    () =>
      comments.results.map((comment) => (
        <Comment
          key={comment.id}
          {...comment}
          setPost={setPostData}
          setComments={setComments}
        />
      )),
    [comments.results, setPostData, setComments]
  );

  return (
    <Container fluid className={`${styles.Container} p-1`}>
      <Modal show={show} onHide={handleClose} centered>
        {isLoading ? (
          <LoadingSpinnerToast
            show
            message="Loading post and comments, please wait..."
            duration={5000}
          />
        ) : hasError ? (
          <div className="d-none">Failed to load post and comments.</div>
        ) : (
          <>
            <Modal.Header
              closeButton
              closeVariant="white"
              className="bg-dark text-light border-0"
            ></Modal.Header>
            <Modal.Body className="bg-dark text-light p-0">
              <Row className="justify-content-center">
                <Col xs="auto">
                  <Post
                    {...postData.results[0]}
                    setPosts={setPostData}
                    postPage
                  />
                  <hr />
                  {currentUser && (
                    <>
                      <CommentCreateForm
                        profile_id={currentUser.profile_id}
                        profile_image={profileImage}
                        post={postId}
                        setPost={setPostData}
                        setComments={setComments}
                      />
                      <hr />
                    </>
                  )}
                  {comments.results.length > 0 ? (
                    <InfiniteScroll
                      dataLength={comments.results.length}
                      next={() => fetchMoreData(comments, setComments)}
                      hasMore={!!comments.next}
                      loader={<LoadingSpinnerToast show />}
                      endMessage={
                        <p className="text-center text-white-50 my-4">
                          No more comments
                        </p>
                      }
                    >
                      {renderedComments}
                    </InfiniteScroll>
                  ) : (
                    <div className="text-center my-4">No comments yet.</div>
                  )}
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default React.memo(PostPage);
