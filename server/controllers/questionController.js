const Question = require('../models/questions');
const User = require('../models/users')

const QuestionController = {
  async retrieveQuestions(req, res) {
    const questions = await Question.find();
    res.send(questions);
  },

  async updateQuestions(req, res) {
    console.log("update questions", req.body)
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
      const question = await Question.findById(req.body.question);
      const user = await User.findById(req.userId);
      if (user.reputation < 50){
        return res.status(401).json({errorMessage: "Must have at least 50 reputation points to vote."});
      }
      if (req.body.upvote){
        user.reputation += 5;
        question.votes += 1;
      }
      else{
        user.reputation -= 10;
        question.votes -= 1;
      }
      question.isVoted = true;
      user.save();
      question.save();
      res.send();
  },

  async isQuestionVoted(req, res){
    console.log(req.params.id)
    const question = await Question.findById(req.params.id);
    res.send(question.isVoted);
  },
};

module.exports = QuestionController;