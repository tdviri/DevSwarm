// Question Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    title: {type: String, required: true, maxlength: 100,},
    text: {type: String, required: true},
    tags: [{type: Schema.Types.ObjectId, required: true}],
    answers: [{type: Schema.Types.ObjectId}],
    asked_by: {type: String, default: 'Anonymous'},
    ask_date_time: {type: Date, default: Date.now},
    views: {type: Number, default: 0},
});

QuestionSchema
.virtual('url')
.get(function () {
return '/question/' + this._id;
});

//Export model
module.exports = mongoose.model('Question', QuestionSchema);