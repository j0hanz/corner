import React, { useState } from 'react';
import { Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import styles from './styles/Login.module.css';
import { useSetCurrentUser } from '../../contexts/CurrentUserContext';

const Login = ({ handleSignUp, closeOffcanvas }) => {
  const setCurrentUser = useSetCurrentUser();

  const [signInData, setSignInData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignInData({ ...signInData, [name]: value });
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post('/dj-rest-auth/login/', signInData);
      setCurrentUser(data.user);
      closeOffcanvas();
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
              className="bg-dark rounded-end text-white"
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
              className="bg-dark rounded-end text-white"
            />
          </InputGroup>
        </Form.Group>
        {errors.non_field_errors && (
          <Alert variant="danger" className="mt-3">
            {errors.non_field_errors}
          </Alert>
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
          variant="outline-light d-block mx-auto my-2"
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
