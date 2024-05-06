import React, { useState } from 'react';
import '../stylesheets/App.css';
import axios from 'axios';

export default function EditAnswerForm(props) {
  const [ansText, setAnsText] = useState(props.answerToEdit.text);

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.put('http://localhost:8000/api/editanswer', { origAns: props.answerToEdit, newAnsText: ansText }, { withCredentials: true });
    props.setDisplayEditAnswerForm(false);
    props.fetchData();
  }

  function handleChange(e) {
    setAnsText(e.target.value);
  }

  return (
    <form id="answer-form" className="answer-form" onSubmit={handleSubmit}>
      <div className="answer-question-form-subheader-container">
        <div className="text-field-answer-form">
          <label className="answer-form-label">Answer Text*</label>
          <textarea id="answer-form-text-input" value={ansText} onChange={handleChange} type="text" required name="text"></textarea>
        </div>
      </div>
      <br /><br />
      <div className="submit-answer-form">
        <input className="submit-btn-answer-form" type="submit" />
        <span className="mandatory-fields-message-answer-form">* indicates mandatory fields</span>
      </div>
    </form>
  );
}
