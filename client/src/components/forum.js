import React from 'react';
import '../stylesheets/App.css';
import QuestionPosts from './questionPosts.js';
import NewestBtn from './newestBtn.js';
import ActiveBtn from './activeBtn.js';
import UnansweredBtn from './unansweredBtn.js';
import AskQuestionForm from './askQuestionForm.js';
import NoQuestionsFound from './noQuestionsFound.js';
import Answers from './answers.js';
import Tags from './tags.js';
import AnswerQuestionForm from './answerQuestionForm.js';
import { useAppContext } from './appContext.js';

export default function Forum(props) {
  const {displayTagsPage , displayAnswerForm , displayAnswers ,isAskQuestionBtnClicked} = useAppContext();

  function displayQuestionCount(){
      return props.questions.length;
  }

  return (
    <div id="forum" className="forum">
        {!displayTagsPage && displayAnswers && !displayAnswerForm && <Answers handleAskQuestionBtn={props.handleAskQuestionBtn} showAnswerForm={props.showAnswerForm} questions={props.questions} /> }
        {isAskQuestionBtnClicked && <AskQuestionForm addNewQuestion={props.addNewQuestion} handleAskQuestionBtn={props.handleAskQuestionBtn} questions={props.questions} />} 
        {!displayTagsPage && !displayAnswers && displayAnswerForm && <AnswerQuestionForm handleAnswerPageIndex={props.handleAnswerPageIndex} questions={props.questions} />}
        {!displayTagsPage && !displayAnswers && !displayAnswerForm && !isAskQuestionBtnClicked &&
        <div>
          {!props.displayTagsPage && (<div id="forum-headers">
            <div className="forum-1">
                <h1 id="forum-title" className="forum-title">All Questions</h1>
                <div>
                  {props.isLoggedIn && <button className="ask-question-btn" onClick={()=>props.handleAskQuestionBtn(true)}>Ask Question</button>}
                </div>
            </div>
            <div className="forum-2">
              <h2 id="num-of-questions-header" className="num-of-questions-header">{displayQuestionCount()} Questions</h2>
              <div className="question-btn-container">
                <NewestBtn handleSort={props.handleSort} />
                <ActiveBtn handleSort={props.setSortField} />
                <UnansweredBtn toggleUnansweredBtnClicked={props.toggleUnansweredBtnClicked} questions={props.questions} />
              </div>
            </div>
          </div>)}
        {props.questions.length === 0 && <NoQuestionsFound/>}
        {props.questions.length !== 0 && !props.displayTagsPage && <QuestionPosts setIsDisplayAnswerForm={props.setIsDisplayAnswerForm} handleAnswerPageIndex={props.handleAnswerPageIndex} answerPageIndex={props.answerPageIndex} questions={props.questions}/>}
        </div>}
        {displayTagsPage && <Tags handleAskQuestionBtn={props.handleAskQuestionBtn} />}
  </div>
  );
}