import React from 'react';
import '../stylesheets/App.css';
import PropTypes from 'prop-types';
import { useAppContext } from './appContext';

export default function Answers(props) {
    let currTime = new Date();
    let elapsedTime = currTime.getTime() - new Date(props.questions[props.index].ask_date_time).getTime();
    let answerPosts = [];
    let answerPage;
    let startYear = new Date(props.questions[props.index].ask_date_time).getFullYear();
    let endYear = currTime.getFullYear();

    let years = Math.abs(Math.floor(endYear - startYear));
    if (currTime.getMonth() < new Date(props.questions[props.index].ask_date_time).getMonth() || (currTime.getMonth() === new Date(props.questions[props.index].ask_date_time).getMonth() && currTime.getDate() < new Date(props.questions[props.index].ask_date_time).getDate())) {
        years--;
    }
    
    let hours = Math.abs(Math.floor(elapsedTime / (1000 * 60 * 60)));
    let minutes = Math.abs(Math.floor(elapsedTime / (1000 * 60)));
    let seconds = Math.abs(Math.floor(elapsedTime / 1000));
    const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (seconds < 60){
      answerPage  = 
      <div> <div className="answers-header">
      <span className="answer-count-answers-page"> {props.questions[props.index].answers.length} answers </span>
      <div className="question-title-answers-page"> {props.questions[props.index].title} </div>
      <div><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>
    </div>
    <div className="question-details-answers-page">
        <span className="views-count-answers-page"> {props.questions[props.index].views} views</span>
        <span className="question-text-answer-page"> {props.questions[props.index].text} </span>
        <div className="answer-info">
          <span className="post-username-question-answers-page"> {props.questions[props.index].asked_by} </span>
          <span className="post-time-answers-page"> asked {seconds} seconds ago</span>Name
        </div>
    </div></div>
      
    }
    else if (minutes < 60){
      answerPage = <div> <div className="answers-header">
      <span className="answer-count-answers-page"> {props.questions[props.index].answers.length} answers </span>
      <div className="question-title-answers-page"> {props.questions[props.index].title} </div>
      <div><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>
    </div>
    <div className="question-details-answers-page">
        <span className="views-count-answers-page"> {props.questions[props.index].views} views</span>
        <span className="question-text-answer-page"> {props.questions[props.index].text} </span>
        <div className="answer-info">
          <span className="post-username-question-answers-page"> {props.questions[props.index].asked_by} </span>
          <span className="post-time-answers-page"> asked {minutes} minutes ago</span>
        </div>
    </div></div>
    }
    else if (hours < 24){
      answerPage = <div>
         <div className="answers-header">
        <span className="answer-count-answers-page"> {props.questions[props.index].answers.length} answers </span>
        <div className="question-title-answers-page"> {props.questions[props.index].title} </div>
        <div><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>
      </div>
      <div className="question-details-answers-page">
          <span className="views-count-answers-page"> {props.questions[props.index].views} views</span>
          <span className="question-text-answer-page"> {props.questions[props.index].text} </span>
          <div className="answer-info">
            <span className="post-username-question-answers-page"> {props.questions[props.index].asked_by} </span>
            <span className="post-time-answers-page"> asked {hours} hours ago</span>
          </div>
      </div>
      </div>
    }

    else if (years >= 0){
      answerPage = 
      <div> <div className="answers-header">
      <span className="answer-count-answers-page"> {props.questions[props.index].answers.length} answers </span>
      <div className="question-title-answers-page"> {props.questions[props.index].title} </div>
      <div><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>
    </div>
    <div className="question-details-answers-page">
        <span className="views-count-answers-page"> {props.questions[props.index].views} views</span>
        <span className="question-text-answer-page"> {props.questions[props.index].text} </span>
        <div className="answer-info">
          <span className="post-username-question-answers-page"> {props.questions[props.index].asked_by} </span>
          <span className="post-time-answers-page"> asked {monthArr[new Date(props.questions[props.index].ask_date_time).getMonth()]} {new Date(props.questions[props.index].ask_date_time).getDay()}, {new Date(props.questions[props.index].ask_date_time).getFullYear()} at {new Date(props.questions[props.index].ask_date_time).getHours()}:{String(new Date(props.questions[props.index].ask_date_time).getMinutes()).padStart(2, '0')}</span>
        </div>
    </div></div>
    
    }
    else if (hours >= 24) {
      answerPage = <div> <div className="answers-header">
      <span className="answer-count-answers-page"> {props.questions[props.index].answers.length} answers </span>
      <div className="question-title-answers-page"> {props.questions[props.index].title} </div>
      <div><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>
    </div>
    <div className="question-details-answers-page">
        <span className="views-count-answers-page"> {props.questions[props.index].views} views</span>
        <span className="question-text-answer-page"> {props.questions[props.index].text} </span>
        <div className="answer-info">
          <span className="post-username-question-answers-page"> {props.questions[props.index].asked_by} </span>
          <span className="post-time-answers-page"> asked {monthArr[new Date(props.questions[props.index].ask_date_time).getMonth()]} {new Date(props.questions[props.index].ask_date_time).getDay()} at {new Date(props.questions[props.index].ask_date_time).getHours()}:{String(new Date(props.questions[props.index].ask_date_time).getMinutes()).padStart(2, '0')}</span>
        </div>
    </div></div>
  }
  let newAnsArray = [];
  props.questions[props.index].answers.forEach((ansIdForQuestion)=>{
    props.ansArray.forEach((ans)=>{
      if (ansIdForQuestion === ans._id){
        newAnsArray.push(ans)
      }
    })
  })
  const sortedAnsArray = newAnsArray.sort(function(a, b){
    return new Date(b.ans_date_time) - new Date(a.ans_date_time);
  })

  sortedAnsArray.forEach(a => {
    if (props.questions[props.index].answers.includes(a._id)){
      let ans = props.ansArray.find(answer => answer._id === a._id);
      let answerPost;
      currTime = new Date();
      let elapsedTime = currTime.getTime() - new Date(ans.ans_date_time).getTime();
      let startYear = new Date(ans.ans_date_time).getFullYear();
      let endYear = currTime.getFullYear();

      let years = Math.abs(Math.floor(endYear - startYear));
      if (currTime.getMonth() < new Date(ans.ans_date_time).getMonth() || (currTime.getMonth() === new Date(ans.ans_date_time).getMonth() && currTime.getDate() < new Date(ans.ans_date_time).getDate())) {
          years--;
      }
      
      let hours = Math.abs(Math.floor(elapsedTime / (1000 * 60 * 60)));
      let minutes = Math.abs(Math.floor(elapsedTime / (1000 * 60)));
      let seconds = Math.abs(Math.floor(elapsedTime / 1000));
      const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
      if (seconds < 60){
        answerPost = <div className="answer-post"> <div className="answer-text">{ans.text}</div>
        <div className="answer-info2">
          <span className="post-username-answers-page"> {ans.ans_by} </span>
          <span className="post-time-answers-page"> answered {seconds} seconds ago</span>
        </div></div>
      }
      else if (minutes < 60){
        answerPost = <div className="answer-post"> <div className="answer-text">{ans.text}</div>
        <div className="answer-info2">
          <span className="post-username-answers-page"> {ans.ans_by} </span>
          <span className="post-time-answers-page"> answered {minutes} minutes ago</span>
        </div></div>
       
        
      }
      else if (hours < 24){
        answerPost = <div className="answer-post"> <div className="answer-text">{ans.text}</div>
        <div className="answer-info2">
          <span className="post-username-answers-page"> {ans.ans_by} </span>
          <span className="post-time-answers-page"> answered {hours} hours ago</span>
        </div></div>
      }
      else if (years >= 0){
        answerPost = <div className="answer-post">  <div className="answer-text">{ans.text}</div>
        <div className="answer-info2">
          <span className="post-username-answers-page"> {ans.ans_by} </span>
          <span className="post-time-answers-page"> answered {monthArr[new Date(ans.ans_date_time).getMonth()]} {new Date(ans.ans_date_time).getDay()}, {new Date(ans.ans_date_time).getFullYear()} at {new Date(ans.ans_date_time).getHours()}:{String(new Date(ans.ans_date_time).getMinutes()).padStart(2, '0')}</span>
        </div></div>


      }
      else if (hours >= 24) {
        answerPost = <div className="answer-post">  <div className="answer-text">{ans.text}</div>
        <div className="answer-info2">
          <span className="post-username-answers-page"> {ans.ans_by} </span>
          <span className="post-time-answers-page"> answered {monthArr[new Date(ans.ans_date_time).getMonth()]} {new Date(ans.ans_date_time).getDay()} at {new Date(ans.ans_date_time).getHours()}:{String(new Date(ans.ans_date_time).getMinutes()).padStart(2, '0')}</span>
        </div>
        </div>
      }
      answerPosts.push(answerPost);
    }
  });

  return (
    <>
        <div>{answerPage}</div>
        <div className="answer-posts">{answerPosts}</div>
        <button onClick={() => props.showAnswerForm(true)} id="answer-question-btn">Answer Question</button>
    </>
  );
}

Answers.propTypes = {
  questions: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  ansArray: PropTypes.array.isRequired,
  handleAskQuestionBtn: PropTypes.func.isRequired,
  showAnswerForm: PropTypes.func.isRequired
};
