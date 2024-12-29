import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../Contexts/UserContext'; // Adjust the path as needed
import '../Styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useUser(); // Access the login function from the context
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Username and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost/POS/api/user/Login', {
        Username: username,
        Password: password,
      });

      const userData = response.data;
      login(userData); // Call login to set user data and start session

      if (userData.Role.toLowerCase() === 'admin') {
        navigate('/AdminDashboard');
      } else if (userData.Role.toLowerCase() === 'employee') {
        navigate('/Dashboard');
      } else {
        setErrorMessage('User role is not recognized.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-card">
          <h1 className="logo">Virtual Rides</h1>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="form-group">
            <input
              type="text"
              className="form-control username-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control password-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="button" className="login-button" onClick={handleLogin}>
            Log In
          </button>

          <div className="register-link">
            Not registered yet?{' '}
            <a href="/Signup">
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;