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
        fetchUserData();
        if (props.clickedOnProfileSidebar){
            setShowNewQuestionForm(false);
            setShowUserTagsPage(false);
            setShowUserAnsweredQuestionsPage(false);
        }
    }, []);

    async function fetchUserData(){
        let resp = await axios.get('http://localhost:8000/api/getuserquestions',  {withCredentials: true});
        setUserQuestions(resp.data);
        resp = await axios.get('http://localhost:8000/api/getusertags',  {withCredentials: true}); 
        setUserTags(resp.data);
        console.log("fetching user tags in userProfile.js", resp.data)
        resp = await axios.get('http://localhost:8000/api/getuseransweredquestions',  { withCredentials: true });
        setUserAnsweredQuestions(resp.data);

        const loggedInUserResponse = await axios.get('http://localhost:8000/api/getLoggedInUser', {withCredentials: true});
        const loggedInUser = loggedInUserResponse.data;
        const userRegistrationDate = loggedInUser.createdAt;
        setUserReputation(loggedInUser.reputation);
        setUserAccountDuration(moment().diff(userRegistrationDate, 'days'));
    }

    function viewUserTagsPage(){
        props.setClickedOnProfileSidebar(false);
        setShowUserAnsweredQuestionsPage(false);
        setShowUserTagsPage(true);
        setShowNewQuestionForm(false);
        //re-render by calling fetchData?
    }

    function viewUserAnsweredQuestionsPage(){
        props.setClickedOnProfileSidebar(false);
        setShowUserAnsweredQuestionsPage(true);
        setShowUserTagsPage(false);
        setShowNewQuestionForm(false);
        //re-render by calling fetchData?
    }

    function viewNewQuestionForm(userQuestion){
        props.setClickedOnProfileSidebar(false);
        setQuestionToModify(userQuestion);
        setShowNewQuestionForm(true);
        setShowUserAnsweredQuestionsPage(false);
        setShowUserTagsPage(false);
    }

  return (
    <div className="user-profile">
        {!props.clickedOnProfileSidebar && !showNewQuestionForm && showUserTagsPage && <UserTags fetchUserData={fetchUserData} fetchData={props.fetchData} questions={props.questions} setDisplayTagsPage={props.setDisplayTagsPage} setShowUserProfile={props.setShowUserProfile} setSearch={props.setSearch} setCurrentTag={props.setCurrentTag} userTags={userTags}/>}
        {!props.clickedOnProfileSidebar && !showNewQuestionForm && showUserAnsweredQuestionsPage && <UserAnsweredQuestions handleAnswerPage={props.handleAnswerPage} setDisplayUserAnswers={props.setDisplayUserAnswers} fetchUserData={fetchUserData} tags={props.tags} userAnsweredQuestions={userAnsweredQuestions}/>}
        {props.clickedOnProfileSidebar && <div>
            <h1>Profile</h1>
            <div>Reputation: {userReputation}</div>
            <div>Account created {userAccountDuration} days ago</div>
            <div>{userQuestions && userQuestions.map(userQuestion =>{return <div onClick={()=>viewNewQuestionForm(userQuestion)}>{userQuestion.title}</div>})}</div>
            <div onClick={()=>viewUserTagsPage()}>View Your Tags</div>
            <div onClick={()=>viewUserAnsweredQuestionsPage()}>View Your Answered Questions</div>
        </div>}
        {!props.clickedOnProfileSidebar && showNewQuestionForm && <NewQuestion setUserQuestions={setUserQuestions} userQuestions={userQuestions} setClickedOnProfileSidebar={props.setClickedOnProfileSidebar} tags={props.tags} fetchData={props.fetchData} userQuestion={questionToModify} userTags={userTags}/>}
    </div>
  );
}