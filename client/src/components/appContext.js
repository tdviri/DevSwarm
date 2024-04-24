import React, { createContext, useState, useContext } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  
  useEffect(()=> {
    fetchData();
  }, [])

  const [questions, setQuestions] = useState(null);
  const [search, setSearch] = useState('');
  const [answers, setAnswers] = useState(null);
  const [tags, setTags] = useState(null);
  const [users, setUsers] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isNoQuestionsFound, setIsNoQuestionsFound] = useState(false);
  const [displayAnswers, setDisplayAnswers] = useState(false);
  const [answerPageIndex, setAnswerPageIndex] = useState(-1);
  const [displayAnswerForm, setIsDisplayAnswerForm] = useState(false);
  const [displayTagsPage, setDisplayTagsPage] = useState(false);
  const [isAskQuestionBtnClicked, setIsAskQuestionBtnClicked] = useState(false);
  const [sortField, setSortField] = useState('ask_date_time');
  const [isUnansweredBtnClicked, setIsUnansweredBtnClick] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [isShowingTaggedQuestions, setIsShowingTaggedQuestions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showRegisterPage, setShowRegisterPage] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);

  async function fetchData() {
    console.log("Hi")
    console.log("fetch data")
    let response;
    response = await axios.get('http://localhost:8000/retrievequestions'); 
    setQuestions(response.data);
    response = await axios.get('http://localhost:8000/retrieveanswers');
    setAnswers(response.data);
    response = await axios.get('http://localhost:8000/retrievetags');
    setTags(response.data);
    // response = await axios.get('http://localhost:8000/retrieveusers');
    // setUsers(response.data);
 }


  return (
    <AppContext.Provider
      value={{
        questions,
        setQuestions,
        search,
        setSearch,
        answers,
        setAnswers,
        tags,
        setTags,
        users,
        setUsers,
        loggedInUser,
        setLoggedInUser,
        isNoQuestionsFound,
        setIsNoQuestionsFound,
        displayAnswers,
        setDisplayAnswers,
        answerPageIndex,
        setAnswerPageIndex,
        displayAnswerForm,
        setIsDisplayAnswerForm,
        displayTagsPage,
        setDisplayTagsPage,
        isAskQuestionBtnClicked,
        setIsAskQuestionBtnClicked,
        sortField,
        setSortField,
        isUnansweredBtnClicked,
        setIsUnansweredBtnClick,
        currentTag,
        setCurrentTag,
        isShowingTaggedQuestions,
        setIsShowingTaggedQuestions,
        isLoggedIn,
        setIsLoggedIn,
        isGuest,
        setIsGuest,
        showRegisterPage, 
        setShowRegisterPage, 
        fetchData,
        showLoginPage,
        setShowLoginPage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
