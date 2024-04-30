const Comment = require('../models/comments');

const CommentController = {
    async retrieveComments(req, res) {
        const comments = await Comment.find();
        res.send(comments);
    },

    async addComment(req, res) {
        const newData = req.body.commentText;
        const insertedComment = await Comment.create(newData);
        res.send(insertedComment); 
    }
};

module.exports = CommentController;