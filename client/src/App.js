// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import React from 'react';
import Navbar from './components/navbar.js';
import Sidebar from './components/sidebar.js';
import Forum from './components/forum.js';
import Welcome from './components/welcome.js';
import Register from './components/register.js';
import Login from './components/login.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function getMostRecentAnswerTime(question, answers) {
    let mostRecentAnswerTime = 0;
    question.answers.forEach(ansId => {
      const ans = answers.find(ans => ans._id === ansId);
      if (ans && new Date(ans.ans_date_time).getTime() > mostRecentAnswerTime) {
        mostRecentAnswerTime = new Date(ans.ans_date_time).getTime();
      }
    });
    return mostRecentAnswerTime;
  }

function App() {
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
  let response;

  useEffect(()=> {
    fetchData();
  }, [])

  async function fetchData() {
    console.log("Hi")
    console.log("fetch data")
    response = await axios.get('http://localhost:8000/retrievequestions'); 
    setQuestions(response.data);
    response = await axios.get('http://localhost:8000/retrieveanswers');
    setAnswers(response.data);
    response = await axios.get('http://localhost:8000/retrievetags');
    setTags(response.data);
    // response = await axios.get('http://localhost:8000/retrieveusers');
    // setUsers(response.data);
 }

  async function handleAnswerPageIndex(index, questionsArr, answerArr, showAnswers){
    setIsDisplayAnswerForm(false);
    setDisplayAnswers(showAnswers);
    setAnswerPageIndex(index);
    questionsArr[index].views++;
    console.log("updating all questions, **may result in deletion")
    await axios.put('http://localhost:8000/updatequestions', questionsArr);
    fetchData();
  }

  function showAnswerForm(){
    setIsDisplayAnswerForm(true);
    setDisplayAnswers(false);
  }

  function toggleDisplayTagsPage(value){
    setDisplayTagsPage(value);
    setDisplayAnswers(false);
    setIsDisplayAnswerForm(false);
    setIsAskQuestionBtnClicked(false);
    if (value === true){
      setIsShowingTaggedQuestions(true);
    }
    else{
      setIsShowingTaggedQuestions(false);
    }
    setCurrentTag(null);
    setIsUnansweredBtnClick(false);
    setSortField('ask_date_time');
  }

  function handleAskQuestionBtn(value){
    setIsAskQuestionBtnClicked(value);
    setDisplayAnswers(false);
    setIsDisplayAnswerForm(false);
    setDisplayTagsPage(false);
  }

  async function addNewQuestion(newQuestion){
    await axios.put('http://localhost:8000/addquestion', newQuestion);
    fetchData();
  }

  function toggleUnansweredBtnClicked(){
    setIsUnansweredBtnClick(!isUnansweredBtnClicked);
  }

  function getFilteredQuestions(){
    let filteredQuestions = questions;
    let isSearch = false;
    if (isUnansweredBtnClicked){
      filteredQuestions = filteredQuestions.filter(question => {
        return question.answers.length === 0;
      })
    }
    if (search){
      isSearch = true;
      let searchValues = search.split(" ");
      filteredQuestions = filteredQuestions.filter(question => {
        let titleTerms = question.title.split(" ");
        let textTerms = question.text.split(" ");

        let found = searchValues.some(searchV => {
            if (searchV.charAt(0) === '[' && searchV.charAt(searchV.length - 1) === ']') {
                return question.tags.some(tagId => {
                    let tag = tags.find(tag => tag._id === tagId);
                    return tag && tag.name === searchV.substring(1, searchV.length - 1);
                });
            } else {
                return titleTerms.some(term => term.toLowerCase() === searchV.toLowerCase()) ||
                    textTerms.some(term => term.toLowerCase() === searchV.toLowerCase());
            }
        });
        return found;
    });
    }
    if (currentTag){
      filteredQuestions = filteredQuestions.filter(question => {
        return question.tags.includes(currentTag);
      })
    }
    if (!isShowingTaggedQuestions && !isUnansweredBtnClicked && !search){
      return questions;
    }
    if (isSearch){
      return getSorted(filteredQuestions);
    }
    return filteredQuestions;
  }

  function getSorted(searchValues){
    let filtered = searchValues;
    if (searchValues === undefined){
      filtered = getFilteredQuestions();
    }
    if (sortField === null){
      return filtered;
    }
    const sorted = filtered.sort((a, b)=>{
      if (sortField === 'ask_date_time'){
        return new Date(b.ask_date_time) - new Date(a.ask_date_time);
      }
      if (sortField === 'ans_date_time'){
        const mostRecentTime1 = getMostRecentAnswerTime(a, answers);
        const mostRecentTime2 = getMostRecentAnswerTime(b, answers);
        return mostRecentTime2 - mostRecentTime1;
      }
    })
    return sorted;
  }

  const mapTags = tags?.map((tag)=>{
    return {
      ...tag,
      questionCount: questions.filter((question)=>{
        return question.tags.includes(tag._id);
      }).length
    }
  })

  function handleSort(newSortField){
    setSortField(newSortField);
    setIsUnansweredBtnClick(false);
  }

  return (
    // <div className="body">
    //   <Router>
    //     <Routes>
    //         {!isLoggedIn && !isGuest && (
    //           <Route exact path="/" element={<Welcome setIsGuest={setIsGuest} setIsLoggedIn={setIsLoggedIn} users={users} />} />
    //         )}
  
    //         <Route path="/login" element={<Login />} />
    //         <Route path="/register" element={<Register />} />
  
    //         {(isLoggedIn || isGuest) && (
    //           <Route path='/content' element={ <div>
    //             <Navbar setCurrentTag={setCurrentTag} onSearch={setSearch} setIsNoQuestionsFound={setIsNoQuestionsFound} questions={questions} tags={tags} />
    //             <div id="main" className="main">
    //               <Sidebar toggleDisplayTagsPage={toggleDisplayTagsPage} />
    //               <Forum setSearch={setSearch} displayTagsPage={displayTagsPage} setCurrentTag={setCurrentTag} toggleUnansweredBtnClicked={toggleUnansweredBtnClicked} setSortField={handleSort} addNewQuestion={addNewQuestion} fetchData={fetchData} answerPageIndex={answerPageIndex} displayAnswerForm={displayAnswerForm} displayAnswers={displayAnswers} showAnswerForm={showAnswerForm} handleAskQuestionBtn={handleAskQuestionBtn} isAskQuestionBtnClicked={isAskQuestionBtnClicked} setDisplayTagsPage={setDisplayTagsPage} tags={mapTags} ansArray={answers} setQuestions={setQuestions} handleAnswerPageIndex={handleAnswerPageIndex} isNoQuestionsFound={isNoQuestionsFound} questions={getSorted()} />
    //             </div>
    //           </div>
    //          } />
    //         )}
    //     </Routes>
    //   </Router>
    // </div>
<div className="body">
  <Router>
    <Routes>
      {!isLoggedIn && !isGuest && (
        <Route exact path="/" element={<Welcome setIsGuest={setIsGuest} setIsLoggedIn={setIsLoggedIn} users={users} />} />
      )}
      <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} users={users} setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/register" element={<Register setUsers={setUsers}/>} />
      {questions && answers && tags && (
        <Route path="/home" element={
          <div> 
            <Navbar setSortField={setSortField} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setCurrentTag={setCurrentTag} onSearch={setSearch} setIsNoQuestionsFound={setIsNoQuestionsFound} questions={questions} tags={tags} />
            <div id="main" className="main">
              <Sidebar toggleDisplayTagsPage={toggleDisplayTagsPage} />
              <Forum 
                loggedInUser={loggedInUser}
                isLoggedIn={isLoggedIn}
                setSearch={setSearch} 
                displayTagsPage={displayTagsPage} 
                setCurrentTag={setCurrentTag} 
                toggleUnansweredBtnClicked={toggleUnansweredBtnClicked} 
                setSortField={handleSort} 
                addNewQuestion={addNewQuestion} 
                fetchData={fetchData} 
                answerPageIndex={answerPageIndex} 
                displayAnswerForm={displayAnswerForm} 
                displayAnswers={displayAnswers} 
                showAnswerForm={showAnswerForm} 
                handleAskQuestionBtn={handleAskQuestionBtn} 
                isAskQuestionBtnClicked={isAskQuestionBtnClicked} 
                setDisplayTagsPage={setDisplayTagsPage} 
                tags={mapTags} 
                ansArray={answers} 
                setQuestions={setQuestions} 
                handleAnswerPageIndex={handleAnswerPageIndex} 
                isNoQuestionsFound={isNoQuestionsFound} 
                questions={getSorted()} 
              />
            </div>
          </div>
        } />
      )}
    </Routes>
  </Router>
</div>

  );
}

export default App;

