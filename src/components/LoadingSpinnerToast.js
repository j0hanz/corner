import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import { Oval } from 'react-loader-spinner';
import styles from './styles/LoadingSpinnerToast.module.css';

// LoadingSpinnerToast component to display a loading spinner with a message
const LoadingSpinnerToast = ({ show, message, duration }) => {
  const [visible, setVisible] = useState(show); // State to manage visibility of the toast

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
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
          height={60}
          width={60}
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
