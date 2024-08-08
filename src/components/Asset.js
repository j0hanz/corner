import React from 'react';
import styles from './styles/Asset.module.css';

// Asset component to display an image and an optional message
const Asset = ({ src, message }) => {
  return (
    <div className={`${styles.Asset} text-center`}>
      {src && <img src={src} alt="No results" className="img-fluid" />}{' '}
      {/* Display the image if src is provided */}
      {message && <p className="mt-2">{message}</p>}{' '}
      {/* Display the message if provided */}
    </div>
  );
};

export default Asset;
