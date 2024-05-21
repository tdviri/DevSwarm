// Comment Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    text: {type: String, required: true},
    comm_by: {type: String, required: true},
    comm_date_time: {type: Date, default: Date.now},
    votes: {type: Number, default: 0}
});

CommentSchema
.virtual('url')
.get(function () {
return '/comment/' + this._id;
});

//Export model
module.exports = mongoose.model('Comment', CommentSchema);