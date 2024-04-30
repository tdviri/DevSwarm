const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/api/register', UserController.registerUser);
router.post('/api/login', UserController.loginUser);
router.get('/api/logout', auth, UserController.logoutUser);
router.get('/api/getLoggedInUser', auth, UserController.getLoggedInUser);
router.put('/api/addvotedquestion', auth, UserController.addVotedQuestion);
router.get('/api/isquestionvoted/:id', auth, UserController.isQuestionVoted);
// router.put('/api/addUser', auth, UserController.addUser);
// router.get('/api/retrieveusers', UserController.retrieveUsers);

module.exports = router;
