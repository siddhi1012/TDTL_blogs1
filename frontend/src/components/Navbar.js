import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          Blog App
        </Link>
        <div>
          {user ? (
            <>
              <span style={{ color: 'white', marginRight: '15px' }}>
                Welcome, {user.username}
              </span>
              <button 
                onClick={logout} 
                className="btn" 
                style={{ backgroundColor: '#dc3545' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
