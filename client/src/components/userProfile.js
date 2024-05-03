import React from 'react';
import '../stylesheets/App.css';
import { useState } from 'react';
import axios from 'axios';
const moment = require('moment');

export default async function UserProfile(props) {
    const resp = await axios.get('http://localhost:8000/api/getuserquestions');
    const userQuestions = resp.userQuestions.data;
    const userTags = resp.userTags.data;
    const loggedInUser = await axios.get('http://localhost:8000/api/getLoggedInUser', {withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    }}).data;
    const userReputation = loggedInUser.reputation;
    const userRegistrationDate = loggedInUser.createdAt;
    const userAccountDuration = moment().diff(userRegistrationDate, 'days'); 

    // function viewUserTagsPage(){

    // }

    // function viewUserAnsweredQuestionsPage(){

    // }

  return (
    <div>
        <h1>Profile</h1>
        <div>{userQuestions.map(userQuestion =>{return <div>{userQuestion}</div>})}</div>
        <div onClick={()=>viewUserTagsPage()}>View Your Tags</div>
        <div onClick={()=>viewUserAnsweredQuestionsPage()}>View Your Answered Questions</div>
    </div>
  );
}