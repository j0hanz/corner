import React, { useState } from 'react';
import { Navbar, Container, Offcanvas, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightToBracket,
  faCircleUser,
} from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

import logo from '../assets/logo.webp';
import nobody from '../assets/nobody.webp';
import styles from './styles/NavBar.module.css';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../contexts/CurrentUserContext';
import Avatar from './Avatar';

const NavBar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();

  const toggleOffcanvas = () => setShowOffcanvas((prevState) => !prevState);

  const handleLogout = async () => {
    try {
      await axios.post('/dj-rest-auth/logout/');
      setCurrentUser(null);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="fixed-top py-3">
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
          <NavLink
            as="div"
            onClick={toggleOffcanvas}
            className={styles.navIcon}
          >
            <FontAwesomeIcon
              className="fa-xl"
              icon={currentUser ? faCircleUser : faRightToBracket}
            />
          </NavLink>
        </Container>
      </Navbar>

      <Offcanvas
        show={showOffcanvas}
        onHide={toggleOffcanvas}
        placement="end"
        className="bg-dark text-light"
      >
        <Offcanvas.Header
          closeButton
          closeVariant="white"
          className="d-flex align-items-center justify-content-between w-100 pb-1"
        >
          {!currentUser ? (
            <img src={logo} alt="Logo" className={styles.logoCanvas} />
          ) : (
            <NavLink
              to={`/users/${currentUser?.pk}/`}
              className="d-flex align-items-center"
            >
              <Avatar
                src={nobody}
                alt="Profile"
                className={styles.profileImage}
              />
              <span className={`ms-2 ${styles.username}`}>
                {currentUser.username}
              </span>
            </NavLink>
          )}
        </Offcanvas.Header>
        <hr />
        {currentUser ? (
          <Button
            variant="outline-light"
            onClick={handleLogout}
            className="mx-auto"
          >
            Sign Out
          </Button>
        ) : (
          <>
            {showLogin ? (
              <Login
                navigate={navigate}
                handleSignUp={() => setShowLogin(false)}
              />
            ) : (
              <Signup
                navigate={navigate}
                handleLogin={() => setShowLogin(true)}
              />
            )}
            <hr />
          </>
        )}
      </Offcanvas>
    </>
  );
};

export default NavBar;
