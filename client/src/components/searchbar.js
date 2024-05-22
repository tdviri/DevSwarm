import React from "react";
import "../stylesheets/App.css";

export default function Searchbar(props) {
  function handleSearch(e) {
    if (e.key === "Enter") {
      props.setCurrentTag(null);
      props.setSortField("ask_date_time");
      props.setSearch(e.target.value);
    }
  }

  return (
    <div className="search-bar">
      <input
        id="search-input"
        type="text"
        placeholder="Search..."
        onKeyDown={handleSearch}
      />
    </div>
  );
}
