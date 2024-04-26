const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/questionController');
const auth = require('../middleware/auth');

router.get('/api/retrievequestions', QuestionController.retrieveQuestions)
router.put('/api/addquestion', auth, QuestionController.addQuestion)
router.put('/api/updatequestions', auth, QuestionController.updateQuestions)
router.post('/api/handlevote', auth, QuestionController.handleVote);

module.exports = router;