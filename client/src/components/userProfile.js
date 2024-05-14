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
    const [displayUserDeletionWarning, setDisplayUserDeletionWarning] = useState(false);
    const [userToWarn, setUserToWarn] = useState(null);
    const [allUsers, setAllUsers] = useState([]);

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
        await axios.delete('http://localhost:8000/api/deleteuser',  {data: { user: user}, withCredentials: true});
        allUsers.splice(index, 1);
        fetchUserData();
        props.fetchData();
    }

  return (
    <div className="user-profile">
        {!props.clickedOnProfileSidebar && !showNewQuestionForm && showUserTagsPage && <UserTags fetchUserData={fetchUserData} fetchData={props.fetchData} questions={props.questions} setDisplayTagsPage={props.setDisplayTagsPage} setShowUserProfile={props.setShowUserProfile} setSearch={props.setSearch} setCurrentTag={props.setCurrentTag} userTags={userTags}/>}
        {!props.clickedOnProfileSidebar && !showNewQuestionForm && showUserAnsweredQuestionsPage && <UserAnsweredQuestions handleAnswerPage={props.handleAnswerPage} setDisplayUserAnswers={props.setDisplayUserAnswers} fetchUserData={fetchUserData} tags={props.tags} userAnsweredQuestions={userAnsweredQuestions}/>}
        {props.clickedOnProfileSidebar && <div className="user-profile-container">
            <h1 className="user-profile-main-header">Profile</h1>
            <h3 className="user-profile-account-details-header">Account Details</h3>
            <div className="user-profile-reputation">Reputation: {userReputation}</div>
            <div className="user-profile-account-duration">Account created {userAccountDuration} days ago</div>
            <h3 className="user-profile-questions-asked-header">Questions Asked</h3>
            {userQuestions && userQuestions.length === 0 && <div className="user-profile-no-questions-asked">Currently no questions asked</div>}
            <div className="user-profile-asked-questions-list">{userQuestions && userQuestions.map(userQuestion =>{return <div className="user-profile-asked-question" onClick={()=>viewNewQuestionForm(userQuestion)}>{userQuestion?.title}</div>})}</div>
            <h3 className="user-profile-view-more-header">View More</h3>
            <div className="user-profile-view-tags" onClick={()=>viewUserTagsPage()}>View Your Tags</div>
            <div className="user-profile-answered-questions" onClick={()=>viewUserAnsweredQuestionsPage()}>View Your Answered Questions</div>
            {props.currentLoggedInUser && props.isAdmin && <h3 className="admin-profile-all-users-header">All Users</h3>} 
            {props.currentLoggedInUser && props.isAdmin && allUsers?.length > 1 && <div className="admin-profile-list-of-users">
                {allUsers?.map((user, index) => 
                <div className="admin-profile-user-container">
                    <div className="admin-profile-user-info" onClick={()=>{props.switchUser(user); fetchUserData(); props.setCurrentLoggedInUser(user); props.setShowUserProfile(false)}}>Username: {user.username}, Email: {user.email}</div><span className="admin-profile-user-info-seperator">.......</span>
                    {user.email !== 'admin@gmail.com' && user._id !== props.currentLoggedInUser._id && <button className="admin-profile-delete-user-btn" onClick={()=>{setDisplayUserDeletionWarning(true); setUserToWarn(user)}}>Delete User</button>}
                    {userToWarn === user && displayUserDeletionWarning && <div className="user-deletion-confirmation-container">
                        <span>Are you sure you want to remove the user?</span>
                        <button className="delete-user-yes-option-btn" onClick={()=>{deleteUser(user, index); setDisplayUserDeletionWarning(false); setUserToWarn(null)}}>Yes</button>
                        <button className="delete-user-no-option-btn" onClick={()=>{setDisplayUserDeletionWarning(false); setUserToWarn(null)}}>No</button>
                    </div>}
                </div>)}
            </div>}
            {props.currentLoggedInUser && props.isAdmin && allUsers?.length === 1 && <div className="admin-profile-no-users-message">No other user accounts created</div>}
        </div>}
        {!props.clickedOnProfileSidebar && showNewQuestionForm && <NewQuestion setUserQuestions={setUserQuestions} userQuestions={userQuestions} setClickedOnProfileSidebar={props.setClickedOnProfileSidebar} tags={props.tags} fetchData={props.fetchData} userQuestion={questionToModify} userTags={userTags}/>}
    </div>
  );
}