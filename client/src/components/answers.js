import React from 'react';
import '../stylesheets/App.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import EditAnswerForm from './editAnswerForm';
import CommentForm from './commentForm';
import axios from 'axios';

export default function Answers(props) {
    const [startIndex, setStartIndex] = useState(0);
    const [commentStartIndex, setCommentStartIndex] = useState(0);
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [displayEditAnswerForm, setDisplayEditAnswerForm] = useState(false);
    const [answerToEdit, setAnswerToEdit] = useState(null);
    const [answers, setAnswers] = useState(props.answers);
    const [answerPosts, setAnswerPosts] = useState([]);
    const [answerPage, setAnswerPage] = useState(null);
    const [numOfAnswers, setNumOfAnswers] = useState(props.questions[props.answerPageIndex].answers.length);
    const [inputValue, setInputValue] = useState('');

    useEffect(()=>{
      let currTime = new Date();
      let elapsedTime = currTime.getTime() - new Date(props.questions[props.answerPageIndex].ask_date_time).getTime();
      let answerPageTimeMessage;
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
        answerPageTimeMessage = `asked ${seconds} seconds ago`;
      }
      else if (minutes < 60){
        answerPageTimeMessage = `asked ${minutes} minutes ago`;
      }
      else if (hours < 24){
        answerPageTimeMessage = `asked ${hours} hours ago`;
      }
      else if (years >= 0){
        answerPageTimeMessage = `asked ${monthArr[new Date(props.questions[props.answerPageIndex].ask_date_time).getMonth()]} ${new Date(props.questions[props.answerPageIndex].ask_date_time).getDay()}, ${new Date(props.questions[props.answerPageIndex].ask_date_time).getFullYear()} at ${new Date(props.questions[props.answerPageIndex].ask_date_time).getHours()}:${String(new Date(props.questions[props.answerPageIndex].ask_date_time).getMinutes()).padStart(2, '0')}`;
      }
      else if (hours >= 24) {
        answerPageTimeMessage = `asked ${monthArr[new Date(props.questions[props.answerPageIndex].ask_date_time).getMonth()]} ${new Date(props.questions[props.answerPageIndex].ask_date_time).getDay()} at ${new Date(props.questions[props.answerPageIndex].ask_date_time).getHours()}:${String(new Date(props.questions[props.answerPageIndex].ask_date_time).getMinutes()).padStart(2, '0')}`;
    }
  
    const updatedAnswerPage  = 
    <div> <div className="answers-header">
    <span className="answer-count-answers-page"> {numOfAnswers} answers </span>
    <div className="question-title-answers-page"> {props.questions[props.answerPageIndex].title} </div>
    {props.isLoggedIn && <div><button onClick={()=>props.handleAskQuestionBtn(true)} className="ask-question-btn">Ask Question</button></div>}
  </div>
  <div className="question-details-answers-page">
      <span className="views-count-answers-page"> {props.questions[props.answerPageIndex].views} views</span>
      <span className="question-text-answer-page"> {props.questions[props.answerPageIndex].text} </span>
      <div className="answer-info">
        <span className="post-username-question-answers-page"> {props.questions[props.answerPageIndex].asked_by} </span>
        <span className="post-time-answers-page">{answerPageTimeMessage}</span>
      </div>
  </div></div>
  setAnswerPage(updatedAnswerPage);

  let newAnsArray = [];
  props.questions[props.answerPageIndex].answers.forEach((ansIdForQuestion)=>{
    answers.forEach((ans)=>{
      if (ansIdForQuestion === ans._id){
        newAnsArray.push(ans)
      }
    })
  })
  const sortedAnsArray = newAnsArray.sort(function(a, b){
    return new Date(b.ans_date_time) - new Date(a.ans_date_time);
  })

  let newAnsPostsArr = [];
  sortedAnsArray.forEach(ans => {
    if (props.questions[props.answerPageIndex].answers.includes(ans._id)){
      const comment = props.comments.find(comment => props.questions[props.answerPageIndex].answers.comments && props.questions[props.answerPageIndex].answers.comments.includes(comment._id));
      let commAnswerPostTimeMessage;
      let endYear = currTime.getFullYear();
      const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      if (comment){
        let commElapsedTime = currTime.getTime() - new Date(comment.comm_date_time).getTime();
        let commStartYear = new Date(comment.comm_date_time).getFullYear();
        let commYears = Math.abs(Math.floor(endYear - commStartYear));
        if (currTime.getMonth() < new Date(comment.comm_date_time).getMonth() || (currTime.getMonth() === new Date(comment.comm_date_time).getMonth() && currTime.getDate() < new Date(comment.comm_date_time).getDate())){
          commYears--;
        }
        let commHours = Math.abs(Math.floor(commElapsedTime / (1000 * 60 * 60)));
        let commMinutes = Math.abs(Math.floor(commElapsedTime / (1000 * 60)));
        let commSeconds = Math.abs(Math.floor(commElapsedTime / 1000));
        if (commSeconds < 60){
          commAnswerPostTimeMessage =  `commented ${commSeconds} seconds ago`;
        }
        else if (commMinutes < 60){
          commAnswerPostTimeMessage = `commented ${commMinutes} minutes ago`;
        }
        else if (commHours < 24){
          commAnswerPostTimeMessage = `commented ${commHours} hours ago`;
        }
        else if (commYears >= 0){
          commAnswerPostTimeMessage = `commented ${monthArr[new Date(comment.comm_date_time).getMonth()]} ${new Date(comment.comm_date_time).getDay()}, ${new Date(comment.comm_date_time).getFullYear()} at ${new Date(comment.comm_date_time).getHours()}:${String(new Date(comment.comm_date_time).getMinutes()).padStart(2, '0')}`
        }
        else if (commHours >= 24) {
          commAnswerPostTimeMessage = `commented ${monthArr[new Date(comment.comm_date_time).getMonth()]} ${new Date(comment.comm_date_time).getDay()} at ${new Date(comment.comm_date_time).getHours()}:${String(new Date(comment.comm_date_time).getMinutes()).padStart(2, '0')}`
        }
      }
      let answerPostTimeMessage;
      currTime = new Date();
      let elapsedTime = currTime.getTime() - new Date(ans.ans_date_time).getTime();
      let startYear = new Date(ans.ans_date_time).getFullYear();

      let years = Math.abs(Math.floor(endYear - startYear));
      if (currTime.getMonth() < new Date(ans.ans_date_time).getMonth() || (currTime.getMonth() === new Date(ans.ans_date_time).getMonth() && currTime.getDate() < new Date(ans.ans_date_time).getDate())) {
          years--;
      }
      
      let hours = Math.abs(Math.floor(elapsedTime / (1000 * 60 * 60)));
      let minutes = Math.abs(Math.floor(elapsedTime / (1000 * 60)));
      let seconds = Math.abs(Math.floor(elapsedTime / 1000));
  
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
          <div className="answer-upvote-downvote-arrows"> 
            <div className="answer-upvote-arrow" onClick={()=>handleAnswerVote(true, ans)}><FaArrowUp className={props.isGuest ? 'guest-upvote' : 'authenticated-upvote'} /></div>
            <div className="answer-vote-count">{ans.votes}</div>
            <div className="answer-downvote-arrow" onClick={()=>handleAnswerVote(false, ans)}><FaArrowDown className={props.isGuest ? 'guest-downvote' : 'authenticated-downvote'} /></div>
          </div>
          <div className="answer-text">{ans.text}</div>
          <div className="answer-info2">
            <span className="post-username-answers-page">{ans.ans_by}</span>
            <span className="post-time-answers-page">{answerPostTimeMessage}</span>
          </div>
          <div className="comment-form"><CommentForm ans={ans} handleFormSubmit={handleFormSubmit} /></div>
          {props.isLoggedIn && (
                <div className="answer-modification-buttons">
                  <button className="edit-answer-btn" onClick={() => editAnswer(ans)}>Edit</button>
                  <button className="delete-answer-btn" onClick={() => deleteAnswer(ans)}>Delete</button>
                </div>
              )}
          {ans.comments.length > 0 && (
            <div className="comments-dropdown">
              <div className="comments-dropdown-header" onClick={() => toggleDropdown(ans._id)}>
                Show Comments
              </div>
              {console.log("comment start index", commentStartIndex)}
              {activeDropdownId === ans._id && getSortedComments(ans.comments).slice(commentStartIndex, commentStartIndex + 3).map((comment, commentIndex) => {
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
                        <span className="comment-post-time-message">{commAnswerPostTimeMessage}</span>
                      </div>
                    </div>
                  );
                } else {
                  return null; 
                }
              })
              }
               {ans.comments.length > 3 && activeDropdownId === ans._id && (
                <div className="comments-pagination-buttons">
                  <button disabled={commentStartIndex === 0} onClick={() => setCommentStartIndex(commentStartIndex - 3)}>Prev</button>
                  <button disabled={commentStartIndex + 3 >= ans.comments.length} onClick={() => setCommentStartIndex(commentStartIndex + 3)}>Next</button>
                </div>
            )}
            </div>
          )}
         
        </div>
      );
      newAnsPostsArr.push(answerPost);
    }
  });
  setAnswerPosts(newAnsPostsArr);
},[answers, numOfAnswers, activeDropdownId, commentStartIndex, props])

