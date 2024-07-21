import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap'; // Removed Alert import
import { axiosReq } from '../../api/axiosDefaults';
import Post from './Post';
import CommentCreateForm from '../comments/CommentCreateForm'; // Ensure this path is correct
import Comment from '../comments/Comment'; // Ensure this path is correct

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });
  const [comments, setComments] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

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
              <CommentCreateForm
                post={post.results[0].id}
                setPost={setPost}
                setComments={setComments}
                profileImage={post.results[0].profile_image}
                profile_id={post.results[0].profile_id}
              />
              <hr />
              {comments.results.length ? (
                comments.results.map((comment) => (
                  <Comment
                    key={comment.id}
                    {...comment}
                    setPost={setPost}
                    setComments={setComments}
                  />
                ))
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
