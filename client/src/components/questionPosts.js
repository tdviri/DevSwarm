import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function QuestionPosts(props) {
    const [startIndex, setStartIndex] = useState(0);

    const questionData = props.questions.slice(startIndex, startIndex + 5).map(question => {
      const postUsername = `${question.asked_by}`;
      let postTime;
      const currentTime = new Date();
      const elapsedTime = currentTime.getTime() - new Date(question.ask_date_time).getTime();
      const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
      const minutes = Math.floor(elapsedTime / (1000 * 60));
      const seconds = Math.floor(elapsedTime / 1000);
      const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      if (minutes < 1) {
        postTime = `asked ${seconds} seconds ago`;
      }
      else if (hours < 1) {
        postTime = `asked ${minutes} minutes ago`;
      }
      else if (hours < 24) {
        postTime = `asked ${hours} hours ago`;
      }
      else if (elapsedTime < 365 * 24 * 60 * 60 * 1000) {
        const month = new Date(question.ask_date_time).getMonth();
        const day = new Date(question.ask_date_time).getDate();
        const hour = new Date(question.ask_date_time).getHours();
        const minute = new Date(question.ask_date_time).getMinutes();
        postTime = `asked ${monthArr[month]} ${day} at ${hour}:${minute < 10 ? '0' + minute : minute}`;
      }
      else {
        const year = new Date(question.ask_date_time).getFullYear();
        const month = new Date(question.ask_date_time).getMonth();
        const day = new Date(question.ask_date_time).getDate();
        const hour = new Date(question.ask_date_time).getHours();
        const minute = new Date(question.ask_date_time).getMinutes();
        postTime = `asked ${monthArr[month]} ${day}, ${year} at ${hour}:${minute < 10 ? '0' + minute : minute}`;
      }
    
      return {
        ...question,
        postUsername,
        postTime
      };
    });

    const handleNext = () => {
      if (startIndex + 5 < props.questions.length) {
        setStartIndex(startIndex + 5);
      }
    };

    const handlePrev = () => {
      if (startIndex >= 5) {
        setStartIndex(startIndex - 5);
      }
    };

    function handleVote(upvote, question){
      if (props.isGuest){
        return;
      }
      if (upvote){
        props.loggedInUser.reputation += 5;
        question.votes += 1;
      }
      else{
        props.loggedInUser.reputation -= 10;
        question.votes -= 1;
      }
    }

  return (
      <div className="posts-container">
        {questionData.map((question, index) => (
          <div key={index} id={`post${index}`} className='post'>
            <div className="upvote-downvote-arrows"> 
              <div className="upvote-arrow" disabled={props.loggedInUser && props.loggedInUser.reputation < 50} onClick={()=>handleVote(true, question)}><FaArrowUp className={props.isGuest ? 'guest-upvote' : 'authenticated-upvote'} /></div>
              <div className="vote-count">{question.votes}</div>
              <div className="downvote-arrow" disabled={props.loggedInUser && props.loggedInUser.reputation < 50} onClick={()=>handleVote(false, question)}><FaArrowDown className={props.isGuest ? 'guest-downvote' : 'authenticated-downvote'} /></div>
            </div>
            <div className='view-and-answer-count'>
              <span className="answer-count">{question.answers.length} answers</span>
              <span className="views-count">{question.views} views</span>
            </div>
            <div id={`post-title${index}`} className='title-and-tags'>
              <span onClick={() =>  props.handleAnswerPageIndex(index, props.questions, props.answers, true)} className='post-title'>{question.title}</span>
              <div className='tags'>
                {question.tags.map((tagId, tagIndex) => (
                  <span className="tag" key={tagIndex}>
                    {props.tags.find(tag => tag._id === tagId)?.name}
                  </span>
                ))}
              </div>
            </div>
            <span className="post-username">{question.postUsername}</span>
            <span className="post-time">{question.postTime}</span>
          </div>
        ))}
         {props.questions.length > 5 && <div className="pagination">
            <button onClick={handlePrev} disabled={startIndex === 0}>Prev</button>
            <button onClick={handleNext} disabled={startIndex + 5 >= props.questions.length}>Next</button>
          </div>}
      </div>
  );
}