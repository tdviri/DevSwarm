const User = require('../models/users');
const Question = require('../models/questions')
const Answer = require('../models/answers');
const Tag = require('../models/tags');
const Comment = require('../models/comments');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');
const mongoose = require('mongoose'); 

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
    let user = await User.findOne({ email: newUser.email });
    if (user){
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
    // if (isPasswordContainsUsername){
    //   return res.status(401).json({errorMessage: "Password cannot contain your username."})
    // }
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

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, 'JWT$3cr3tKey!#2024');
    // res.set("authorization", token)
    res.cookie("token", token, {httpOnly: true }).status(200).json({success: true}).send();
  },

  logoutUser(req, res) {
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    res.status(200).json({ success: true }).send();
  },

  async getLoggedInUser(req, res) {
    try {
      const user = await User.findById(req.userId);
      res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ errorMessage: "Error getting logged in user" });
    }
  },

  async retrieveUsers(req, res) {
    const users = await User.find();
    res.send(users);
  },

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
    let tagIds = new Set(); 
    for (const askedQuestion of user.askedQuestions) {
        const question = await Question.findById(askedQuestion);
        if (question && question.tags) {
            question.tags.forEach(tag => {
              tagIds.add(tag._id.toString());
            });
        }
    }
    let userTags = await Tag.find({ '_id': { $in: Array.from(tagIds) } });
    res.send(userTags);
},

async getUserAnsweredQuestions(req, res){
  const user = await User.findById(req.userId);
  const questions = await Question.find();

  const filteredQuestions = await Promise.all(questions.map(async question => {
    for (const answer of question.answers) {
      const ans = await Answer.findById(answer);
      if (ans?.ans_by === user.username) {
        return question;
      }
    }
    return null;
  }));

  const answeredQuestions = filteredQuestions.filter(question => question !== null);
  res.status(200).json(answeredQuestions);
},

async switchUser (req, res) {
  const userToLoginAs = await User.findById(req.params.userId);
  const impersonationToken = jwt.sign({ userId: userToLoginAs._id, isAdmin: true }, 'JWT$3cr3tKey!#2024');
  res.cookie("token", impersonationToken, { httpOnly: true }).status(200).json({isAdmin: true});
},

async deleteUser (req, res){
  //loop through tags created by user - delete *unique tags created by user
  //loop through comments created by user - check if comment belongs to question or an answer, then delete the comment from either question or answer; then delete comment itself 
  //loop through answers created by user - loop through comments that belong to answer - delete comment from user, then delete the comment from answer, then delete comment - then delete answer from question it belongs to, then delete answer itself
  //loop through questions created by user - loop through answers that belong to question - loop through comments that belong to question - delete comment from user that belongs to answer delete each question, then delete comment from answer, then delete comment itself - delete answer from user that created it, delete answer from question it belongs to, then delete answer itself - delete question itself finally
  //then delete user

  console.log(req.body.user.email);
  console.log(req.body.user.tagsCreated)
  try {
    const user = await User.findById(req.body.user._id);
    await Promise.all(user.tagsCreated.map(async (tagId) => {
      const isTagUsedByOtherUsers = await User.countDocuments({
        _id: { $ne: user._id }, 
        tagsCreated: tagId
      });

      if (isTagUsedByOtherUsers === 0) {
        await Tag.findByIdAndDelete(tagId);
      }
    }));

    await Promise.all(user.commentsAdded.map(async (commentId) => {
      const commentExistsInQuestion = await Question.findOne({ comments: commentId }).lean();
      const commentExistsInAnswer = await Answer.findOne({ comments: commentId }).lean();
      if (commentExistsInQuestion) {
        await Question.findOneAndUpdate(
          { comments: commentId },
          { $pull: { comments: commentId } }
        );
      } else if (commentExistsInAnswer) {
        await Answer.findOneAndUpdate(
          { comments: commentId },
          { $pull: { comments: commentId } }
        );
      }
      await Comment.findByIdAndDelete(commentId);
    }));

    await Promise.all(user.answersAdded.map(async (answerId) => {
      const answer = await Answer.findById(answerId);
      if (answer) {
        await Promise.all(answer.comments.map(async (commentId) => {
          await User.findOneAndUpdate(
            { commentsAdded: commentId },
            { $pull: { commentsAdded: commentId } }
          );
          await Answer.findOneAndUpdate(
            { comments: commentId },
            { $pull: { comments: commentId } }
          );
          await Comment.findByIdAndDelete(commentId);
        }));
        await Question.findOneAndUpdate(
          { answers: answerId },
          { $pull: { answers: answerId } }
        );
        await Answer.findByIdAndDelete(answerId);
      }
    }));

    await Promise.all(user.askedQuestions.map(async (questionId) => {
      const question = await Question.findById(questionId);
      if (question) {
        await Promise.all(question.answers.map(async (answerId) => {
          const answer = await Answer.findById(answerId);
          if (answer) {
            await Promise.all(answer.comments.map(async (commentId) => {
              await User.findOneAndUpdate(
                { commentsAdded: commentId },
                { $pull: { commentsAdded: commentId } }
              );
              await Answer.findOneAndUpdate(
                { comments: commentId },
                { $pull: { comments: commentId } }
              );
              await Comment.findByIdAndDelete(commentId);
            }));
            await User.findOneAndUpdate(
              { answersAdded: answerId },
              { $pull: { answersAdded: answerId } }
            );
            await Question.findOneAndUpdate(
              { answers: answerId },
              { $pull: { answers: answerId } }
            );
            await Answer.findByIdAndDelete(answerId);
          }
        }));
        await Question.findByIdAndDelete(questionId);
      }
    }));

    await User.findByIdAndDelete(user._id);
    res.send();
  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(500).send("An error occurred while deleting data.");
  }
}
};

module.exports = UserController;