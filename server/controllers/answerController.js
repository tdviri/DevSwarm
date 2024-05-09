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
    res.send(ans);
  },

  async deleteAnswer(req, res){
    console.log("deleting answer")
    await Question.findOneAndUpdate(
      { answers: req.body._id },
      { $pull: { answers: req.body._id } }, 
      { new: true } 
    );    
    await Comment.findOneAndUpdate(
      { answers: req.body._id },
      { $pull: { answers: req.body._id } }, 
      { new: true } 
    )
    await User.findOneAndUpdate(
      { votedAnswers: req.body._id },
      { $pull: { votedAnswers: req.body._id } }, 
      { new: true } 
    )
    await Answer.deleteOne(req.body);
    res.send();
  }
};

module.exports = AnswerController;