//User Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    username: {type: String, required: true},
    passwordHash: {type: String, required: true},
    reputation: {type: Number, default: 50},
    votedQuestions: [{type: Schema.Types.ObjectId}],
    votedAnswers: [{type: Schema.Types.ObjectId}],
    votedComments: [{type: Schema.Types.ObjectId}],
    askedQuestions: [{type: Schema.Types.ObjectId}],
    answersAdded: [{type: Schema.Types.ObjectId}],
    tagsCreated: [{type: Schema.Types.ObjectId}],
    commentsAdded: [{type: Schema.Types.ObjectId}],
    isAdmin: {type: Boolean, default: false}
}, { timestamps: true });

UserSchema
.virtual('url')
.get(function () {
return '/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);