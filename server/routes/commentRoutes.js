const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.get('/api/retrievecomments', CommentController.retrieveComments);
router.post('/api/addcomment', auth, CommentController.addComment);

module.exports = router;