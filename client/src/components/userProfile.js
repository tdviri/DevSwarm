import React from 'react';
import '../stylesheets/App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserAnsweredQuestions from './userAnsweredQuestions';
import UserTags from './userTags';
const moment = require('moment');

export default function UserProfile(props) {
    const [userTags, setUserTags] = useState(null);
    const [userQuestions, setUserQuestions] = useState(null);
    const [userReputation, setUserReputation] = useState(null);
    const [userAccountDuration, setUserAccountDuration] = useState(null);
    const [showUserTagsPage, setShowUserTagsPage] = useState(false);
    const [showUserAnsweredQuestionsPage, setShowUserAnsweredQuestionsPage] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
        const resp = await axios.get('http://localhost:8000/api/getuserquestions');
        setUserQuestions(resp.data.userQuestions);
        setUserTags(resp.data.userTags);
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
        };
        fetchData();
    }, []);

    function viewUserTagsPage(){
        setShowUserAnsweredQuestionsPage(false);
        setShowUserTagsPage(true);
    }

    function viewUserAnsweredQuestionsPage(){
        setShowUserTagsPage(false);
        setShowUserAnsweredQuestionsPage(true);
    }

  return (
    <div>
        {showUserTagsPage && <UserTags userTags={userTags}/>}
        {showUserAnsweredQuestionsPage && <UserAnsweredQuestions/>}
        {!showUserTagsPage && !showUserAnsweredQuestionsPage && <div>
            <h1>Profile</h1>
            <div>{userReputation}</div>
            <div>{userAccountDuration}</div>
            <div>{userQuestions.map(userQuestion =>{return <div>{userQuestions}</div>})}</div>
            <div onClick={()=>viewUserTagsPage()}>View Your Tags</div>
            <div onClick={()=>viewUserAnsweredQuestionsPage()}>View Your Answered Questions</div>
        </div>}
    </div>
  );
}