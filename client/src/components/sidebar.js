import React from 'react';
import '../stylesheets/App.css';

export default function Sidebar(props) {
  function changeTagsPageDisplay(value){
    props.toggleDisplayTagsPage(value);
  }

  return (  
    <div className="sidebar">
        <div onClick={() => changeTagsPageDisplay(false)} id="questions-sidebar">
            <h1 id="questions-sidebar-header">Questions</h1>
        </div>
        <div onClick={() => changeTagsPageDisplay(true)} id="tags-sidebar">
            <h1 id="tags-sidebar-header">Tags</h1>
        </div>
        {props.isLoggedIn && <div onClick={()=>changeTagsPageDisplay{}} id="user-profile-sidebar">
        <h1 id="user-profile-sidebar-header">Profile</h1>
          </div>}
    </div> 
  );
}

