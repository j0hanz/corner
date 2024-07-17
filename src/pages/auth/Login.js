import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import styles from './styles/Login.module.css';

const Login = ({ navigate, handleSignUp }) => {
  const [signInData, setSignInData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignInData({ ...signInData, [name]: value });
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/dj-rest-auth/login/', signInData);
      navigate('/');
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  return (
    <>
      <Form onSubmit={handleSignInSubmit} className="px-3">
        <Form.Group controlId="formBasicUsername">
          <InputGroup className="mt-3">
            <InputGroup.Text className="bg-secondary bg-opacity-10 text-white">
              <FontAwesomeIcon icon={faUser} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Username"
              name="username"
              value={signInData.username}
              onChange={handleChange}
              required
              className="bg-dark rounded-end"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="formBasicPassword" className="mt-3">
          <InputGroup>
            <InputGroup.Text className="bg-secondary bg-opacity-10 text-white">
              <FontAwesomeIcon icon={faLock} />
            </InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={signInData.password}
              onChange={handleChange}
              required
              className="bg-dark rounded-end"
            />
          </InputGroup>
        </Form.Group>
        {errors.non_field_errors && (
          <div className="text-danger">{errors.non_field_errors}</div>
        )}
        <div className="d-flex justify-content-center">
          <Button variant="outline-primary text-white my-3" type="submit">
            Login
          </Button>
        </div>
      </Form>
      <div className={styles.signupContainer}>
        <p className="text-center mb-0">Don't have an account?</p>
        <Button
          variant="outline-light d-block mx-auto mt-2"
          onClick={handleSignUp}
          className={styles.signupButton}
        >
          Sign up now!
        </Button>
      </div>
    </>
  );
};

export default Login;
