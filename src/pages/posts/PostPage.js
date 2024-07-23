import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Modal } from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import Post from './Post';
import CommentCreateForm from '../comments/CommentCreateForm';
import Comment from '../comments/Comment';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import Asset from '../../components/Asset';
import { fetchMoreData } from '../../utils/utils';
import styles from './styles/PostPage.module.css';

const PostPage = ({ show, handleClose, postId }) => {
  const [post, setPost] = useState({ results: [] });
  const [comments, setComments] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();
  const profileImage = currentUser?.profile_image;

  useEffect(() => {
    if (show) {
      const fetchPostAndComments = async () => {
        try {
          const [{ data: post }, { data: comments }] = await Promise.all([
            axiosReq.get(`/posts/${postId}`),
            axiosReq.get(`/comments/?post=${postId}`),
          ]);
          setPost({ results: [post] });
          setComments(comments);
          setHasLoaded(true);
        } catch (err) {
          console.log(err);
        }
      };

      fetchPostAndComments();
    }
  }, [show, postId]);

  return (
    <Container className={styles.Container}>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          closeVariant="white"
          className="bg-dark text-light"
        >
          <Modal.Title>Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light p-0">
          {!hasLoaded ? (
            <div className="d-flex justify-content-center align-items-center vh-100">
              <Spinner animation="grow" />
            </div>
          ) : (
            <>
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
                      loader={<Asset spinner />}
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
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PostPage;
