const Question = require('./models/questions');

const QuestionController = {
  async retrieveQuestions(req, res) {
    const questions = await Question.find();
    res.send(questions);
  },

  async updateQuestions(req, res) {
    const newData = req.body;
    await Question.deleteMany({}); 
    await Question.insertMany(newData); 
    res.send();
  },

  async addQuestion(req, res) {
    const newData = req.body;
    const insertedQuestion = await Question.create(newData);
    res.send(insertedQuestion); 
  }
};

module.exports = QuestionController;