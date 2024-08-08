import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Image } from 'react-bootstrap'; // Import the 'Image' component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './styles/NotFound.module.css';
import noResults from '../assets/noResults.png';

const NotFound = () => (
  <Container className={styles.notFound}>
    <Image
      src={noResults}
      width={100}
      height={100}
      size="5x"
      className="text-light mb-3"
    />
    <h2 className="mb-3 text-light">Page Not Found</h2>
    <p className={`${styles.message} text-white-50 mb-4`}>
      We can't find the page you're looking for. <br />
      It may have been removed, had its name changed, or is temporarily
      unavailable.
    </p>
    <Link to="/">
      <Button variant="outline-light" size="lg">
        <FontAwesomeIcon icon={faRotateLeft} className="me-2" />
        Return
      </Button>
    </Link>
  </Container>
);

export default NotFound;
