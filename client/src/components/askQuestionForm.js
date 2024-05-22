import React from "react";
import "../stylesheets/App.css";
import { useState } from "react";
import axios from "axios";

export default function AskQuestionForm(props) {
  const [formTitleError, setFormTitleError] = useState(false);
  const [summaryError, setSummaryError] = useState(false);
  const [tagLengthError, setTagLengthError] = useState(false);
  const [tagCountError, setTagCountError] = useState(false);
  const [reputationError, setReputationError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const formValues = new FormData(e.target);
    const questionTitle = formValues.get("title");
    const questionSummary = formValues.get("summary");
    const questionText = formValues.get("text");
    const questionTags = formValues.get("tags").split(" ");
    setFormTitleError(false);
    setTagLengthError(false);
    setTagCountError(false);
    setSummaryError(false);
    setReputationError(false);
    let valid = true;

    let loggedInUser;
    try {
      const response = await axios.get(
        "http://localhost:8000/api/getLoggedInUser",
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      loggedInUser = response.data;
    } catch (error) {
      if (error.response) {
        console.error("System error");
      } else if (error.request) {
        console.error("Communication error");
      } else {
        console.error("System error");
      }
      return;
    }

    if (questionTitle.length > 50) {
      setFormTitleError(true);
      valid = false;
    }

    if (questionSummary.length > 140) {
      setSummaryError(true);
      valid = false;
    }

    if (questionTags.length > 5) {
      setTagCountError(true);
      valid = false;
    }

    const tagNames = props.tags.map((tag) => tag.name);
    for (const tag of questionTags) {
      if (tag.length > 20) {
        setTagLengthError(true);
        valid = false;
        break;
      }
      if (loggedInUser.reputation < 50 && !tagNames.includes(tag)) {
        setReputationError(true);
        valid = false;
        break;
      }
    }

    if (!valid) {
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
        const newTag = { name: userTag };
        tagsArr.push(newTag);
        try {
          const resp = await axios.post(
            "http://localhost:8000/api/updatetags",
            newTag,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          tagIdsArr.push(resp.data._id);
        } catch (error) {
          if (error.request) {
            alert(
              "Communication error: Unable to connect to the server. Please try again later.",
            );
          } else {
            alert("System error");
          }
          return;
        }
      }
    }
    let newQuestion = {
      title: questionTitle,
      summary: questionSummary,
      text: questionText,
      tags: tagIdsArr,
      answers: [],
      asked_by: loggedInUser.username,
      ask_date_time: new Date(),
      views: 0,
      votes: 0,
      comments: [],
    };
    props.addNewQuestion(newQuestion);
    props.handleAskQuestionBtn(false);
  }

  return (
    <form
      id="ask-question-form"
      className="ask-question-form"
      onSubmit={handleSubmit}
    >
      <div className="form-question-subheader-container">
        <label className="form-label">Question Title*</label>
        <span className="form-submessage">
          Limit title to 50 characters or less
        </span>
        <input
          id="question-title"
          className="form-input"
          type="text"
          required
          name="title"
        />
      </div>
      <br />
      <br />
      <div className="form-question-subheader-container">
        <label className="form-label">Question Summary*</label>
        <span className="form-submessage">
          Limit title to 140 characters or less
        </span>
        <textarea
          id="question-text"
          className="form-input"
          type="text"
          required
          name="summary"
        ></textarea>
      </div>
      <br />
      <br />
      <div className="form-question-subheader-container">
        <label className="form-label">Text*</label>
        <span className="form-submessage">Add details</span>
        <textarea
          id="question-username"
          className="form-input"
          type="text"
          required
          name="text"
        ></textarea>
      </div>
      <br />
      <br />
      <div className="form-question-subheader-container">
        <label className="form-label">Tags*</label>
        <span className="form-submessage">
          Add keywords separated by whitespace
        </span>
        <input
          id="question-tags"
          className="form-input"
          type="text"
          required
          name="tags"
        />
      </div>
      <br />
      <br />
      <div className="submit-form">
        <input
          id="submit-btn"
          className="submit-btn"
          type="submit"
          value="Post Question"
        />
        <span className="mandatory-fields-message">
          * indicates mandatory fields
        </span>
      </div>
      <div className="ask-question-form-error-message">
        {formTitleError && (
          <div className="error-message">
            Question title cannot be more than 50 characters in length
          </div>
        )}
        {tagCountError && (
          <div className="error-message">
            Number of tags cannot be more than 5
          </div>
        )}
        {tagLengthError && (
          <div className="error-message">
            Length of each tag cannot be more than 20 characters in length
          </div>
        )}
        {summaryError && (
          <div className="error-message">
            Summary cannot be more than 140 characters in length
          </div>
        )}
        {reputationError && (
          <div className="error-message">
            At least 50 reputation points required to create new tag name
          </div>
        )}
      </div>
    </form>
  );
}
