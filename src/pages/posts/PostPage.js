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
  const [post, setPost] = useState({ results: [] });
  const [comments, setComments] = useState({ results: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const currentUser = useCurrentUser();
  const profileImage = currentUser?.profile_image;

  const fetchPostAndComments = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [{ data: post }, { data: comments }] = await Promise.all([
        axiosReq.get(`/posts/${postId}`),
        axiosReq.get(`/comments/?post=${postId}`),
      ]);
      setPost({ results: [post] });
      setComments(comments);
    } catch (err) {
      setError(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (show) {
      fetchPostAndComments();
    }
  }, [show, fetchPostAndComments]);

  const memoizedComments = useMemo(
    () =>
      comments.results.map((comment) => (
        <Comment
          key={comment.id}
          {...comment}
          setPost={setPost}
          setComments={setComments}
        />
      )),
    [comments.results, setPost, setComments],
  );

  return (
    <Modal show={show} onHide={handleClose} centered>
      {loading ? (
        <LoadingSpinnerToast
          show={true}
          message="Loading post and comments, please wait..."
          duration={5000}
        />
      ) : error ? (
        <div className="d-none">Failed to load post and comments.</div>
      ) : (
        <>
          <Modal.Header
            closeButton
            closeVariant="white"
            className="bg-dark text-light"
          >
            <Modal.Title>Post</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light p-0">
            <Container fluid className={`${styles.Container} p-1`}>
              <Row className="justify-content-center">
                <Col xs={12} xl={10}>
                  <Post {...post.results[0]} setPosts={setPost} postPage />
                  <hr />
                  {currentUser && (
                    <>
                      <CommentCreateForm
                        profile_id={currentUser.profile_id}
                        profileImage={profileImage}
                        post={postId}
                        setPost={setPost}
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
                      loader={<LoadingSpinnerToast show={true} />}
                      endMessage={
                        <p className="text-center text-white-50 my-4">
                          No more comments
                        </p>
                      }
                    >
                      {memoizedComments}
                    </InfiniteScroll>
                  ) : (
                    <div className="text-center my-4">No comments yet.</div>
                  )}
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </>
      )}
    </Modal>
  );
};

export default React.memo(PostPage);
