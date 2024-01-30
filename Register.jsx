import React, { useState } from 'react';
import { Link, redirect, useHistory } from 'react-router-dom'; // Import useHistory for redirection
import './style/Login.css';

function Signup() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!email.includes('@')) {
      setErrorMessage('Invalid email format');
      return;
    }
  
    // You can add more specific validations for username, email, and password here
    // For example, you can use regular expressions for email validation

    try {
      // Make a POST request to the backend API for user registration
      const response = await fetch('http://localhost/api/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Error during registration:', responseData.message);
        setErrorMessage(responseData.message || 'An error occurred during registration');
      } else {
        // Registration successful
        console.log('User registered successfully');
        setSuccessMessage('Registration successful!');

        // Uncomment the following line once you have configured your routes
        redirect('/login');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage('An error occurred during registration');
    }
  };

  return (
    <div className="login-main">
      <div className="login-container">
        <div className='login-wrapper'>
          <h2>Get On Board</h2>

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
            <label>Email</label>
            <input
              className='login-input'
              type='text'
              placeholder=''
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div className='input-group'>
            <label>Confirm Password</label>
            <input
              className='login-input'
              type='password'
              placeholder=''
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className='login-button-container'>
            <button onClick={handleSignup} className='login-button'>
              Sign Up
            </button>
          </div>

          <p className='error-message'>{errorMessage}</p>
          <p className='success-message'>{successMessage}</p>

          <p className='sign-up-link'>
            Already Member? <Link to="/Login">Login Instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
