import React from 'react';
import '../stylesheets/App.css';
import { FaArrowUp } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';

export default function Answers(props) {
    const [startIndex, setStartIndex] = useState(0);
    const [openDropdowns, setOpenDropdowns] = useState({});
    
    const toggleDropdown = (index) => {
      setOpenDropdowns((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
      }));
    };

    async function handleVote(comment) {
      const commentIsVoted = (await axios.get(`http://localhost:8000/api/iscommentvoted/${comment._id}`, { withCredentials: true })).data;
      if (props.isGuest || commentIsVoted){
        return;
      }
      try {
        const data = new URLSearchParams();
        await axios.put('http://localhost:8000/api/handlecommentvote', comment._id, {withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }});
        props.fetchData();
      } catch(error){
        if (error.request) {
          alert('Communication error: Unable to connect to the server. Please try again later.');
        } 
        else {
          alert('System error: Login failed');
        }
        props.goToWelcomePage();
      }
    }

    let currTime = new Date();
    let elapsedTime = currTime.getTime() - new Date(props.questions[props.answerPageIndex].ask_date_time).getTime();
    let answerPosts = [];
    let answerPage;
    let startYear = new Date(props.questions[props.answerPageIndex].ask_date_time).getFullYear();
    let endYear = currTime.getFullYear();

    let years = Math.abs(Math.floor(endYear - startYear));
    if (currTime.getMonth() < new Date(props.questions[props.answerPageIndex].ask_date_time).getMonth() || (currTime.getMonth() === new Date(props.questions[props.answerPageIndex].ask_date_time).getMonth() && currTime.getDate() < new Date(props.questions[props.answerPageIndex].ask_date_time).getDate())) {
        years--;
    }
    
    let hours = Math.abs(Math.floor(elapsedTime / (1000 * 60 * 60)));
    let minutes = Math.abs(Math.floor(elapsedTime / (1000 * 60)));
    let seconds = Math.abs(Math.floor(elapsedTime / 1000));
    const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (seconds < 60){
      answerPage  = 
      <div> <div className="answers-header">
      <span className="answer-count-answers-page"> {props.questions[props.answerPageIndex].answers.length} answers </span>
      <div className="question-title-answers-page"> {props.questions[props.answerPageIndex].title} </div>
      {props.isLoggedIn && <div><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>}
    </div>
    <div className="question-details-answers-page">
        <span className="views-count-answers-page"> {props.questions[props.answerPageIndex].views} views</span>
        <span className="question-text-answer-page"> {props.questions[props.answerPageIndex].text} </span>
        <div className="answer-info">
          <span className="post-username-question-answers-page"> {props.questions[props.answerPageIndex].asked_by} </span>
          <span className="post-time-answers-page"> asked {seconds} seconds ago</span>Name
        </div>
    </div></div>
      
    }
    else if (minutes < 60){
      answerPage = <div> <div className="answers-header">
      <span className="answer-count-answers-page"> {props.questions[props.answerPageIndex].answers.length} answers </span>
      <div className="question-title-answers-page"> {props.questions[props.answerPageIndex].title} </div>
      {props.isLoggedIn && <div><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>}
    </div>
    <div className="question-details-answers-page">
        <span className="views-count-answers-page"> {props.questions[props.answerPageIndex].views} views</span>
        <span className="question-text-answer-page"> {props.questions[props.answerPageIndex].text} </span>
        <div className="answer-info">
          <span className="post-username-question-answers-page"> {props.questions[props.answerPageIndex].asked_by} </span>
          <span className="post-time-answers-page"> asked {minutes} minutes ago</span>
        </div>
    </div></div>
    }
    else if (hours < 24){
      answerPage = <div>
         <div className="answers-header">
        <span className="answer-count-answers-page"> {props.questions[props.answerPageIndex].answers.length} answers </span>
        <div className="question-title-answers-page"> {props.questions[props.answerPageIndex].title} </div>
        {props.isLoggedIn && <div><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>}
      </div>
      <div className="question-details-answers-page">
          <span className="views-count-answers-page"> {props.questions[props.answerPageIndex].views} views</span>
          <span className="question-text-answer-page"> {props.questions[props.answerPageIndex].text} </span>
          <div className="answer-info">
            <span className="post-username-question-answers-page"> {props.questions[props.answerPageIndex].asked_by} </span>
            <span className="post-time-answers-page"> asked {hours} hours ago</span>
          </div>
      </div>
      </div>
    }

    else if (years >= 0){
      answerPage = 
      <div> <div className="answers-header">
      <span className="answer-count-answers-page"> {props.questions[props.answerPageIndex].answers.length} answers </span>
      <div className="question-title-answers-page"> {props.questions[props.answerPageIndex].title} </div>
      {props.isLoggedIn && <div><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>}
    </div>
    <div className="question-details-answers-page">
        <span className="views-count-answers-page"> {props.questions[props.answerPageIndex].views} views</span>
        <span className="question-text-answer-page"> {props.questions[props.answerPageIndex].text} </span>
        <div className="answer-info">
          <span className="post-username-question-answers-page"> {props.questions[props.answerPageIndex].asked_by} </span>
          <span className="post-time-answers-page"> asked {monthArr[new Date(props.questions[props.answerPageIndex].ask_date_time).getMonth()]} {new Date(props.questions[props.answerPageIndex].ask_date_time).getDay()}, {new Date(props.questions[props.answerPageIndex].ask_date_time).getFullYear()} at {new Date(props.questions[props.answerPageIndex].ask_date_time).getHours()}:{String(new Date(props.questions[props.answerPageIndex].ask_date_time).getMinutes()).padStart(2, '0')}</span>
        </div>
    </div></div>
    
    }
    else if (hours >= 24) {
      answerPage = <div> <div className="answers-header">
      <span className="answer-count-answers-page"> {props.questions[props.answerPageIndex].answers.length} answers </span>
      <div className="question-title-answers-page"> {props.questions[props.answerPageIndex].title} </div>
      {props.isLoggedIn && <div><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>}
    </div>
    <div className="question-details-answers-page">
        <span className="views-count-answers-page"> {props.questions[props.answerPageIndex].views} views</span>
        <span className="question-text-answer-page"> {props.questions[props.answerPageIndex].text} </span>
        <div className="answer-info">
          <span className="post-username-question-answers-page"> {props.questions[props.answerPageIndex].asked_by} </span>
          <span className="post-time-answers-page"> asked {monthArr[new Date(props.questions[props.answerPageIndex].ask_date_time).getMonth()]} {new Date(props.questions[props.answerPageIndex].ask_date_time).getDay()} at {new Date(props.questions[props.answerPageIndex].ask_date_time).getHours()}:{String(new Date(props.questions[props.answerPageIndex].ask_date_time).getMinutes()).padStart(2, '0')}</span>
        </div>
    </div></div>
  }
  let newAnsArray = [];
  props.questions[props.answerPageIndex].answers.forEach((ansIdForQuestion)=>{
    props.answers.forEach((ans)=>{
      if (ansIdForQuestion === ans._id){
        newAnsArray.push(ans)
      }
    })
  })
  const sortedAnsArray = newAnsArray.sort(function(a, b){
    return new Date(b.ans_date_time) - new Date(a.ans_date_time);
  })

  sortedAnsArray.forEach(a => {
    if (props.questions[props.answerPageIndex].answers.includes(a._id)){
      let ans = props.answers.find(answer => answer._id === a._id);
      let answerPostTimeMessage;
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
        answerPostTimeMessage = `answered ${seconds} seconds ago`;
      }
      else if (minutes < 60){
        answerPostTimeMessage = `answered ${minutes} minutes ago`;
      }
      else if (hours < 24){
        answerPostTimeMessage = `answered ${hours} hours ago`;
      }
      else if (years >= 0){
        answerPostTimeMessage = `answered ${monthArr[new Date(ans.ans_date_time).getMonth()]} ${new Date(ans.ans_date_time).getDay()}, ${new Date(ans.ans_date_time).getFullYear()} at ${new Date(ans.ans_date_time).getHours()}:${String(new Date(ans.ans_date_time).getMinutes()).padStart(2, '0')}`;
      }
      else if (hours >= 24) {
        answerPostTimeMessage = `answered ${monthArr[new Date(ans.ans_date_time).getMonth()]} ${new Date(ans.ans_date_time).getDay()} at ${new Date(ans.ans_date_time).getHours()}:${String(new Date(ans.ans_date_time).getMinutes()).padStart(2, '0')}`;
      }


      const answerPost = (
        <div className="answer-post">
          <div className="answer-text">{ans.text}</div>
          <div className="answer-info2">
            <span className="post-username-answers-page">{ans.ans_by}</span>
            <span className="post-time-answers-page">answered {seconds} seconds ago</span>
          </div>
          {ans.comments && (
            <div className="comments-dropdown">
              <div className="comments-dropdown-header" onClick={() => toggleDropdown(props.answerPageIndex)}>
                Show Comments
              </div>
              {openDropdowns[props.answerPageIndex] && ans.comments.map((commentId, commentIndex) => {
                const comment = props.comments.find(comment => comment._id === commentId);
                if (comment) {
                  return (
                    <div className="comment-post" key={commentIndex}>
                      <div className="comment-upvote-arrow">
                        <div className="comment-upvote-arrow" onClick={() => handleVote(comment)}>
                          <FaArrowUp className={props.isGuest ? 'guest-upvote' : 'authenticated-upvote'} />
                        </div>
                        <div className="vote-count">{comment.votes}</div>
                      </div>
                      <span className="comment-post-text">{comment.text}</span>
                      <span className="comment-post-time-message">{answerPostTimeMessage}</span>
                    </div>
                  );
                } else {
                  return null; 
                }
              })}
            </div>
          )}
        </div>
      );
      
      answerPosts.push(answerPost);
    }
  });

  return (
    <>
        <div>{answerPage}</div>
        <div className="answer-posts">{answerPosts.slice(startIndex, startIndex + 5)}</div>
        {answerPosts.length > 5 && <div className="pagination-buttons">
            <button disabled={startIndex === 0} onClick={() => setStartIndex(startIndex - 5)}>Prev</button>
            <button disabled={startIndex + 5 >= answerPosts.length} onClick={() => setStartIndex(startIndex + 5)}>Next</button>
        </div>}
        {props.isLoggedIn && <button onClick={() => props.showAnswerForm(true)} id="answer-question-btn">Answer Question</button>}
    </>
  );
}


