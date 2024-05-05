const User = require('../models/users');
const Question = require('../models/questions')
const Answer = require('../models/answers');
const Tag = require('../models/tags');
const Comment = require('../models/comments');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');

const UserController = {
  async registerUser(req, res) {
    const password = req.body.password;
    const verifyPassword = req.body.verifyPassword;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        passwordHash: passwordHash,
        reputation: 50
    });
    const emailID = newUser.email.split("@")[0];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    const isInvalidEmail = !emailRegex.test(newUser.email);
    const isDifferentPasswords = (password !== verifyPassword);
    const isPasswordContainsEmail = (password.indexOf(emailID) !== -1);
    const isPasswordContainsUsername = (password.indexOf(newUser.username) !== -1);
    const isPasswordContainsName = (password.indexOf(newUser.firstName) !== -1 || password.indexOf(newUser.lastName) !== -1);
    let user = User.findOne({ email: newUser.email });
    if (!user){
      return res.status(401).json({errorMessage: "Email is already registered."})
    }

    if (isInvalidEmail){
      return res.status(401).json({errorMessage: "Email is invalid."})
    }
    if (isDifferentPasswords){
      return res.status(401).json({errorMessage: "Passwords do not match."})
    }
    if (isPasswordContainsEmail){
      return res.status(401).json({errorMessage: "Password cannot contain your email."})
    }
    if (isPasswordContainsUsername){
      return res.status(401).json({errorMessage: "Password cannot contain your username."})
    }
    if (isPasswordContainsName){
      return res.status(401).json({errorMessage: "Password cannot contain your name."})
    }
    await newUser.save();
    res.send();
  },

  async loginUser(req, res) {
      const user = await User.findOne({ email: req.body.email });
      if (!user){
        return res.status(401).json({errorMessage: "Email is not registered."})
      }
      
      const passwordMatch = await bcrypt.compare(req.body.password, user.passwordHash);
      if (!passwordMatch){
        return res.status(401).json({errorMessage: "Password is incorrect."})
      }

    const token = jwt.sign({ userId: user._id }, 'JWT$3cr3tKey!#2024');
    res.set("authorization", token)
    res.cookie("token", token, {httpOnly: true }).status(200).json({success: true}).send();
  },

  logoutUser(req, res) {
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    res.status(200).json({ success: true }).send();
  },

  async getLoggedInUser(req, res) {
    try {
      const user = await User.findById(req.userId);
      res.status(200).json(user.username);
    } catch (error) {
        res.status(500).json({ errorMessage: "Error getting logged in user" });
    }
  },

  // async retrieveUsers(req, res) {
  //   const users = await User.find();
  //   res.send(users);
  // },

  async addUser(req, res) {
    const newData = req.body;
    await User.create(newData);
    res.send();
  },

  async addVotedQuestion(req, res){
    const upvote = req.body.upvote === 'true'; 
    const question = await Question.findById(req.body.question);
    const user = await User.findById(req.userId);
    if (user.reputation < 50){
      return res.status(401).json({errorMessage: "Must have at least 50 reputation points to vote."});
    }
    if (upvote === true){
      user.reputation += 5;
      question.votes += 1;
    }
    else{
      user.reputation -= 10;
      question.votes -= 1;
    }
    user.votedQuestions.push(question._id);
    user.save();
    question.save();
    res.send();
  },

  async isQuestionVoted(req, res){
    const user = await User.findById(req.userId);
    if (user.votedQuestions && user.votedQuestions.includes(req.params.id)) {
      res.send(true); 
    }
    else {
      res.send(false);
    }
  }, 

  async addVotedComment(req, res) {
    const comment = await Comment.findById(req.body.comment);
    const user = await User.findById(req.userId);
    if (user.reputation < 50){
      return res.status(401).json({errorMessage: "Must have at least 50 reputation points to vote."});
    }
    comment.votes += 1;
    user.votedComments.push(comment._id);
    user.save();
    comment.save();
    res.send();
},

async isCommentVoted(req, res) {
    const user = await User.findById(req.userId);
    if (user.votedComments && user.votedComments.includes(req.params.id)){
      res.send(true);
    }
    else {
      res.send(false);
    }
},

async addVotedAnswer(req, res){
  const upvote = req.body.upvote === 'true'; 
  const answer = await Answer.findById(req.body.answer);
  const user = await User.findById(req.userId);
  if (user.reputation < 50){
    return res.status(401).json({errorMessage: "Must have at least 50 reputation points to vote."});
  }
  if (upvote === true){
    user.reputation += 5;
    answer.votes += 1;
  }
  else{
    user.reputation -= 10;
    answer.votes -= 1;
  }
  user.votedAnswers.push(answer._id);
  user.save();
  answer.save();
  res.send();
},

async isAnswerVoted(req, res){
  const user = await User.findById(req.userId);
  if (user.votedAnswers && user.votedAnswers.includes(req.params.id)) {
    res.send(true); 
  }
  else {
    res.send(false);
  }
},

async getUserQuestions(req, res){
  // const user = await User.findById(req.userId).populate({
  //   path: 'askedQuestions'
  // }).exec();
  // console.log(user)
  // const userQuestions = user.askedQuestions;
  // res.status(200).json(userQuestions);
  const user = await User.findById(req.userId);
  let userQuestions = [];
  for (const askedQuestion of user.askedQuestions) {
    const question = await Question.findById(askedQuestion);
    userQuestions.push(question);
  }
  res.send(userQuestions);
},

async getUserTags(req, res){
    const user = await User.findById(req.userId);
    let tags = [];
    for (const askedQuestion of user.askedQuestions) {
      const question = await Question.findById(askedQuestion);
      tags.push([...question.tags]);
    }

    let userTags = [];
    for (const tag of tags){
      const t = await Tag.findById(tag);
      userTags.push(t);
    }
    res.send(userTags)
},

async getUserAnsweredQuestions(req, res){
  const user = await User.findById(req.userId);
  const questions = await Question.find();

  const filteredQuestions = await Promise.all(questions.map(async question => {
    for (const answer of question.answers) {
      const ans = await Answer.findById(answer);
      if (ans.ans_by === user.username) {
        return question;
      }
    }
    return null;
  }));

  const answeredQuestions = filteredQuestions.filter(question => question !== null);
  res.status(200).json(answeredQuestions);
}
};

module.exports = UserController;