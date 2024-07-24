import React from 'react';
import styles from './styles/Asset.module.css';

const Asset = ({ src, message }) => {
  return (
    <div className={`${styles.Asset} text-center`}>
      {src && <img src={src} alt="No results" className="img-fluid" />}
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default Asset;
