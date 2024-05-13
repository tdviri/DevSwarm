import React from 'react';
import '../stylesheets/App.css';
import Searchbar from './searchbar.js';
import axios from 'axios';
// axios.defaults.withCredentials = true;

export default function Navbar(props) {

  async function logOut(){
    try {
      await axios.get('http://localhost:8000/api/logout', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error){
      if (error.request) {
        alert('Communication error: Unable to connect to the server. Please try again later.');
      } 
      else {
        alert('System error: Registration failed');
      }
    }
    props.goToWelcomePage();
    props.setShowUserProfile(false);
  }

  return (
      <div id="header" className="header">
        {props.isLoggedIn && <btn className="log-out-btn" onClick={logOut}>Log Out</btn>}
        {!props.isLoggedIn && <btn className="back-to-welcome-btn" onClick={()=>props.goToWelcomePage()}>Go back</btn>}
        <div className="title">
          Fake Stack Overflow
        </div>
        <Searchbar setSortField={props.setSortField} setCurrentTag={props.setCurrentTag} setSearch={props.setSearch}/>
      </div>
  );
}
