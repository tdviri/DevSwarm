// Answer Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    text: {type: String, required: true},
    ans_by: {type: String, required: true},
    ans_date_time: {type: Date, default: Date.now},
    comments: [{type: Schema.Types.ObjectId}],
    votes: {type: Number, default: 0}
});

AnswerSchema
.virtual('url')
.get(function () {
return '/answer/' + this._id;
});

//Export model
module.exports = mongoose.model('Answer', AnswerSchema);