const express = require('express');
const router = express.Router();
const AnswerController = require('../controllers/answerController');
const auth = require('../middleware/auth');

router.get('/api/retrieveanswers', AnswerController.retrieveAnswers)
router.post('/api/updateanswers', auth, AnswerController.updateAnswers)

module.exports = router;