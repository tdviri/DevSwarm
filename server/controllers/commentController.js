const Comment = require('../models/comments');
const User = require('../models/users');

const CommentController = {
    async retrieveComments(req, res) {
        const comments = await Comment.find();
        res.send(comments);
    },

    async addComment(req, res) {
        const commText = req.body.commentText;
        const user = await User.findById(req.userId);
        let newData = {text: commText, comm_by: user.username};
        const insertedComment = await Comment.create(newData);
        res.send(insertedComment); 
    }
};

module.exports = CommentController;