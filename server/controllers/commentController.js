const Comment = require('../models/comments');

const CommentController = {
    async retrieveComments(req, res) {
        const comments = await Comment.find();
        res.send(comments);
    },

    async handleCommentVote(req, res) {
        const comment = await Comment.findById(req.body.comment);
        const user = await User.findById(req.userId);
        comment.votes += 1;
        comment.isVoted = true;
        comment.save();
        res.send();
    },

    async isCommentVoted(req, res) {
        console.log(req.params.id)
        const comment = await Comment.findById(req.params.id);
        res.send(comment.isVoted);
    },

    async addComment(req, res) {
        const newData = req.body.commentText;
        const insertedComment = await Comment.create(newData);
        res.send(insertedComment); 
    }
};

module.exports = CommentController;