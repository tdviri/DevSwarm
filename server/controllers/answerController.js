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
    const user = await User.findById(req.userId);
    const insertedAnswer = await Answer.create(newData);
    user.answersAdded.push(insertedAnswer);
    user.save();
    res.send(insertedAnswer); 
  },

  async updateAnswerComments(req, res) {
    const answer = await Answer.findById(req.body.ansId);
    answer.comments.push(req.body.commentId);
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
    await Question.findOneAndUpdate(
      { answers: req.body._id },
      { $pull: { answers: req.body._id } }, 
      { new: true } 
    );    
    const commentIds = req.body.comments;
    for (const commentId of commentIds){
      await User.findOneAndUpdate(
        { commentsAdded: commentId },
        { $pull: {commentsAdded: commentId }},
        { new: true }
      )
      await User.updateMany(
        {votedComments: commentId},
        { $pull: {votedComments: commentId}}
      )
    }
    await Comment.deleteMany({_id: { $in: req.body.comments }});
    await User.updateMany(
      { votedAnswers: req.body._id },
      { $pull: { votedAnswers: req.body._id } }
    )
    await User.findOneAndUpdate(
      { answersAdded: req.body._id },
      { $pull: { answersAdded: req.body._id } }, 
      { new: true } 
    )
    await Answer.deleteOne(req.body);
    res.send();
  }
  
};

module.exports = AnswerController;