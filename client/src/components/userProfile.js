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
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        console.log("isAdmin: ", props.currentLoggedInUser.isAdmin)
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
        if (props.currentLoggedInUser){
            resp = await axios.get('http://localhost:8000/api/retrieveusers', {withCredentials: true});
            setAllUsers(resp.data);
        }

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

    async function deleteUser(user, index){
        await axios.delete(`http://localhost:8000/api/deleteuser/${user._id}`, {withCredentials: true});
        allUsers.splice(index, 1);
    }

  return (
    <div className="user-profile">
        {!props.clickedOnProfileSidebar && !showNewQuestionForm && showUserTagsPage && <UserTags fetchUserData={fetchUserData} fetchData={props.fetchData} questions={props.questions} setDisplayTagsPage={props.setDisplayTagsPage} setShowUserProfile={props.setShowUserProfile} setSearch={props.setSearch} setCurrentTag={props.setCurrentTag} userTags={userTags}/>}
        {!props.clickedOnProfileSidebar && !showNewQuestionForm && showUserAnsweredQuestionsPage && <UserAnsweredQuestions handleAnswerPage={props.handleAnswerPage} setDisplayUserAnswers={props.setDisplayUserAnswers} fetchUserData={fetchUserData} tags={props.tags} userAnsweredQuestions={userAnsweredQuestions}/>}
        {props.clickedOnProfileSidebar && <div>
            <h1>Profile</h1>
            <h3>Account Details</h3>
            <div>Reputation: {userReputation}</div>
            <div>Account created {userAccountDuration} days ago</div>
            <h3>Questions Asked</h3>
            {userQuestions && userQuestions.length === 0 && <div>Currently no questions asked</div>}
            <div>{userQuestions && userQuestions.map(userQuestion =>{return <div onClick={()=>viewNewQuestionForm(userQuestion)}>{userQuestion?.title}</div>})}</div>
            <h3>View More</h3>
            <div onClick={()=>viewUserTagsPage()}>View Your Tags</div>
            <div onClick={()=>viewUserAnsweredQuestionsPage()}>View Your Answered Questions</div>
            {props.currentLoggedInUser && props.currentLoggedInUser.isAdmin && <h3>All Users</h3>}
            {props.currentLoggedInUser && props.currentLoggedInUser.isAdmin && <div className="admin-profile-list-of-users">{allUsers?.map((user, index) => <div className="admin-profile-user-container"><div onClick={()=>{props.switchUser(user); fetchUserData()}}>Username: {user.username}, User ID: {user._id}</div><button onClick={()=>deleteUser(user, index)}>Delete User</button></div>)}</div>}
        </div>}
        {!props.clickedOnProfileSidebar && showNewQuestionForm && <NewQuestion setUserQuestions={setUserQuestions} userQuestions={userQuestions} setClickedOnProfileSidebar={props.setClickedOnProfileSidebar} tags={props.tags} fetchData={props.fetchData} userQuestion={questionToModify} userTags={userTags}/>}
    </div>
  );
}