import React from 'react';
import '../stylesheets/App.css';
import { useState } from 'react';
import axios from 'axios';

export default async function UserProfile(props) {
    const resp = await axios.get('http://localhost:8000/api/getuserquestions');
    const questions = resp.data;
    const tags = await axios.get('http://localhost:8000/api/getuserquestions');

  return (
    <div>
        <h1>Profile</h1>
        <div></div>
        <div>
        <div className="tags-page-header">
            <div id="num-of-tags-header">{props.tags.length} Tags</div>
            <div className="tags-page-title">All Tags</div>
            {props.isLoggedIn && <div id="tags-page-ask-question-btn"><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>}
        </div>
        <div id="tags-container"> {props.tags.map((tag)=>{
             if (tag.questionCount === 1){
                return <div key={tag._id} id="tag-container" className="tag-container">
                <div onClick={()=>showTaggedQuestions(tag._id)} id="tag-name" className="tag-name">{tag.name}</div>
                <span className="tag-num-of-questions">{tag.questionCount} question</span>
              </div>
             }
             else {
                 return <div key={tag._id} id="tag-container" className="tag-container">
                 <div onClick={()=>showTaggedQuestions(tag._id)} id="tag-name" className="tag-name">{tag.name}</div>
                 <span className="tag-num-of-questions">{tag.questionCount} questions</span>
               </div>
             }
        })}</div>
    </div>
    </div>
  );
}