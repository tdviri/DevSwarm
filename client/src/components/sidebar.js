import React from 'react';
import '../stylesheets/App.css';
import PropTypes from 'prop-types';
import { useAppContext } from './appContext';

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
    </div> 
  );
}

Sidebar.propTypes = {
  toggleDisplayTagsPage: PropTypes.func.isRequired
};
