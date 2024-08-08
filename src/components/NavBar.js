import React, { useState, useCallback } from 'react';
import { Navbar, Container, Offcanvas, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.webp';
import styles from './styles/NavBar.module.css';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../contexts/CurrentUserContext';
import Avatar from './Avatar';
import ContactForm from '../pages/contact/ContactForm';

// Component for the content inside the offcanvas menu
const OffcanvasContent = ({
  currentUser,
  handleLogout,
  closeOffcanvas,
  setShowContactForm,
  showLogin,
  setShowLogin,
}) => (
  <>
    <Offcanvas.Header
      closeButton
      closeVariant="white"
      className="d-flex align-items-center justify-content-between w-100 pb-1"
    >
      {!currentUser ? (
        <img src={logo} alt="Logo" className={styles.logoCanvas} />
      ) : (
        <NavLink
          to={`/users/${currentUser?.profile_id}/`}
          className="d-flex align-items-center"
          onClick={closeOffcanvas}
        >
          <Avatar src={currentUser?.profile_image} height={40} width={40} />
          <span className={`ms-2 ${styles.username}`}>
            {currentUser?.username}
          </span>
        </NavLink>
      )}
    </Offcanvas.Header>
    <hr />
    {currentUser ? (
      <>
        <Button
          variant="outline-light"
          onClick={handleLogout}
          className="mx-auto"
        >
          Sign Out
        </Button>
        <hr />
        <Button
          variant="outline-light"
          onClick={() => {
            setShowContactForm(true);
            closeOffcanvas();
          }}
          className="mx-auto"
        >
          Contact Us
        </Button>
      </>
    ) : (
      <>
        {showLogin ? (
          <Login
            handleSignUp={() => setShowLogin(false)}
            closeOffcanvas={closeOffcanvas}
          />
        ) : (
          <Signup handleLogin={() => setShowLogin(true)} />
        )}
        <hr />
      </>
    )}
  </>
);

const NavBar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false); // State to manage offcanvas visibility
  const [showLogin, setShowLogin] = useState(true); // State to toggle between login and signup forms
  const [showContactForm, setShowContactForm] = useState(false); // State to manage contact form visibility
  const currentUser = useCurrentUser(); // Get the current user from context
  const setCurrentUser = useSetCurrentUser(); // Function to update the current user in context

  // Toggle the offcanvas visibility
  const toggleOffcanvas = useCallback(
    () => setShowOffcanvas((prevState) => !prevState),
    []
  );
  const closeOffcanvas = useCallback(() => setShowOffcanvas(false), []);

  // Handle user logout
  const handleLogout = async () => {
    try {
      await axios.post('/dj-rest-auth/logout/');
      setCurrentUser(null);
      closeOffcanvas();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="fixed-top py-2 px-1">
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
          <div onClick={toggleOffcanvas} className={styles.navIcon}>
            {currentUser ? (
              <Avatar src={currentUser?.profile_image} height={30} width={30} />
            ) : (
              <FontAwesomeIcon className="fa-xl" icon={faRightToBracket} />
            )}
          </div>
        </Container>
      </Navbar>

      <Offcanvas
        show={showOffcanvas}
        onHide={toggleOffcanvas}
        placement="end"
        className="bg-dark text-light"
      >
        <OffcanvasContent
          currentUser={currentUser}
          handleLogout={handleLogout}
          closeOffcanvas={closeOffcanvas}
          setShowContactForm={setShowContactForm}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
        />
      </Offcanvas>

      <ContactForm
        show={showContactForm}
        handleClose={() => setShowContactForm(false)}
      />
    </>
  );
};

export default NavBar;
