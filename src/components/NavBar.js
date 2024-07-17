import React, { useState } from 'react';
import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';
import styles from './styles/NavBar.module.css';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';

const NavBar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const navigate = useNavigate();

  const handleShow = () => setShowOffcanvas(true);
  const handleClose = () => setShowOffcanvas(false);

  const handleSignUp = () => {
    setShowLogin(false);
  };

  const handleLogin = () => {
    setShowLogin(true);
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
        {showLogin && <Login navigate={navigate} handleSignUp={handleSignUp} />}
        {!showLogin && <Signup navigate={navigate} handleLogin={handleLogin} />}
        <hr />
      </Offcanvas>
    </>
  );
};

export default NavBar;
