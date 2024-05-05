const Question = require('../models/questions');
const Answer = require('../models/answers');
const Comment = require('../models/comments');
const User = require('../models/users')

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
    const user = await User.findById(req.userId);
    user.askedQuestions.push(insertedQuestion);
    user.save();
    res.send(insertedQuestion._id); 
  },

  async replaceQuestion(req, res) {
    await Question.replaceOne(
      { _id: ObjectId(req.body.origQuestion._id) },
      req.body.newQuestion,
      { upsert: false }
    );
    res.send();
  },

  async deleteQuestion(req, res){
    for (ansId of req.body.userQuestion.answers){
      Answer.deleteOne({_id: ObjectId(ansId)});
    }
    for (commId of req.body.userQuestion.comments){
      Comment.deleteOne({_id: ObjectId(commId)});
    }
    await Question.deleteOne({ _id: ObjectId(req.body.userQuestion._id) });
    res.send();
  }
};

module.exports = QuestionController;