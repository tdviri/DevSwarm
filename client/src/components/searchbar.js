import React from 'react';
import '../stylesheets/App.css';
import PropTypes from 'prop-types';

export default function Searchbar(props) {

function handleSearch(e) {
  if (e.key === 'Enter') {
    props.setCurrentTag(null);
    props.onChange(e.target.value);
  }
}

  return (
    <div className="search-bar">
        <input id="search-input" type="text" placeholder="Search..." onKeyDown={handleSearch} />
    </div>    
  );
}

Searchbar.propTypes = {
    onChange: PropTypes.func.isRequired,
    setCurrentTag: PropTypes.func.isRequired
};