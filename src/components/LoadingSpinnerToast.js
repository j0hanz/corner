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
          height={80}
          width={80}
          color="#f8f9fa"
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#495057"
          strokeWidth={2}
          strokeWidthSecondary={2}
          className={styles.spinner}
        />
        {message && (
          <div className={`text-bold ${styles.message}`}>{message}</div>
        )}
      </Toast.Body>
    </Toast>
  );
};

export default LoadingSpinnerToast;
