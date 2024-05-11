import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import '../stylesheets/App.css';

export default function NewQuestion(props) {
    const [formTitleError, setFormTitleError] = useState(false);
    const [tagLengthError, setTagLengthError] = useState(false);
    const [tagCountError, setTagCountError] = useState(false);

    async function handleEditQuestion(formData){
        const questionTitle = formData.get('title');
        const questionSummary = formData.get('summary');
        const questionText = formData.get('text');
        const questionTags = formData.get('tags').split(" ");
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
        let tagIdsArr = [];
        if (questionTags !== null){
            const tagsArr = [...props.tags];
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
                    const newTag = {name: userTag};
                    tagsArr.push(newTag)
                    try{ 
                    const resp = await axios.post('http://localhost:8000/api/updatetags', newTag, { withCredentials: true,
                    headers: {
                    'Content-Type': 'application/json',
                    }})
                    tagIdsArr.push(resp.data._id);
                    } catch (error){
                    if (error.request) {
                        alert('Communication error: Unable to connect to the server. Please try again later.');
                    } 
                    else {
                        alert('System error: Registration failed');
                    }
                    }
                }
                } 
        }
        
            const loggedInUser = (await axios.get('http://localhost:8000/api/getLoggedInUser', {withCredentials: true,
            headers: {
            'Content-Type': 'application/json',
            }})).data;
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
                isVoted: false
            };
            await axios.put('http://localhost:8000/api/replacequestion', {origQuestion: props.userQuestion, newQuestion: newQuestion}, {withCredentials: true})
            props.setClickedOnProfileSidebar(true);
            props.fetchData();
        }

    async function handleDeleteQuestion(formData){
        await axios.delete('http://localhost:8000/api/deletequestion', {withCredentials: true, data: props.userQuestion});
        props.setClickedOnProfileSidebar(true);
        props.fetchData()
    }

  return (
    <form id="ask-question-form" className="ask-question-form">
      <div className="form-question-subheader-container">
        <label className="form-label">Question Title*</label>
        <span className="form-submessage">Limit title to 50 characters or less</span>
        <input id="question-title" className="form-input" type="text" required name="title" defaultValue ={props.userQuestion.title}/>
      </div>
      <br /><br />
      <div className="form-question-subheader-container">
        <label className="form-label">Question Summary*</label>
        <span className="form-submessage">Limit title to 140 characters or less</span>
        <textarea id="question-text" className="form-input" type="text" required name="summary">{props.userQuestion.summary}</textarea>
      </div>
      <br /><br />
      <div className="form-question-subheader-container">
        <label className="form-label">Text*</label>
        <span className="form-submessage">Add details</span>
        <textarea id="question-username" className="form-input" type="text" required name="text">{props.userQuestion.text}</textarea>
      </div>
      <br/><br/>
      <div className="form-question-subheader-container">
        <label className="form-label">Tags*</label>
        <span className="form-submessage">Add keywords separated by whitespace</span>
        <input id="question-tags" className="form-input" type="text" required name="tags" defaultValue={(props.userQuestion.tags && props.userQuestion.tags.length > 0) ? (props.userTags.filter(tag =>{return props.userQuestion.tags.includes(tag._id)}).map(tag => tag.name).join(" ")) : ''} />
      </div>
      <br /><br />
      <div className="submit-form">
        <input id="submit-btn" className="submit-btn" value="Post Edited Question" onClick={(e)=>handleEditQuestion(new FormData(document.getElementById("ask-question-form")))} />
        <input id="submit-btn" className="submit-btn" value="Delete Question" onClick={(e)=>handleDeleteQuestion(new FormData(document.getElementById("ask-question-form")))} />
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