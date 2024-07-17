import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CurrentUserProvider } from './contexts/CurrentUserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    </Router>
  </React.StrictMode>,
);

reportWebVitals();