function getSortedComments(answerComments){
  if (!answerComments || !props.comments) return [];
  return props.comments.filter(comment => answerComments.includes(comment._id))
  .sort((a, b) => new Date(b.comm_date_time) - new Date(a.comm_date_time));
}

function handleFormSubmit(answer, inputValue) {
    answers.forEach(ans => {
      if (ans.text === answer){
        answer = ans;
      }
    })
    postComment(answer, inputValue);
    setInputValue('');
}

    const toggleDropdown = (ansId) => {
      setCommentStartIndex(0);
      if (activeDropdownId === ansId) {
          setActiveDropdownId(null); 
      } else {
          setActiveDropdownId(ansId); 
      }
  };
    async function handleAnswerVote(upvote, answer){
      if (props.isGuest){
        return;
      }
      const questionIsVoted = (await axios.get(`http://localhost:8000/api/isanswervoted/${answer._id}`, { withCredentials: true,
      })).data;
      if (questionIsVoted){
        return;
      }
      try {
        const data = new URLSearchParams();
        data.append('upvote', upvote);
        data.append('answer', answer._id);
        await axios.put('http://localhost:8000/api/addvotedanswer', data, {withCredentials: true,
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

    async function postComment(ans, commentText){
      try {
        const resp = await axios.post('http://localhost:8000/api/addcomment', {commentText: commentText}, {withCredentials: true, headers: {
          'Content-Type': 'application/json',
        }});
        const comment = resp.data;
        await axios.put('http://localhost:8000/api/updateanswercomments', {ansId: ans._id, commentId: comment._id}, {withCredentials: true});
        const updatedAnswers = answers.map(answer => {
          if (answer._id === ans._id) {
              return {...answer, comments: [...answer.comments, comment._id]}; 
          }
          return answer;
      });
      setAnswers(updatedAnswers);
        props.fetchData();
      } catch(error){
        if (error.request) {
          alert('Communication error: Unable to connect to the server. Please try again later.');
        } 
        else {
          alert('System error: Login failed');
        }
      }
    }

    function replaceWithEditedAnswer(newAnswer) {
      const newAnswers = answers.map(ans => {
        if (ans._id === newAnswer._id) {
          return newAnswer;
        }
        return ans;
      });
      setAnswers(newAnswers);
    }

  async function editAnswer(answer){
    setAnswerToEdit(answer);
    setDisplayEditAnswerForm(true);
  }

  async function deleteAnswer(answer){
    await axios.delete('http://localhost:8000/api/deleteanswer', {withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    }, data: answer});
    setAnswers(prevAnswers => prevAnswers.filter(ans => ans._id !== answer._id));
    setNumOfAnswers(prevNumOfAnswer => prevNumOfAnswer - 1);
    props.fetchData()
  }

  return (
    <div>
      {displayEditAnswerForm && <EditAnswerForm replaceWithEditedAnswer={replaceWithEditedAnswer} fetchData={props.fetchData} answerToEdit={answerToEdit} setDisplayEditAnswerForm={setDisplayEditAnswerForm} />}
      {!displayEditAnswerForm && <div>
        <div>{answerPage}</div>
        <div className="answer-posts">
          {answerPosts.slice(startIndex, startIndex + 5).map((post, index) => (
            <div key={post._id}>
              {post}
            </div>
          ))}
        </div>
        {answerPosts.length > 5 && <div className="pagination-buttons">
          <button disabled={startIndex === 0} onClick={() => setStartIndex(startIndex - 5)}>Prev</button>
          <button disabled={startIndex + 5 >= answerPosts.length} onClick={() => setStartIndex(startIndex + 5)}>Next</button>
        </div>}
        {props.isLoggedIn && <button onClick={() => props.showAnswerForm(true)} id="answer-question-btn">Answer Question</button>}
      </div>}
    </div>
  );
}