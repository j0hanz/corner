import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import styles from './styles/Signup.module.css';

const Signup = ({ handleLogin }) => {
  const [signUpData, setSignUpData] = useState({
    username: '',
    password1: '',
    password2: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignUpData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/dj-rest-auth/registration/', signUpData);
      await axios.post('/dj-rest-auth/login/', {
        username: signUpData.username,
        password: signUpData.password1,
      });
      window.location.reload();
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  return (
    <Form onSubmit={handleSignUpSubmit}>
      <Form.Group controlId="signupUsername">
        <InputGroup className="mt-3 px-3">
          <InputGroup.Text className="bg-secondary bg-opacity-10 text-white">
            <FontAwesomeIcon icon={faUser} />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Create Username"
            name="username"
            value={signUpData.username}
            onChange={handleChange}
            required
            className="bg-dark rounded-end text-white"
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="signupPassword1" className="mt-3 px-3">
        <InputGroup>
          <InputGroup.Text className="bg-secondary bg-opacity-10 text-white">
            <FontAwesomeIcon icon={faKey} />
          </InputGroup.Text>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password1"
            value={signUpData.password1}
            onChange={handleChange}
            required
            className="bg-dark rounded-end text-white"
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="signupPassword2" className="mt-3 px-3">
        <InputGroup>
          <InputGroup.Text className="bg-secondary bg-opacity-10 text-white">
            <FontAwesomeIcon icon={faKey} />
          </InputGroup.Text>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={signUpData.password2}
            onChange={handleChange}
            required
            className="bg-dark rounded-end text-white"
          />
        </InputGroup>
      </Form.Group>
      {errors.non_field_errors && (
        <div className="text-danger">{errors.non_field_errors}</div>
      )}
      <div className="d-flex justify-content-center">
        <Button variant="outline-primary text-white my-3" type="submit">
          Sign Up
        </Button>
      </div>
      <div className={styles.signupContainer}>
        <p className="text-center mb-0">Already have an account?</p>
        <Button
          variant="outline-light d-block mx-auto mt-2"
          onClick={handleLogin}
          className={styles.signupButton}
        >
          Login here!
        </Button>
      </div>
    </Form>
  );
};

export default Signup;
