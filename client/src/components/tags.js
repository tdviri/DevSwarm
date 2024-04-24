import React from 'react';
import '../stylesheets/App.css';
import PropTypes from 'prop-types';
import { useAppContext } from './appContext';

export default function Tags(props) {
  const [setSearch, setCurrentTag, setDisplayTagsPage, tags ] = useAppContext();
    function showTaggedQuestions(tagId){
        setSearch('');
        setCurrentTag(tagId);
        setDisplayTagsPage(false);
    }

  return (
    <div>
        <div className="tags-page-header">
            <div id="num-of-tags-header">{tags.length} Tags</div>
            <div className="tags-page-title">All Tags</div>
            <div id="tags-page-ask-question-btn"><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>
        </div>
        <div id="tags-container"> {tags.map((tag)=>{
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

Tags.propTypes = {
  setCurrentTag: PropTypes.func.isRequired,
  setDisplayTagsPage: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  handleAskQuestionBtn: PropTypes.func.isRequired
};