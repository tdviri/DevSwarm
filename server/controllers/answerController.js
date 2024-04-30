const Answer = require('../models/answers');

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
  }
};

module.exports = AnswerController;