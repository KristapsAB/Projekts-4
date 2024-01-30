import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from './UserContext';

function Login() {
  const { setAuthStatus, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ...

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost/api/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const responseData = await response.json();
  
      console.log('Login Response:', responseData); // Log the entire response
  
      console.log('Received Token:', responseData.token);
  
      if (!response.ok) {
        // Handle error
        console.error('Error during login:', responseData.message);
        setErrorMessage(responseData.message || 'An error occurred during login');
        return;
      }
  
      // Successful login
      console.log('User Role:', responseData.role);
  
      // Store user information in local storage
      localStorage.setItem('token', responseData.token);
  
      // Log the saved token
      console.log('Saved Token:', localStorage.getItem('token'));
  
      // Set user data in context
      setUserData({
        userId: responseData.userId,
        username: responseData.username,
        role: responseData.role,
      });
  
      // Update UserContext with authentication status
      setAuthStatus(true);
  
      // Redirect based on the user's role
      if (responseData.role === 1) {
        navigate('/Mainpage');
      } else if (responseData.role === 2) {
        navigate('/Mainpage');
      } else {
        navigate('/unknown-role');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An unexpected error occurred during login');
    }
  };
  
  


  return (
    <div className="login-main">
      <div className="login-container">
        <div className='login-wrapper'>
          <h1>Welcome Back</h1>
          <form className='login-form' onSubmit={handleLogin}>
            <div className='input-group'>
              <label>Username</label>
              <input
                className='login-input'
                type='text'
                placeholder=''
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='input-group'>
              <label>Password</label>
              <input
                className='login-input'
                type='password'
                placeholder=''
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='error-message'>{errorMessage}</div>
            <div className='login-button-container'>
              <button type='submit' className='login-button'>
                Login
              </button>
            </div>
          </form>
          <p className='sign-up-link'>
            New member? <Link to="/Register">Sign Up Instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
