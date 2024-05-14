const Question = require('../models/questions');
const Answer = require('../models/answers');
const Comment = require('../models/comments');
const User = require('../models/users')
const Tag = require('../models/tags');

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

async deleteQuestion(req, res){
  await Tag.deleteMany({ _id: { $in: req.body.tags } });
  await User.findOneAndUpdate(
      { votedQuestions: req.body._id },
      { $pull: { votedQuestions: req.body._id } }, 
      { new: true } 
    )
  await User.findOneAndUpdate(
      { askedQuestions: req.body._id },
      { $pull: { askedQuestions: req.body._id } }, 
      { new: true } 
    )
    await Question.deleteOne(req.body);
    res.send();
  },

  async updateQuestionComments(req, res) {
    const question = await Question.findById(req.body.questionId);
    question.comments.push(req.body.commentId);
    question.save();
    res.send();
  },
};

module.exports = QuestionController;