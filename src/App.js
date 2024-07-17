import React from 'react';
import styles from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import './api/axiosDefaults';

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
    </div>
  );
}

export default App;
