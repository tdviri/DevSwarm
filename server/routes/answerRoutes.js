const express = require('express');
const router = express.Router();
const AnswerController = require('../controllers/answerController');
const auth = require('../middleware/auth');

router.get('/api/retrieveanswers', auth, AnswerController.retrieveAnswers)
router.put('/api/updateanswers', auth, AnswerController.updateAnswers)

module.exports = router;