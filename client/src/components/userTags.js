import React from 'react';
import '../stylesheets/App.css';

export default function UserTags(props) {
    function showTaggedQuestions(tagId){
        props.setSearch('');
        props.setCurrentTag(tagId);
        props.setDisplayTagsPage(false);
    }

  return (
    <div>
        <div className="tags-page-header">
            <div id="num-of-tags-header">{props.userTags.length} Your Created Tags</div>
            <div className="tags-page-title">All Tags</div>
            {props.isLoggedIn && <div id="tags-page-ask-question-btn"><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>}
        </div>
        <div id="tags-container"> {props.userTags.map((tag)=>{
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
  );
}