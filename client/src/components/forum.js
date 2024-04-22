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
import PropTypes from 'prop-types';

export default function Forum(props) {
  function displayQuestionCount(){
    return props.questions.length;
  }

  return (
    <div id="forum" className="forum">
        {!props.displayTagsPage && props.displayAnswers && !props.displayAnswerForm && <Answers handleAskQuestionBtn={props.handleAskQuestionBtn} ansArray={props.ansArray} showAnswerForm={props.showAnswerForm} index={props.answerPageIndex} questions={props.questions} /> }
        {props.isAskQuestionBtnClicked && <AskQuestionForm addNewQuestion={props.addNewQuestion} handleAskQuestionBtn={props.handleAskQuestionBtn} fetchData={props.fetchData} tags={props.tags} questions={props.questions} />} 
        {!props.displayTagsPage && !props.displayAnswers && props.displayAnswerForm && <AnswerQuestionForm ansArray={props.ansArray} handleAnswerPageIndex={props.handleAnswerPageIndex} questions={props.questions} index={props.answerPageIndex} />}
        {!props.displayTagsPage && !props.displayAnswers && !props.displayAnswerForm && !props.isAskQuestionBtnClicked &&
        <div>
          {!props.displayTagsPage && (<div id="forum-headers">
            <div className="forum-1">
                <h1 id="forum-title" className="forum-title">All Questions</h1>
                <div>
                  <button className="ask-question-btn" onClick={()=>props.handleAskQuestionBtn(true)}>Ask Question</button>
                </div>
            </div>
            <div className="forum-2">
              <h2 id="num-of-questions-header" className="num-of-questions-header">{displayQuestionCount()} Questions</h2>
              <div className="question-btn-container">
                <NewestBtn setSortField={props.setSortField} questions={props.questions} />
                <ActiveBtn setSortField={props.setSortField} ansArray={props.ansArray} questions={props.questions} />
                <UnansweredBtn toggleUnansweredBtnClicked={props.toggleUnansweredBtnClicked} questions={props.questions} />
              </div>
            </div>
          </div>)}
        {props.questions.length === 0 && <NoQuestionsFound/>}
        {props.questions.length !== 0 && !props.displayTagsPage && <QuestionPosts tags={props.tags} ansArray={props.ansArray} setIsDisplayAnswerForm={props.setIsDisplayAnswerForm} handleAnswerPageIndex={props.handleAnswerPageIndex} answerPageIndex={props.answerPageIndex} questions={props.questions}/>}
        </div>}
        {props.displayTagsPage && <Tags setSearch={props.setSearch} setDisplayTagsPage={props.setDisplayTagsPage} setCurrentTag={props.setCurrentTag} handleAskQuestionBtn={props.handleAskQuestionBtn} tags={props.tags} questions={props.questions} />}
  </div>
  );
}

Forum.propTypes = {
    displayTagsPage: PropTypes.bool.isRequired,
    displayAnswers: PropTypes.bool.isRequired,
    displayAnswerForm: PropTypes.bool.isRequired,
    handleAskQuestionBtn: PropTypes.func.isRequired,
    isAskQuestionBtnClicked: PropTypes.bool.isRequired,
    addNewQuestion: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    tags: PropTypes.array.isRequired,
    questions: PropTypes.array.isRequired,
    ansArray: PropTypes.array.isRequired,
    showAnswerForm: PropTypes.func.isRequired,
    answerPageIndex: PropTypes.number.isRequired,
    setSortField: PropTypes.func.isRequired,
    toggleUnansweredBtnClicked: PropTypes.func.isRequired,
    setIsDisplayAnswerForm: PropTypes.func.isRequired,
    handleAnswerPageIndex: PropTypes.func.isRequired,
    setCurrentTag: PropTypes.func.isRequired,
    setDisplayTagsPage: PropTypes.func.isRequired,
    setSearch: PropTypes.func.isRequired
};