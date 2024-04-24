import React from 'react';
import '../stylesheets/App.css';
import PropTypes from 'prop-types';
import { useAppContext } from './appContext';

export default function ActiveBtn(props) {
    function sortActive(){
        props.setSortField('ans_date_time');
    }

  return (
        <button id="active-btn" onClick={sortActive}>Active</button>
  );
}

ActiveBtn.propTypes = {
  setSortField: PropTypes.func.isRequired
};