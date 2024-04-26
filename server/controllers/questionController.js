const Question = require('../models/questions');

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
  },

  async handleVote(req, res){
      if (req.user.reputation < 50){
        return res.status(401).json({errorMessage: "Must have at least 50 reputation points to vote."});
      }
      if (req.body.upvote){
        req.user.reputation += 5;
        req.body.question.votes += 1;
      }
      else{
        req.user.reputation -= 10;
        req.body.question.votes -= 1;
      }
  }
};

module.exports = QuestionController;