const express = require('express');
const router = express.Router();
const AnswerController = require('./controllers/answerController');
const auth = require('./auth');

router.get('/retrieveanswers', auth.verify, AnswerController.retrieveAnswers)
router.put('/updateanswers', auth.verify, AnswerController.updateAnswers)

module.exports = router;