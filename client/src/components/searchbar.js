import React from 'react';
import '../stylesheets/App.css';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAppContext } from './appContext';

export default function Searchbar() {
  const [setSortField, setCurrentTag, onSearch, setIsNoQuestionsFound, handleIsNoQuestionsFound, setQuestions, questions, tags] = useAppContext();

function handleSearch(e) {
  if (e.key === 'Enter') {
    setCurrentTag(null);
    setSortField('ask_date_time');
    onSearch(e.target.value);
  }
}

  return (
    <div className="search-bar">
        <input id="search-input" type="text" placeholder="Search..." onKeyDown={handleSearch} />
    </div>    
  );
}

Searchbar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    setCurrentTag: PropTypes.func.isRequired
};