
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '../../context/appContext';
import './login.css'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await apiClient.post('/login', {
        email,
        password,
      });
      
      const { token, user } = response.data;
  
      localStorage.setItem('mov-token', token);
      localStorage.setItem('mov-user', JSON.stringify(user));
      setIsLoggedIn(true);
      toast.success(response.data.message);
      navigate('/'); 
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.open('http://localhost:4000/auth/google', '_self');
  };

  return (
    <div className="login-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <div className="password-container">
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <span 
            className="password-toggle" 
            onClick={() => setShowPassword(!showPassword)} 
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </span>
        </div>
        <button type="submit" className="login-button">Log In</button>
      </form>
      <button className="google-login-button" onClick={handleGoogleLogin}>
            Sign in with Google
        </button>
      <p className="register-prompt">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default LoginPage;
