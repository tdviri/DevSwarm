import React from "react";
import "../stylesheets/App.css";

export default function ActiveBtn(props) {
  function sortActive() {
    props.setSortField("ans_date_time");
  }

  return (
    <button id="active-btn" onClick={sortActive}>
      Active
    </button>
  );
}
