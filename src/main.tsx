import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { LoginScreen } from './components/LoginScreen';
import App from './App';
import './index.css';

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return isLoggedIn ? <App /> : <LoginScreen onLoginSuccess={handleLoginSuccess} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);