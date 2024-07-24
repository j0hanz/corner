import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import { Oval } from 'react-loader-spinner';
import styles from './styles/LoadingSpinnerToast.module.css';

const LoadingSpinnerToast = ({ show, message, duration }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  return (
    <Toast
      show={visible}
      className={`text-white ${styles.toast}`}
      animation={true}
    >
      <Toast.Body className="d-flex flex-column align-items-center">
        <Oval
          height={90}
          width={90}
          color="#e4e6eb"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#1c1e21"
          className={styles.spinner}
        />
        {message && <div className={styles.message}>{message}</div>}
      </Toast.Body>
    </Toast>
  );
};

export default LoadingSpinnerToast;
