import React, { useState } from 'react';
import { login } from '../services/UYWSApi';
import './LoginScreen.css';
import { ProviderSetupScreen } from './ProviderSetupScreen';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showProviderSetup, setShowProviderSetup] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await login(email, password);
      
      // Check if providers array is empty
      if (response.providers && Array.isArray(response.providers) && response.providers.length === 0) {
        setShowProviderSetup(true);
      } else {
        localStorage.setItem('authToken', response.token);
        onLoginSuccess();
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleProviderSetupComplete = () => {
    setShowProviderSetup(false);
    // Get token from localStorage (already set during login)
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.setItem('authToken', token);
      onLoginSuccess();
    }
  };

  return (
    <>
    <div className="login-screen">
      <div className="login-container">
      <img
  src="https://uywebsolutionslanding.s3.us-east-2.amazonaws.com/img/icons/logo.png"
  alt="Company Logo"
  className="company-logo"
/>
<h1 className="company-name">UY Web Solutions</h1>
        <p className="login-subtitle">Log in to continue to the AI Travel Assistant</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button">Log In</button>
        </form>
      </div>
    </div>
    <ProviderSetupScreen
        open={showProviderSetup}
        onComplete={handleProviderSetupComplete}
      />
    </>
  );
};