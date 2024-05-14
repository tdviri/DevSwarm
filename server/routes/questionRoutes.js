const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/questionController');
const auth = require('../middleware/auth');

router.get('/api/retrievequestions', QuestionController.retrieveQuestions)
router.post('/api/addquestion', auth, QuestionController.addQuestion)
router.put('/api/replacequestion', auth, QuestionController.replaceQuestion);
router.delete('/api/deletequestion', auth, QuestionController.deleteQuestion);
router.put('/api/updatequestioncomments', auth, QuestionController.updateQuestionComments);

module.exports = router;