const Answer = require('../models/answers');
const User = require('../models/users');
const Question = require('../models/questions');
const Comment = require('../models/comments');

const AnswerController = {
  async retrieveAnswers(req, res) {
    const answers = await Answer.find();
    res.send(answers);
  },

  async updateAnswers(req, res) {
    const newData = req.body;
    const insertedAnswer = await Answer.create(newData);
    res.send(insertedAnswer); 
  },

  async updateAnswerComments(req, res) {
    const answer = await Answer.findById(req.body.ans._id);
    answer.comments.push(req.body.comment._id);
    answer.save();
    res.send();
  },

  async editAnswer(req, res){
    const ans = await Answer.findById(req.body.origAns._id);
    ans.text = req.body.newAnsText;
    ans.save();
    res.send();
  },

  async deleteAnswer(req, res){
    await Question.findOneAndUpdate(
      { answers: req.body.answer._id },
      { $pull: { answers: req.body.answer._id } }, 
      { new: true } 
    );    
    await Comment.findOneAndUpdate(
      { answers: req.body.answer._id },
      { $pull: { answers: req.body.answer._id } }, 
      { new: true } 
    )
    await User.findOneAndUpdate(
      { votedAnswers: req.body.answer._id },
      { $pull: { votedAnswers: req.body.answer._id } }, 
      { new: true } 
    )
    await Answer.deleteOne(req.body.answer);
  }
};

module.exports = AnswerController;