const express = require('express');
const router = express.Router();
const AnswerController = require('../controllers/answerController');
const auth = require('../middleware/auth');

router.get('/api/retrieveanswers', AnswerController.retrieveAnswers)
router.post('/api/updateanswers', auth, AnswerController.updateAnswers)
router.put('/api/updateanswercomments', auth, AnswerController.updateAnswerComments);
router.put('/api/editanswer', auth, AnswerController.editAnswer);
router.delete('/api/deleteanswer', auth, AnswerController.deleteAnswer);

module.exports = router;