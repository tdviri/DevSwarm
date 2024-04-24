import React from 'react';
import '../stylesheets/App.css';
import { useState } from 'react';
import { useAppContext } from './appContext.js';

export default function Searchbar() {
  const {setSortField, setCurrentTag, setSearch} = useAppContext();

function handleSearch(e) {
  if (e.key === 'Enter') {
    setCurrentTag(null);
    setSortField('ask_date_time');
    setSearch(e.target.value);
  }
}

  return (
    <div className="search-bar">
        <input id="search-input" type="text" placeholder="Search..." onKeyDown={handleSearch} />
    </div>    
  );
}