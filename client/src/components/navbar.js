import React from 'react';
import '../stylesheets/App.css';
import Searchbar from './searchbar.js';

export default function Navbar(props) {

  function logOut(){
    props.setIsLoggedIn(false);
    props.setIsGuest(false);
  }

  return (
      <div id="header" className="header">
        {props.isLoggedIn && <btn className="log-out-btn" onClick={logOut}>Log Out</btn>}
        <div className="title">
          Fake Stack Overflow
        </div>
        <Searchbar setSortField={props.setSortField} setCurrentTag={props.setCurrentTag} setSearch={props.setSearch}/>
      </div>
  );
}
