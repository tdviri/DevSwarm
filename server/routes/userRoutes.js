const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/api/register', UserController.registerUser);
router.post('/api/login', UserController.loginUser);
router.get('/api/logout', auth, UserController.logoutUser);
router.get('/api/retrieveusers', auth, UserController.retrieveUsers);
router.get('/api/getLoggedInUser', auth, UserController.getLoggedInUser);
router.put('/api/addvotedquestion', auth, UserController.addVotedQuestion);
router.get('/api/isquestionvoted/:id', auth, UserController.isQuestionVoted);
router.put('/api/addvotedcomment', auth, UserController.addVotedComment);
router.get('/api/iscommentvoted/:id', auth, UserController.isCommentVoted);
router.put('/api/addvotedanswer', auth, UserController.addVotedAnswer);
router.get('/api/isanswervoted/:id', auth, UserController.isAnswerVoted);
router.get('/api/getuserquestions', auth, UserController.getUserQuestions);
router.get('/api/getusertags', auth, UserController.getUserTags);
router.get('/api/getuseransweredquestions', auth, UserController.getUserAnsweredQuestions);

// router.put('/api/addUser', auth, UserController.addUser);

module.exports = router;
