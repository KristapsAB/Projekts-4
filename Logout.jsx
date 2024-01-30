import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
  
    // Redirect to the login page
    navigate('/login');
  };
  

  return (
    <a href="#" onClick={handleLogout}>
      <i className="fa fa-power-off fa-2x"></i>
      <span className="nav-text">Logout</span>
    </a>
  );
};

export default Logout;
