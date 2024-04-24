import React from 'react';
import '../stylesheets/App.css';
import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function AskQuestionForm(props) {
    const [formTitleError, setFormTitleError] = useState(false);
    const [tagLengthError, setTagLengthError] = useState(false);
    const [tagCountError, setTagCountError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const formValues = new FormData(e.target);
    const questionTitle = formValues.get('title');
    const questionSummary = formValues.get('summary');
    const questionText = formValues.get('text');
    const questionTags = formValues.get('tags').split(" ");
    setFormTitleError(false);
    setTagLengthError(false);
    setTagCountError(false);
    let valid = true;

    if (questionTitle.length > 100){
        setFormTitleError(true);
        valid = false;
    }
    
    if (questionTags.length > 5){
        setTagCountError(true);
        valid = false;
    }
    
    for (const tag of questionTags){
        if (tag.length > 20){
            setTagLengthError(true);
            valid = false;
            break;
        }
    }

    if (!valid){
        return;
    }
        const tagsArr = [...props.tags];
        let tagIdsArr = [];
        for (const userTag of questionTags) {
          let matchedTag = false;
          for (const tag of tagsArr) {
            if (userTag === tag.name) {
              tagIdsArr.push(tag._id);
              matchedTag = true;
              break;
            }
          }
    
          if (!matchedTag) { 
            let newTag = {name: userTag};
            tagsArr.push(newTag)
            const resp = await axios.put('http://localhost:8000/updatetags', newTag);
            tagIdsArr.push(resp.data._id);
          }
        }
        let newQuestion = {
          title: questionTitle,
          summary: questionSummary,
          text: questionText,
          tags: tagIdsArr,
          answers: [],
          asked_by: props.loggedInUser.username, 
          ask_date_time: new Date(),
          views: 0,
        };
        props.addNewQuestion(newQuestion);
        props.handleAskQuestionBtn(false);
  }

  return (
    <form id="ask-question-form" className="ask-question-form" onSubmit={handleSubmit}>
      <div className="form-question-subheader-container">
        <label className="form-label">Question Title*</label>
        <span className="form-submessage">Limit title to 50 characters or less</span>
        <input id="question-title" className="form-input" type="text" required name="title" />
      </div>
      <br /><br />
      <div className="form-question-subheader-container">
        <label className="form-label">Question Summary*</label>
        <span className="form-submessage">Limit title to 140 characters or less</span>
        <textarea id="question-text" className="form-input" type="text" required name="summary"></textarea>
      </div>
      <br /><br />
      <div className="form-question-subheader-container">
        <label className="form-label">Text*</label>
        <span className="form-submessage">Add details</span>
        <textarea id="question-username" className="form-input" type="text" required name="text"></textarea>
      </div>
      <br/><br/>
      <div className="form-question-subheader-container">
        <label className="form-label">Tags*</label>
        <span className="form-submessage">Add keywords separated by whitespace</span>
        <input id="question-tags" className="form-input" type="text" required name="tags" />
      </div>
      <br /><br />
      <div className="submit-form">
        <input id="submit-btn" className="submit-btn" type="submit" value="Post Question" />
        <span className="mandatory-fields-message">* indicates mandatory fields</span>
      </div>
      <div className="ask-question-form-error-message">
        {formTitleError && <div className="error-message">Question title cannot be more than 140 characters in length</div>}
        {tagCountError && <div className="error-message">Number of tags cannot be more than 5</div>}
        {tagLengthError && <div className="error-message">Length of each tag cannot be more than 20 characters in length</div>}
      </div>
    </form>
  );
}

AskQuestionForm.propTypes = {
  tags: PropTypes.array.isRequired,
  addNewQuestion: PropTypes.func.isRequired,
  handleAskQuestionBtn: PropTypes.func.isRequired
};