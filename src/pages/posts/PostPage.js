import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
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

  if (!hasLoaded) {
    return <div>Loading...</div>; // Replace with Asset spinner if needed
  }

  return (
    <Row className="h-100 mx-auto">
      <Col className="d-flex flex-column justify-content-center mx-auto">
        <Post {...post.results[0]} setPosts={setPost} postPage />
        {/* Comments section can be added here */}
      </Col>
    </Row>
  );
};

export default PostPage;
