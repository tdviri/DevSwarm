const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/questionController');
const auth = require('../middleware/auth');

router.get('/api/retrievequestions', QuestionController.retrieveQuestions)
router.post('/api/addquestion', auth, QuestionController.addQuestion)
router.put('/api/updatequestions', auth, QuestionController.updateQuestions)
router.put('/api/handlevote', auth, QuestionController.handleVote);
router.get('/api/isquestionvoted/:id', auth, QuestionController.isQuestionVoted);

module.exports = router;