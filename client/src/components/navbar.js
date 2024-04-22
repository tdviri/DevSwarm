import React from 'react';
import '../stylesheets/App.css';
import Searchbar from './searchbar.js';
import PropTypes from 'prop-types';

export default function Navbar(props) {

  return (
      <div id="header" className="header">
        <div className="title">
          Fake Stack Overflow
        </div>
        <Searchbar setCurrentTag={props.setCurrentTag} onChange={props.onSearch} setIsNoQuestionsFound={props.setIsNoQuestionsFound} handleIsNoQuestionsFound={props.handleIsNoQuestionsFound} setQuestions={props.setQuestions} questions={props.questions} tags={props.tags}/>
      </div>
  );
}

Navbar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    setIsNoQuestionsFound: PropTypes.func.isRequired,
    handleIsNoQuestionsFound: PropTypes.func.isRequired,
    setQuestions: PropTypes.func.isRequired,
    questions: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    setCurrentTag: PropTypes.func.isRequired
};