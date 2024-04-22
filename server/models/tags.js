// Tag Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
    name: {type: String, required: true},
});

TagSchema
.virtual('url')
.get(function () {
return '/tag/' + this._id;
});

//Export model
module.exports = mongoose.model('Tag', TagSchema);