import React from "react";
import "../stylesheets/App.css";
import PropTypes from "prop-types";

export default function UnansweredBtn(props) {
  function sortUnanswered() {
    props.toggleUnansweredBtnClicked();
  }

  return (
    <button id="unanswered-btn" onClick={sortUnanswered}>
      Unanswered
    </button>
  );
}
