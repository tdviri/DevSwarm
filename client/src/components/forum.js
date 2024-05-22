import React from "react";
import "../stylesheets/App.css";
import QuestionPosts from "./questionPosts.js";
import NewestBtn from "./newestBtn.js";
import ActiveBtn from "./activeBtn.js";
import UnansweredBtn from "./unansweredBtn.js";
import AskQuestionForm from "./askQuestionForm.js";
import NoQuestionsFound from "./noQuestionsFound.js";
import Answers from "./answers.js";
import Tags from "./tags.js";
import AnswerQuestionForm from "./answerQuestionForm.js";
import UserTags from "./userTags.js";
import UserAnsweredQuestions from "./userAnsweredQuestions.js";

export default function Forum(props) {
  function displayQuestionCount() {
    return props.questions.length;
  }

  return (
    <div id="forum" className="forum">
      {!props.displayTagsPage &&
        props.displayAnswers &&
        !props.displayAnswerForm && (
          <Answers
            viewingUserAnswers={props.viewingUserAnswers}
            displayUserAnswers={props.displayUserAnswers}
            goToWelcomePage={props.goToWelcomePage}
            isGuest={props.isGuest}
            fetchData={props.fetchData}
            comments={props.comments}
            isLoggedIn={props.isLoggedIn}
            answers={props.answers}
            answerPageIndex={props.answerPageIndex}
            handleAskQuestionBtn={props.handleAskQuestionBtn}
            showAnswerForm={props.showAnswerForm}
            questions={props.questions}
          />
        )}
      {props.isAskQuestionBtnClicked && (
        <AskQuestionForm
          fetchData={props.fetchData}
          addNewQuestion={props.addNewQuestion}
          handleAskQuestionBtn={props.handleAskQuestionBtn}
          questions={props.questions}
          tags={props.tags}
          loggedInUser={props.loggedInUser}
        />
      )}
      {!props.displayTagsPage &&
        !props.displayAnswers &&
        props.displayEditAnswerForm && <editAnswerForm />}
      {!props.displayTagsPage &&
        !props.displayAnswers &&
        props.displayAnswerForm && (
          <AnswerQuestionForm
            setDisplayAnswers={props.setDisplayAnswers}
            setDisplayAnswerForm={props.setDisplayAnswerForm}
            answers={props.answers}
            answerPageIndex={props.answerPageIndex}
            handleAnswerPageIndex={props.handleAnswerPageIndex}
            questions={props.questions}
          />
        )}
      {!props.displayTagsPage &&
        !props.displayAnswers &&
        !props.displayAnswerForm &&
        !props.isAskQuestionBtnClicked && (
          <div>
            {!props.displayTagsPage && (
              <div id="forum-headers">
                <div className="forum-1">
                  <h1 id="forum-title" className="forum-title">
                    All Questions
                  </h1>
                  <div>
                    {props.isLoggedIn && (
                      <button
                        className="ask-question-btn"
                        onClick={() => props.handleAskQuestionBtn(true)}
                      >
                        Ask Question
                      </button>
                    )}
                  </div>
                </div>
                <div className="forum-2">
                  <h2
                    id="num-of-questions-header"
                    className="num-of-questions-header"
                  >
                    {displayQuestionCount()} Questions
                  </h2>
                  <div className="question-btn-container">
                    <NewestBtn setSortField={props.setSortField} />
                    <ActiveBtn setSortField={props.setSortField} />
                    <UnansweredBtn
                      toggleUnansweredBtnClicked={
                        props.toggleUnansweredBtnClicked
                      }
                      questions={props.questions}
                    />
                  </div>
                </div>
              </div>
            )}
            {props.questions.length === 0 && <NoQuestionsFound />}
            {props.questions.length !== 0 && !props.displayTagsPage && (
              <QuestionPosts
                isLoggedIn={props.isLoggedIn}
                comments={props.comments}
                fetchData={props.fetchData}
                goToWelcomePage={props.goToWelcomePage}
                isGuest={props.isGuest}
                loggedInuser={props.loggedInUser}
                tags={props.tags}
                answers={props.answers}
                setIsDisplayAnswerForm={props.setIsDisplayAnswerForm}
                handleAnswerPageIndex={props.handleAnswerPageIndex}
                answerPageIndex={props.answerPageIndex}
                questions={props.questions}
              />
            )}
          </div>
        )}
      {props.displayTagsPage && (
        <Tags
          isLoggedIn={props.isLoggedIn}
          setSearch={props.setSearch}
          setCurrentTag={props.setCurrentTag}
          setDisplayTagsPage={props.setDisplayTagsPage}
          tags={props.tags}
          handleAskQuestionBtn={props.handleAskQuestionBtn}
        />
      )}
    </div>
  );
}
