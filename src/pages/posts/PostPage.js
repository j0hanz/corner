import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import Post from './Post';
import CommentCreateForm from '../comments/CommentCreateForm';
import Comment from '../comments/Comment';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import Asset from '../../components/Asset';
import { fetchMoreData } from '../../utils/utils';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });
  const [comments, setComments] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();
  const profileImage = currentUser?.profile_image;

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [{ data: post }, { data: comments }] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
          axiosReq.get(`/comments/?post=${id}`),
        ]);
        setPost({ results: [post] });
        setComments(comments);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPostAndComments();
  }, [id]);

  return (
    <Container>
      <Row className="justify-content-center my-4">
        <Col xs={12} xl={10}>
          {!hasLoaded ? (
            <div className="d-flex justify-content-center align-items-center vh-100">
              <Spinner animation="grow" />
            </div>
          ) : (
            <>
              <Post {...post.results[0]} setPosts={setPost} postPage />
              <hr />
              {currentUser && (
                <CommentCreateForm
                  profile_id={currentUser.profile_id}
                  profileImage={profileImage}
                  post={id}
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
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PostPage;
