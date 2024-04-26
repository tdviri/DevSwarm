const express = require('express');
const router = express.Router();
const QuestionController = require('./controllers/questionController');
const auth = require('../middleware/auth');

router.get('/retrievequestions', auth.verify, QuestionController.retrieveQuestions)
router.put('/addquestion', auth.verify, QuestionController.addQuestion)
router.put('/updatequestions', auth.verify, QuestionController.updateQuestions)
route.post('/handlevote', auth.verify, QuestionController.handleVote);

module.exports = router;