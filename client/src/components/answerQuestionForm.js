import React from 'react';
import '../stylesheets/App.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useAppContext } from './appContext';

export default function AnswerQuestionForm(props) {
  async function handleSubmit(e){
    e.preventDefault();
    const formValues = new FormData(e.target);
    const answerUsername = formValues.get('username');
    const answerText = formValues.get('text');
    let newAnswer = {
      text: answerText,
      ans_by: answerUsername,
      ans_date_time: new Date(),
    }
    const ansArr = [...props.ansArray];
    const questionsArr = [...props.questions];
    ansArr.push(newAnswer);
    const resp = await axios.put('http://localhost:8000/updateanswers', newAnswer);
    questionsArr[props.index].answers.push(resp.data._id);
    ansArr.sort(function(a, b){
      return b.ans_date_time - a.ans_date_time;
    })
    props.handleAnswerPageIndex(props.index, questionsArr, ansArr, false);
  }


  return (
    <form id="answer-form" className="answer-form" onSubmit={handleSubmit}>
    <div className="answer-question-form-subheader-container">
      <div className="username-field-answer-form">
        <label className="answer-form-label">Username*</label>
        <input id="answer-form-username-input" type="text" required name="username"/>
      </div>
      <div className="text-field-answer-form">
        <label className="answer-form-label">Answer Text*</label>
        <textarea id="answer-form-text-input" type="text" required name="text"></textarea>
      </div>
    </div>
    <br/><br/>
    <div className="submit-answer-form">
      <input className="submit-btn-answer-form" type="submit"/>
      <span className="mandatory-fields-message-answer-form">* indicates mandatory fields</span>
    </div>
  </form>
  );
}

AnswerQuestionForm.propTypes = {
  ansArray: PropTypes.array.isRequired,
  questions: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  handleAnswerPageIndex: PropTypes.func.isRequired
};