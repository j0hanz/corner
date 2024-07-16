import React, { useState } from 'react';
import {
  Navbar,
  Nav,
  Container,
  Offcanvas,
  Form,
  Button,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.webp';
import styles from './styles/NavBar.module.css';

const NavBar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [signInData, setSignInData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleShow = () => setShowOffcanvas(true);
  const handleClose = () => {
    setShowOffcanvas(false);
    setErrors({});
    setSignInData({ username: '', password: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/dj-rest-auth/login/', signInData);
      handleClose();
      navigate('/');
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  const handleSignUp = () => navigate('/signup');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignInData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
        >
          <NavLink
            to="/"
            className="d-flex align-items-center position-relative"
          >
            <img
              src={logo}
              alt="Logo"
              className={`position-absolute ${styles.logoNav}`}
            />
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav>
            <Nav.Link as="div" onClick={handleShow} className={styles.navIcon}>
              <FontAwesomeIcon className="fa-xl" icon={faRightToBracket} />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Offcanvas
        show={showOffcanvas}
        onHide={handleClose}
        placement="end"
        className="bg-dark text-light"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>
            <img src={logo} alt="Logo" className={styles.logoCanvas} />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicUsername" className="px-3">
            <Form.Label className="d-none">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={signInData.username}
              onChange={handleChange}
              required
              className="bg-dark mt-4"
            />
            {errors.username && (
              <div className="text-danger mt-1">{errors.username}</div>
            )}
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className="mt-3 px-3">
            <Form.Label className="d-none">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={signInData.password}
              onChange={handleChange}
              required
              className="bg-dark"
            />
            {errors.password && (
              <div className="text-danger mt-1">{errors.password}</div>
            )}
          </Form.Group>
          {errors.non_field_errors && (
            <div className="text-danger mt-3">{errors.non_field_errors}</div>
          )}
          <div className="d-flex justify-content-center">
            <Button variant="outline-primary text-white my-3" type="submit">
              Login
            </Button>
          </div>
        </Form>
        <hr />
        <div className={styles.signupContainer}>
          Don't have an account?{' '}
          <Button
            variant="outline-light d-block mx-auto mt-2"
            onClick={handleSignUp}
            className={styles.signupButton}
          >
            Sign up now!
          </Button>
        </div>
      </Offcanvas>
    </>
  );
};

export default NavBar;
