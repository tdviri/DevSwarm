// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import "./stylesheets/App.css";
import React from "react";
import Navbar from "./components/navbar.js";
import Sidebar from "./components/sidebar.js";
import Forum from "./components/forum.js";
import Welcome from "./components/welcome.js";
import Register from "./components/register.js";
import Login from "./components/login.js";
import UserProfile from "./components/userProfile.js";
import { useState, useEffect } from "react";
import axios from "axios";

function getMostRecentAnswerTime(question, answers) {
  let mostRecentAnswerTime = 0;
  question.answers.forEach((ansId) => {
    const ans = answers.find((ans) => ans._id === ansId);
    if (ans && new Date(ans.ans_date_time).getTime() > mostRecentAnswerTime) {
      mostRecentAnswerTime = new Date(ans.ans_date_time).getTime();
    }
  });
  return mostRecentAnswerTime;
}

function App() {
  const [questions, setQuestions] = useState(null);
  const [search, setSearch] = useState("");
  const [answers, setAnswers] = useState(null);
  const [tags, setTags] = useState(null);
  const [comments, setComments] = useState(null);
  const [users, setUsers] = useState(null);
  const [displayAnswers, setDisplayAnswers] = useState(false);
  const [answerPageIndex, setAnswerPageIndex] = useState(-1);
  const [displayAnswerForm, setIsDisplayAnswerForm] = useState(false);
  const [displayTagsPage, setDisplayTagsPage] = useState(false);
  const [isAskQuestionBtnClicked, setIsAskQuestionBtnClicked] = useState(false);
  const [sortField, setSortField] = useState("ask_date_time");
  const [isUnansweredBtnClicked, setIsUnansweredBtnClick] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [isShowingTaggedQuestions, setIsShowingTaggedQuestions] =
    useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showRegisterPage, setShowRegisterPage] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [displayUserAnswers, setDisplayUserAnswers] = useState(false);
  const [clickedOnProfileSidebar, setClickedOnProfileSidebar] = useState(false);
  const [viewingUserAnswers, setViewingUserAnswers] = useState(false);
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      let response = await axios.get(
        "http://localhost:8000/api/retrievequestions",
      );
      setQuestions(response.data);
    } catch (error) {
      if (error.response) {
        console.error("System error");
      } else if (error.request) {
        console.error("Communication error");
      } else {
        console.error("System error");
      }
    }

    try {
      let response = await axios.get(
        "http://localhost:8000/api/retrieveanswers",
      );
      setAnswers(response.data);
    } catch (error) {
      if (error.response) {
        console.error("System error");
      } else if (error.request) {
        console.error("Communication error");
      } else {
        console.error("System error");
      }
    }

    try {
      let response = await axios.get("http://localhost:8000/api/retrievetags");
      setTags(response.data);
    } catch (error) {
      if (error.response) {
        console.error("System error");
      } else if (error.request) {
        console.error("Communication error");
      } else {
        console.error("System error");
      }
    }

    try {
      let response = await axios.get(
        "http://localhost:8000/api/retrievecomments",
      );
      setComments(response.data);
    } catch (error) {
      if (error.response) {
        console.error("System error");
      } else if (error.request) {
        console.error("Communication error");
      } else {
        console.error("System error");
      }
    }

    if (isLoggedIn) {
      try {
        let response = await axios.get(
          "http://localhost:8000/api/getLoggedInUser",
          { withCredentials: true },
        );
        if (response.data.email === "admin@gmail.com") {
          setIsAdmin(true);
        }
        setCurrentLoggedInUser(response.data);
      } catch (error) {
        if (error.response) {
          console.error("System error");
        } else if (error.request) {
          console.error("Communication error");
        } else {
          console.error("System error");
        }
      }
    }
  }

  function handleAnswerPage(index, questionsArr, showAnswers) {
    setViewingUserAnswers(true);
    setDisplayTagsPage(false);
    setShowUserProfile(false);
    setIsDisplayAnswerForm(false);
    setDisplayAnswers(showAnswers);
    const newIndex = getSorted().findIndex(
      (question) => question._id === questionsArr[index]._id,
    );
    setAnswerPageIndex(newIndex);
    questionsArr[index].views++;
    fetchData();
  }

  async function handleAnswerPageIndex(index, questionsArr, showAnswers) {
    setDisplayTagsPage(false);
    setShowUserProfile(false);
    setIsDisplayAnswerForm(false);
    setDisplayAnswers(showAnswers);
    setAnswerPageIndex(index);
    questionsArr[index].views++;
    const question = questionsArr[index];
    await axios.put("http://localhost:8000/api/updatequestions", question, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchData();
  }

  function showAnswerForm() {
    setIsDisplayAnswerForm(true);
    setDisplayAnswers(false);
  }

  function toggleDisplayTagsPage(value) {
    setDisplayTagsPage(value);
    setDisplayAnswers(false);
    setIsDisplayAnswerForm(false);
    setIsAskQuestionBtnClicked(false);
    if (value === true) {
      setIsShowingTaggedQuestions(true);
    } else {
      setIsShowingTaggedQuestions(false);
    }
    setShowUserProfile(false);
    setCurrentTag(null);
    setIsUnansweredBtnClick(false);
    setSortField("ask_date_time");
  }

  function handleAskQuestionBtn(value) {
    setIsAskQuestionBtnClicked(value);
    setDisplayAnswers(false);
    setIsDisplayAnswerForm(false);
    setDisplayTagsPage(false);
  }

  async function addNewQuestion(newQuestion) {
    await axios.post("http://localhost:8000/api/addquestion", newQuestion, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchData();
  }

  function toggleUnansweredBtnClicked() {
    setIsUnansweredBtnClick(!isUnansweredBtnClicked);
  }

  function getFilteredQuestions() {
    let filteredQuestions = questions;
    if (isUnansweredBtnClicked) {
      filteredQuestions = filteredQuestions.filter((question) => {
        return question.answers.length === 0;
      });
    }
    if (search) {
      let searchValues = search.split(" ");
      filteredQuestions = filteredQuestions.filter((question) => {
        let titleTerms = question.title.split(" ");
        let textTerms = question.text.split(" ");

        let found = searchValues.some((searchV) => {
          if (
            searchV.charAt(0) === "[" &&
            searchV.charAt(searchV.length - 1) === "]"
          ) {
            return question.tags.some((tagId) => {
              let tag = tags.find((tag) => tag._id === tagId);
              return (
                tag && tag.name === searchV.substring(1, searchV.length - 1)
              );
            });
          } else {
            return (
              titleTerms.some(
                (term) => term.toLowerCase() === searchV.toLowerCase(),
              ) ||
              textTerms.some(
                (term) => term.toLowerCase() === searchV.toLowerCase(),
              )
            );
          }
        });
        return found;
      });
    }
    if (currentTag) {
      filteredQuestions = filteredQuestions.filter((question) => {
        return question.tags.includes(currentTag);
      });
    }
    if (!isShowingTaggedQuestions && !isUnansweredBtnClicked && !search) {
      return questions;
    }
    return filteredQuestions;
  }

  function getSorted(value) {
    const filtered = getFilteredQuestions();
    if (sortField === null) {
      return filtered;
    }
    const sorted = filtered.sort((a, b) => {
      if (sortField === "ask_date_time") {
        return new Date(b.ask_date_time) - new Date(a.ask_date_time);
      }
      if (sortField === "ans_date_time") {
        const mostRecentTime1 = getMostRecentAnswerTime(a, answers);
        const mostRecentTime2 = getMostRecentAnswerTime(b, answers);
        return mostRecentTime2 - mostRecentTime1;
      }
    });
    return sorted;
  }

  const mapTags = tags?.map((tag) => {
    return {
      ...tag,
      questionCount: questions.filter((question) => {
        return question.tags.includes(tag._id);
      }).length,
    };
  });

  function handleSort(newSortField) {
    setSortField(newSortField);
    setIsUnansweredBtnClick(false);
  }

  function goToWelcomePage() {
    setIsLoggedIn(false);
    setIsGuest(false);
    setShowLoginPage(false);
    setShowRegisterPage(false);
  }

  async function switchUser(user) {
    const resp = await axios.get(
      `http://localhost:8000/api/switchuser/${user._id}`,
      { withCredentials: true },
    );
    fetchData();
    setIsAdmin(resp.data.isAdmin);
  }

  return (
    <div className="body">
      {!isLoggedIn && !isGuest && !showLoginPage && !showRegisterPage && (
        <Welcome
          setIsGuest={setIsGuest}
          setShowLoginPage={setShowLoginPage}
          setShowRegisterPage={setShowRegisterPage}
        />
      )}
      {showLoginPage && (
        <Login
          users={users}
          setShowLoginPage={setShowLoginPage}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
      {showRegisterPage && (
        <Register
          users={users}
          setUsers={setUsers}
          setShowRegisterPage={setShowRegisterPage}
          setShowLoginPage={setShowLoginPage}
        />
      )}
      {!showUserProfile &&
        questions &&
        answers &&
        tags &&
        (isLoggedIn || isGuest) && (
          <div>
            <Navbar
              setIsAdmin={setIsAdmin}
              setShowUserProfile={setShowUserProfile}
              goToWelcomePage={goToWelcomePage}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setIsGuest={setIsGuest}
              setSortField={setSortField}
              setCurrentTag={setCurrentTag}
              setSearch={setSearch}
            />
            <div id="main" className="main">
              <Sidebar
                setViewingUserAnswers={setViewingUserAnswers}
                fetchData={fetchData}
                setClickedOnProfileSidebar={setClickedOnProfileSidebar}
                toggleDisplayTagsPage={toggleDisplayTagsPage}
                isLoggedIn={isLoggedIn}
                setShowUserProfile={setShowUserProfile}
              />
              <Forum
                setDisplayAnswers={setDisplayAnswers}
                setDisplayAnswerForm={setIsDisplayAnswerForm}
                viewingUserAnswers={viewingUserAnswers}
                displayUserAnswers={displayUserAnswers}
                fetchData={fetchData}
                comments={comments}
                goToWelcomePage={goToWelcomePage}
                isGuest={isGuest}
                isLoggedIn={isLoggedIn}
                answers={answers}
                displayTagsPage={displayTagsPage}
                displayAnswers={displayAnswers}
                setSearch={setSearch}
                setCurrentTag={setCurrentTag}
                toggleUnansweredBtnClicked={toggleUnansweredBtnClicked}
                setSortField={handleSort}
                addNewQuestion={addNewQuestion}
                answerPageIndex={answerPageIndex}
                displayAnswerForm={displayAnswerForm}
                showAnswerForm={showAnswerForm}
                handleAskQuestionBtn={handleAskQuestionBtn}
                isAskQuestionBtnClicked={isAskQuestionBtnClicked}
                setDisplayTagsPage={setDisplayTagsPage}
                tags={mapTags}
                ansArray={answers}
                setQuestions={setQuestions}
                handleAnswerPageIndex={handleAnswerPageIndex}
                questions={getSorted()}
              />
            </div>
          </div>
        )}
      {showUserProfile && currentLoggedInUser && (
        <div>
          <Navbar
            setIsAdmin={setIsAdmin}
            setShowUserProfile={setShowUserProfile}
            goToWelcomePage={goToWelcomePage}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setIsGuest={setIsGuest}
            setSortField={setSortField}
            setCurrentTag={setCurrentTag}
            setSearch={setSearch}
          />
          <div id="main" className="main">
            <Sidebar
              setViewingUserAnswers={setViewingUserAnswers}
              fetchData={fetchData}
              setClickedOnProfileSidebar={setClickedOnProfileSidebar}
              toggleDisplayTagsPage={toggleDisplayTagsPage}
              isLoggedIn={isLoggedIn}
              setShowUserProfile={setShowUserProfile}
            />
            <UserProfile
              setCurrentLoggedInUser={setCurrentLoggedInUser}
              isAdmin={isAdmin}
              switchUser={switchUser}
              currentLoggedInUser={currentLoggedInUser}
              clickedOnProfileSidebar={clickedOnProfileSidebar}
              setClickedOnProfileSidebar={setClickedOnProfileSidebar}
              handleAnswerPage={handleAnswerPage}
              setDisplayUserAnswers={setDisplayUserAnswers}
              fetchData={fetchData}
              questions={getSorted()}
              setDisplayTagsPage={setDisplayTagsPage}
              showUserProfile={showUserProfile}
              setShowUserProfile={setShowUserProfile}
              setSearch={setSearch}
              setCurrentTag={setCurrentTag}
              tags={tags}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
