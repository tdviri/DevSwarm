const User = require('../models/users');
const Question = require('../models/questions')
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
      res.send(req.username);
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
    const question = await Question.findById(req.body.question);
    const user = await User.findById(req.userId);
    if (user.reputation < 50){
      return res.status(401).json({errorMessage: "Must have at least 50 reputation points to vote."});
    }
    if (req.body.upvote === true){
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
    const loggedInUser = req.user;
    if (loggedInUser.votedQuestions) {
        if (loggedInUser.votedQuestions.includes(req.params.question._id)) {
            res.send(true);
        } 
        else {
          res.send(false);
        }
    } 
    else {
      res.send(false);
    }
  }
};

module.exports = UserController;