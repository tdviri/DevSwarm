import React from 'react';
import '../stylesheets/App.css';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function Searchbar(props) {
  const [startIndex, setStartIndex] = useState(0);

function handleSearch(e) {
  if (e.key === 'Enter') {
    props.setCurrentTag(null);
    props.setSortField('ask_date_time');
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