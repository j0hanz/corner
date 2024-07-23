import React from 'react';
import { Spinner } from 'react-bootstrap';
import styles from './styles/Asset.module.css';

const Asset = ({ spinner, src, message }) => {
  return (
    <div className={`${styles.Asset} text-center`}>
      {spinner && <Spinner animation="border" variant="primary" />}
      {src && <img src={src} alt="No results" className="img-fluid" />}
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default Asset;
