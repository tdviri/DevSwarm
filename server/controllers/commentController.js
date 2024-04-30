const Comment = require('../models/comments');

const CommentController = {
    async retrieveComments(req, res) {
        const comments = await Comment.find();
        res.send(comments);
    },
};

module.exports = CommentController;