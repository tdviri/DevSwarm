const Comment = require('../models/comments');
const User = require('../models/users');
const mongoose = require('mongoose'); 

const CommentController = {
    async retrieveComments(req, res) {
        const comments = await Comment.find();
        res.send(comments);
    },

    async addComment(req, res) {
        const commText = req.body.commentText;
        const user = await User.findById(req.userId);
        if (user.reputation < 50){
            return res.status(401).json({errorMessage: "Minimum 50 reputation points are required to post a comment"});
        }
        if (commText.length > 140){
            return res.status(401).json({errorMessage: "Comment length cannot exceed 140 characters"});
        }
        let newData = {text: commText, comm_by: user.username};
        const insertedComment = await Comment.create(newData);
        user.commentsAdded.push(insertedComment);
        user.save();
        res.send(insertedComment); 
    }
};

module.exports = CommentController;