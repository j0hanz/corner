import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import Post from './Post';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: post } = await axiosReq.get(`/posts/${id}`);
        setPost({ results: [post] });
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
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
            <Post {...post.results[0]} setPosts={setPost} postPage />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PostPage;
