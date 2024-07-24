import React, { useState, useEffect, useCallback } from 'react';
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
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();
  const profileImage = currentUser?.profile_image;

  const fetchPostAndComments = useCallback(async () => {
    try {
      setHasLoaded(false);
      const [{ data: post }, { data: comments }] = await Promise.all([
        axiosReq.get(`/posts/${postId}`),
        axiosReq.get(`/comments/?post=${postId}`),
      ]);
      setPost({ results: [post] });
      setComments(comments);
      setHasLoaded(true);
    } catch (err) {
      console.error(err);
    }
  }, [postId]);

  useEffect(() => {
    if (show) {
      fetchPostAndComments();
    }
  }, [show, fetchPostAndComments]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      {!hasLoaded && (
        <LoadingSpinnerToast
          show={true}
          message="Loading post and comments, please wait..."
          duration={5000}
        />
      )}
      {hasLoaded && (
        <>
          <Modal.Header
            closeButton
            closeVariant="white"
            className="bg-dark text-light"
          >
            <Modal.Title>Post</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light p-0">
            <Container className={styles.Container}>
              <Row className="justify-content-center my-4">
                <Col xs={12} xl={10}>
                  <Post {...post.results[0]} setPosts={setPost} postPage />
                  <hr />
                  {currentUser && (
                    <CommentCreateForm
                      profile_id={currentUser.profile_id}
                      profileImage={profileImage}
                      post={postId}
                      setPost={setPost}
                      setComments={setComments}
                    />
                  )}
                  <hr />
                  {comments.results.length ? (
                    <InfiniteScroll
                      dataLength={comments.results.length}
                      next={() => fetchMoreData(comments, setComments)}
                      hasMore={!!comments.next}
                    >
                      {comments.results.map((comment) => (
                        <Comment
                          key={comment.id}
                          {...comment}
                          setPost={setPost}
                          setComments={setComments}
                        />
                      ))}
                    </InfiniteScroll>
                  ) : (
                    <div className="text-center">No comments yet.</div>
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

export default PostPage;
