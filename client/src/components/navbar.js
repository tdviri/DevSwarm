import React from 'react';
import '../stylesheets/App.css';
import Searchbar from './searchbar.js';
import { useAppContext } from './appContext.js';

export default function Navbar() {
  const {setIsGuest, isLoggedIn, setIsLoggedIn } = useAppContext();

  function logOut(){
    setIsLoggedIn(false);
    setIsGuest(false);
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
