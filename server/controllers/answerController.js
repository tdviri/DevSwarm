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
  }
};

module.exports = AnswerController;