const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.get('/api/retrievecomments', CommentController.retrieveComments);
router.put('/api/handlecommentvote', auth, CommentController.handleCommentVote);
router.get('/api/iscommentvoted/:id', auth, CommentController.isCommentVoted);

module.exports = router;