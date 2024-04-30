// Question Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    title: {type: String, required: true, maxlength: 50},
    summary: {type: String, required: true, maxlength: 140},
    text: {type: String, required: true},
    tags: [{type: Schema.Types.ObjectId, required: true}],
    answers: [{type: Schema.Types.ObjectId}],
    asked_by: {type: String, required: true},
    ask_date_time: {type: Date, default: Date.now},
    views: {type: Number, default: 0},
    votes: {type: Number, default: 0},
    isVoted: {type: Boolean, default: false}
});

QuestionSchema
.virtual('url')
.get(function () {
return '/question/' + this._id;
});

//Export model
module.exports = mongoose.model('Question', QuestionSchema);