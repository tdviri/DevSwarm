import React from 'react';
import PropTypes from 'prop-types';

export default function QuestionPosts(props) {
    const questionData = props.questions.map(question => {
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

  return (
      <div className="posts-container">
        {questionData.map((question, index) => (
          <div key={index} id={`post${index}`} className='post'>
            <div className='view-and-answer-count'>
              <span className="answer-count">{question.answers.length} answers</span>
              <span className="views-count">{question.views} views</span>
            </div>
            <div id={`post-title${index}`} className='title-and-tags'>
              <span onClick={() =>  props.handleAnswerPageIndex(index, props.questions, props.ansArray, true)} className='post-title'>{question.title}</span>
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
      </div>
  );
}

QuestionPosts.propTypes = {
    tags: PropTypes.array.isRequired,
    questions: PropTypes.array.isRequired,
    ansArray: PropTypes.array.isRequired,
    handleAnswerPageIndex: PropTypes.func.isRequired
};
