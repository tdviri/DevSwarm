const Comment = require('../models/comments');

const CommentController = {
    async retrieveComments(req, res) {
        const comments = await Comment.find();
        res.send(comments);
    },

    async addComment(req, res) {
        const commText = req.body.commentText;
        const user = req.userId;
        let newData = {commText, user};
        const insertedComment = await Comment.create(newData);
        res.send(insertedComment); 
    }
};

module.exports = CommentController;