import React from 'react';
import '../stylesheets/App.css';
import PropTypes from 'prop-types';
import { useAppContext } from './appContext';

export default function NewestBtn(props) {
    function sortNewest(){
        props.setSortField('ask_date_time');
    }

  return (
    <button id="newest-btn" onClick={sortNewest}>Newest</button>
  );
}

NewestBtn.propTypes = {
  setSortField: PropTypes.func.isRequired
};