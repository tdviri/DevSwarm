import React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import QuestionCommentForm from './questionCommentForm';
import axios from 'axios';

export default function QuestionPosts(props) {
    const [startIndex, setStartIndex] = useState(0);
    const [commentStartIndex, setCommentStartIndex] = useState(0);
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [questions, setQuestions] = useState(props.questions);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
      setQuestions(props.questions);
    }, [props.questions]);

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
      if (startIndex + 5 < questions.length) {
        setStartIndex(startIndex + 5);
      }
    };

    const handlePrev = () => {
      if (startIndex >= 5) {
        setStartIndex(startIndex - 5);
      }
    };

    async function handleVote(upvote, question){
      if (props.isGuest){
        return;
      }
      const questionIsVoted = (await axios.get(`http://localhost:8000/api/isquestionvoted/${question._id}`, { withCredentials: true,
      })).data;
      if (questionIsVoted){
        return;
      }
      try {
        const data = new URLSearchParams();
        data.append('upvote', upvote);
        data.append('question', question._id);
        await axios.put('http://localhost:8000/api/addvotedquestion', data, {withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }});
        props.fetchData();
      } catch(error){
        if (error.response && error.response.data.errorMessage === "Must have at least 50 reputation points to vote."){
          alert("Must have at least 50 reputation points to vote.");
        }
        else if (error.request) {
          alert('Communication error: Unable to connect to the server. Please try again later.');
        } 
        else {
          alert('System error');
        }
        props.goToWelcomePage();
      }
    }

    const toggleDropdown = (questionId) => {
      setCommentStartIndex(0);
      if (activeDropdownId === questionId) {
          setActiveDropdownId(null); 
      } else {
          setActiveDropdownId(questionId); 
      }
  };

    async function handleCommentVote(comment) {
      if (props.isGuest) {
        return; 
      }
      const commentIsVoted = (await axios.get(`http://localhost:8000/api/iscommentvoted/${comment._id}`, { withCredentials: true })).data;
      if (commentIsVoted){
        return;
      }
      try {
        const data = new URLSearchParams();
        data.append('comment', comment._id);
        await axios.put('http://localhost:8000/api/addvotedcomment', data, {withCredentials: true, 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }});
        props.fetchData();
      } catch(error){
        if (error.request) {
          alert('Communication error: Unable to connect to the server. Please try again later.');
        } 
        else {
          alert('System error');
        }
        props.goToWelcomePage();
      }
    }

    function handleFormSubmit(question, inputValue) {
      questions.forEach(ans => {
        if (ans.text === question){
          question = ans;
        }
      })
      postComment(question, inputValue);
      setInputValue('');
  }

  function getSortedComments(questionComments){
    if (!questionComments || !props.comments) return [];
    return props.comments.filter(comment => questionComments.includes(comment._id))
    .sort((a, b) => new Date(b.comm_date_time) - new Date(a.comm_date_time));
  }

  async function postComment(question, commentText) {
    try {
        const resp = await axios.post('http://localhost:8000/api/addcomment', { commentText: commentText }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const comment = resp.data;
        await axios.put('http://localhost:8000/api/updatequestioncomments', { questionId: question._id, commentId: comment._id }, {
            withCredentials: true
        });

      const updatedQuestions = questions.map(q => {
            if (q._id === question._id) {
                return { ...q, comments: [...q.comments, comment._id] };
            }
            return q;
        });
        setQuestions(updatedQuestions);
        props.fetchData();
      } 
      catch (error) {
        if (error.response) {
            alert(error.response.data.errorMessage || 'System error');
        } else if (error.request) {
            alert('Communication error: Unable to connect to the server. Please try again later.');
        } else {
            alert('System error');
        }
    }
}

  return (
      <div className="posts-container">
        {questionData.map((question, index) => (
          <div key={index} id={`post${index}`} className='post'>
            <div className="upvote-downvote-arrows"> 
              <div className="upvote-arrow" onClick={()=>handleVote(true, question)}><FaArrowUp className={props.isGuest ? 'guest-upvote' : 'authenticated-upvote'} /></div>
              <div className="vote-count">{question.votes}</div>
              <div className="downvote-arrow" onClick={()=>handleVote(false, question)}><FaArrowDown className={props.isGuest ? 'guest-downvote' : 'authenticated-downvote'} /></div>
            </div>
            <div className='view-and-answer-count'>
              <span className="answer-count">{question.answers.length} answers</span>
              <span className="views-count">{question.views} views</span>
            </div>
            <div id={`post-title${index}`} className='title-and-tags'>
              <span onClick={() =>{props.handleAnswerPageIndex(index, questions, true) }} className='post-title'>{question.title}</span>
              <div className='tags'>
                {question.tags.map((tagId, tagIndex) => (
                  <span className="tag" key={tagIndex}>
                    {props.tags.find(tag => tag._id === tagId)?.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="post-info">
              <span className="post-username">{question.postUsername}</span>
              <span className="post-time">{question.postTime}</span>
            </div>
            {props.isLoggedIn && <div className="question-comment-form"><QuestionCommentForm question={question} handleFormSubmit={handleFormSubmit}/></div>}
            {question.comments.length > 0 && (
              <div className="comments-dropdown">
                <div className="comments-dropdown-header" onClick={() => toggleDropdown(question._id)}>
                  Show Comments
                </div>
              {activeDropdownId === question._id && getSortedComments(question.comments).slice(commentStartIndex, commentStartIndex + 3).map((comment, commentIndex) => {
                if (comment) {
                  return (
                    <div className="comment-post" key={commentIndex}>
                      <div className="comment-upvote"> 
                        <div className="comment-upvote-arrow" onClick={() => handleCommentVote(comment)}>
                          <FaArrowUp className={props.isGuest ? 'guest-upvote' : 'authenticated-upvote'} />
                        </div>
                        <div className="comment-vote-count">{comment.votes}</div>
                      </div>
                      <span className="comment-post-text">{comment.text}</span>
                      <div className="comment-info">
                        <span className="comment-post-username">commented by {comment.comm_by}</span>
                      </div>
                    </div>
                  );
                } else {
                  return null; 
                }
              })
              }
               {question.comments.length > 3 && activeDropdownId === question._id && (
                <div className="comments-pagination-buttons">
                  <button disabled={commentStartIndex === 0} onClick={() => setCommentStartIndex(commentStartIndex - 3)}>Prev</button>
                  <button disabled={commentStartIndex + 3 >= question.comments.length} onClick={() => setCommentStartIndex(commentStartIndex + 3)}>Next</button>
                </div>
            )}
            </div>
          )}
          </div>
        ))}
         {questions.length > 5 && <div className="pagination">
            <button onClick={handlePrev} disabled={startIndex === 0}>Prev</button>
            <button onClick={handleNext} disabled={startIndex + 5 >= questions.length}>Next</button>
          </div>}
      </div>
  );
}