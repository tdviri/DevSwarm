const Question = require('../models/questions');
const Answer = require('../models/answers');
const Comment = require('../models/comments');
const User = require('../models/users')
const Tag = require('../models/tags');
const mongoose = require('mongoose'); 

const QuestionController = {
  async retrieveQuestions(req, res) {
    const questions = await Question.find();
    res.send(questions);
  },

  async addQuestion(req, res) {
    const newData = req.body;
    const insertedQuestion = await Question.create(newData);
    const user = await User.findById(req.userId);
    user.askedQuestions.push(insertedQuestion);
    user.save();
    res.send(insertedQuestion._id); 
  },

  async replaceQuestion(req, res) {
    await Question.replaceOne(
      { _id: req.body.origQuestion._id },
      req.body.newQuestion,
      { upsert: false }
  );
    
  res.send();
  },

  async updateQuestions(req, res) {
    const newData = req.body;
    await Question.findOneAndUpdate({ _id: newData._id }, newData);
    res.send();
  },

async deleteQuestion(req, res){
  //loop through comments that belong to answers that belong to question - delete each comment from user who commented, then delete comment from answer, then delete comment itself and the answer as well
  //loop through comments that belong to question - delete each comment from user who commented, then delete comment from question, then delete comment itself
  //loop through tags that belong to question - delete all *unique tags that belong to question 
  //delete question from user
  //delete question itself

  try {
    const answerIds = req.body.answers;
    await Promise.all(answerIds.map(async (answerId) => {
      const answer = await Answer.findById(answerId);
      if (answer) {
        const answerCommentIds = answer.comments;
        await Promise.all(answerCommentIds.map(async (commentId) => {
          await User.findOneAndUpdate(
            { commentsAdded: commentId },
            { $pull: { commentsAdded: commentId } },
            { new: true }
          );
          await Answer.findOneAndUpdate(
            { _id: answerId },
            { $pull: { comments: commentId } }
          );
          await Comment.findByIdAndDelete(commentId);
        }));
        await Answer.findByIdAndDelete(answerId);
      }
    }));

    await Promise.all(req.body.comments.map(async (questionCommentId) => {
      await User.findOneAndUpdate(
        { commentsAdded: questionCommentId },
        { $pull: { commentsAdded: questionCommentId } },
        { new: true }
      );

      await Question.findOneAndUpdate(
        { comments: questionCommentId },
        { $pull: { comments: questionCommentId } }
      );

      await Comment.findByIdAndDelete(questionCommentId);
    }));

    await Promise.all(req.body.tags.map(async (tagId) => {
      const isTagUsedByOtherQuestions = await Question.countDocuments({
        _id: { $ne: req.body._id },
        tags: tagId
      });

      if (isTagUsedByOtherQuestions === 0) {
        await Tag.findByIdAndDelete(tagId);
      }
    }));

    await User.findOneAndUpdate(
      { askedQuestions: req.body._id },
      { $pull: { askedQuestions: req.body._id } }
    );
    await Question.deleteOne({ _id: req.body._id });

    res.send();
  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(500).send("An error occurred while deleting data.");
  }
  },

  async updateQuestionComments(req, res) {
    const question = await Question.findById(req.body.questionId);
    question.comments.push(req.body.commentId);
    question.save();
    res.send();
  },
};

module.exports = QuestionController;