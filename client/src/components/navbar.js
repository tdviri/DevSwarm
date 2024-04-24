import React from 'react';
import '../stylesheets/App.css';
import Searchbar from './searchbar.js';
import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from './appContext.js';

export default function Navbar() {
  const {isLoggedIn, setIsLoggedIn } = useAppContext();
  const navigate = useNavigate();

  function logOut(){
    setIsLoggedIn(true);
    navigate('/');
  }

  return (
      <div id="header" className="header">
        {isLoggedIn && <btn className="log-out-btn" onClick={logOut}>Log Out</btn>}
        <div className="title">
          Fake Stack Overflow
        </div>
        <Searchbar/>
      </div>
  );
}
