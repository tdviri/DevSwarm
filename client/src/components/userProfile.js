import React from 'react';
import '../stylesheets/App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserAnsweredQuestions from './userAnsweredQuestions';
import UserTags from './userTags';
import NewQuestion from './newQuestion';
import moment from 'moment';

export default function UserProfile(props) {
    const [userTags, setUserTags] = useState(null);
    const [userQuestions, setUserQuestions] = useState(null);
    const [questionToModify, setQuestionToModify] = useState(null);
    const [userAnsweredQuestions, setUserAnsweredQuestions] = useState(null);
    const [userReputation, setUserReputation] = useState(null);
    const [userAccountDuration, setUserAccountDuration] = useState(null);
    const [showUserTagsPage, setShowUserTagsPage] = useState(false);
    const [showUserAnsweredQuestionsPage, setShowUserAnsweredQuestionsPage] = useState(false);
    const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData(){
        let resp = await axios.get('http://localhost:8000/api/getuserquestions');
        setUserQuestions(resp.data.userQuestions);
        resp = await axios.get('http://localhost:8000/api/getusertags');
        setUserTags(resp.data.userTags);
        resp = await axios.get('http://localhost:8000/api/getuseransweredquestions');
        setUserAnsweredQuestions(resp.data.userAnswers);

        const loggedInUserResponse = await axios.get('http://localhost:8000/api/getLoggedInUser', {
            withCredentials: true,
            headers: {
            'Content-Type': 'application/json',
            }
        });
        const loggedInUser = loggedInUserResponse.data;
        const userRegistrationDate = loggedInUser.createdAt;
        setUserReputation(loggedInUser.reputation);
        setUserAccountDuration(moment().diff(userRegistrationDate, 'days'));
    }

    // function viewUserTagsPage(){
    //     setShowUserAnsweredQuestionsPage(false);
    //     setShowUserTagsPage(true);
    //     //re-render by calling fetchData?
    // }

    // function viewUserAnsweredQuestionsPage(){
    //     setShowUserTagsPage(false);
    //     setShowUserAnsweredQuestionsPage(true);
    //     //re-render by calling fetchData?
    // }

    function viewNewQuestionForm(userQuestion){
        setQuestionToModify(userQuestion);
        setShowNewQuestionForm(true);
    }

  return (
    <div>
        {!showNewQuestionForm && showUserTagsPage && <UserTags userTags={userTags}/>}
        {!showNewQuestionForm && showUserAnsweredQuestionsPage && <UserAnsweredQuestions userAnswers={userAnsweredQuestions}/>}
        {!showNewQuestionForm && !showUserTagsPage && !showUserAnsweredQuestionsPage && <div>
            <h1>Profile</h1>
            <div>{userReputation}</div>
            <div>{userAccountDuration}</div>
            <div>{userQuestions.map(userQuestion =>{return <div onClick={()=>viewNewQuestionForm(userQuestion)}>{userQuestion}</div>})}</div>
            <div onClick={()=>setShowUserTagsPage(true)}>View Your Tags</div>
            <div onClick={()=>setShowUserAnsweredQuestionsPage(true)}>View Your Answered Questions</div>
        </div>}
        {showNewQuestionForm && <NewQuestion handleAnswerPageIndex={props.handleAnswerPageIndex} userQuestions={questionToModify} userTags={userTags}/>}
    </div>
  );
}