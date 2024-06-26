import React from "react";
import "../stylesheets/App.css";
import axios from "axios";
// axios.defaults.withCredentials = true;

export default function AnswerQuestionForm(props) {
  async function handleSubmit(e) {
    e.preventDefault();
    const formValues = new FormData(e.target);
    const answerText = formValues.get("text");
    try {
      const loggedInUser = await axios.get(
        "http://localhost:8000/api/getLoggedInUser",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      let newAnswer = {
        text: answerText,
        ans_by: loggedInUser.data.username,
        ans_date_time: new Date(),
        comments: [],
        votes: 0,
      };

      const ansArr = [...props.answers];
      ansArr.push(newAnswer);

      const resp = await axios.post(
        "http://localhost:8000/api/updateanswers",
        newAnswer,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const questionsArr = [...props.questions];
      questionsArr[props.answerPageIndex].answers.push(resp.data._id);

      ansArr.sort((a, b) => b.ans_date_time - a.ans_date_time);

      props.handleAnswerPageIndex(
        props.answerPageIndex,
        questionsArr,
        false,
        false,
      );
      props.setDisplayAnswers(true);
      props.setDisplayAnswerForm(false);
    } catch (error) {
      alert(
        "An error occurred while submitting your answer. Please try again.",
      );
    }
  }

  return (
    <form id="answer-form" className="answer-form" onSubmit={handleSubmit}>
      <div className="answer-question-form-subheader-container">
        <div className="text-field-answer-form">
          <label className="answer-form-label">Answer Text*</label>
          <textarea
            id="answer-form-text-input"
            type="text"
            required
            name="text"
          ></textarea>
        </div>
      </div>
      <br />
      <br />
      <div className="submit-answer-form">
        <input className="submit-btn-answer-form" type="submit" />
        <span className="mandatory-fields-message-answer-form">
          * indicates mandatory fields
        </span>
      </div>
    </form>
  );
}
